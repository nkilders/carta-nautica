import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { ZIndex } from '../utils/z-indices';
import { ActionSheetWrapper } from '../wrappers/action-sheet-wrapper';
import { addIcons } from 'ionicons';
import { closeCircle, trash } from 'ionicons/icons';
import { MapService } from '../services/map.service';
import Feature, { FeatureLike } from 'ol/Feature';
import { TranslateService } from '@ngx-translate/core';
import { Route, StopFeature } from '../models/route-planning';
import { RoutePlanningService } from '../services/route-planning.service';
import { LineString } from 'ol/geom';
import { GeolocationService } from '../services/geolocation.service';
import { Stroke, Style } from 'ol/style';

export function createRoutePlanningLayerManager(
  // Controllers
  actionSheetController: ActionSheetWrapper,
  // Services
  geoService: GeolocationService,
  mapService: MapService,
  routePlanningService: RoutePlanningService,
  translateService: TranslateService,
) {
  return new RoutePlanningLayerManager(
    actionSheetController,
    geoService,
    mapService,
    routePlanningService,
    translateService,
  );
}

class RoutePlanningLayerManager {
  private readonly layerSource: VectorSource;
  private readonly lineFeature: Feature;

  private stopFeatures: StopFeature[];

  constructor(
    // Controllers
    private readonly actionSheetController: ActionSheetWrapper,
    // Services
    private readonly geolocationService: GeolocationService,
    private readonly mapService: MapService,
    private readonly routePlanningService: RoutePlanningService,
    private readonly translateService: TranslateService,
  ) {
    this.layerSource = new VectorSource();
    this.lineFeature = this.createLineFeature();
    this.stopFeatures = [];

    addIcons({
      closeCircle,
      trash,
    });

    this.createLayerAndAddToMap(this.layerSource);
    this.registerListeners();
  }

  private createLineFeature() {
    const line = new Feature();

    line.setStyle(
      new Style({
        stroke: new Stroke({
          color: 'rgb(231, 76, 60)',
          width: 3,
        }),
      }),
    );

    return line;
  }

  private createLayerAndAddToMap(source: VectorSource) {
    const layer = new VectorLayer({
      source,
      zIndex: ZIndex.ROUTE_PLANNING,
    });

    this.mapService.getMap().addLayer(layer);
  }

  private registerListeners() {
    this.mapService.on('featureClicked', async (feature) => {
      await this.onFeatureClicked(feature);
    });

    this.routePlanningService.on('update', (route) => {
      this.updateRoute(route);
    });

    this.geolocationService.watchPosition(() => {
      if (this.stopFeatures.length === 0) {
        return;
      }

      this.updateLineStringGeometry();
    });
  }

  private async onFeatureClicked(feature: FeatureLike) {
    if (!(feature instanceof StopFeature)) {
      return;
    }

    await this.showStopActionSheet(feature.getSequence());
  }

  private async showStopActionSheet(sequence: number) {
    const headerText = this.translateService.instant('routeStop.header', {
      sequence: sequence + 1,
    });
    const deleteText = this.translateService.instant('general.delete');
    const cancelText = this.translateService.instant('general.cancel');

    const actionSheet = await this.actionSheetController.create({
      header: headerText,
      buttons: [
        {
          text: deleteText,
          icon: 'trash',
          handler: () => {
            this.routePlanningService.removeStop(sequence);
          },
        },
        {
          text: cancelText,
          icon: 'close-circle',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  private updateRoute(route: Route) {
    this.layerSource.clear();
    this.stopFeatures = [];

    route.forEach((stop, index) => {
      const stopFeature = new StopFeature(stop, index);
      this.stopFeatures.push(stopFeature);
      this.layerSource.addFeature(stopFeature);
    });

    this.updateLineStringGeometry();
    this.layerSource.addFeature(this.lineFeature);
  }

  private updateLineStringGeometry() {
    const currentPos = this.geolocationService.getPosition().coords;
    const stopCoordinates = this.stopFeatures.map((stop) => {
      const { longitude, latitude } = stop.getStop();
      return [longitude, latitude];
    });

    this.lineFeature.setGeometry(
      new LineString([
        [currentPos.longitude, currentPos.latitude],
        ...stopCoordinates,
      ]),
    );
  }
}
