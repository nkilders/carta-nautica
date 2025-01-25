import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { ZIndex } from './z-indices';
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

export function createRoutePlanningLayerManager(
  mapSrv: MapService,
  routePlanningSrv: RoutePlanningService,
  geoSrv: GeolocationService,
  actionSheetCtrl: ActionSheetWrapper,
  translate: TranslateService,
) {
  return new RoutePlanningLayerManager(
    mapSrv,
    routePlanningSrv,
    geoSrv,
    actionSheetCtrl,
    translate,
  );
}

class RoutePlanningLayerManager {
  private readonly layerSource: VectorSource;

  private stopFeatures: StopFeature[];
  private lineFeature?: Feature;

  constructor(
    private mapSrv: MapService,
    private routePlanningSrv: RoutePlanningService,
    private geolocationSrv: GeolocationService,
    private actionSheetCtrl: ActionSheetWrapper,
    private translate: TranslateService,
  ) {
    this.stopFeatures = [];

    addIcons({
      closeCircle,
      trash,
    });

    this.layerSource = this.createLayerSource();
    this.createLayer();
    this.registerListeners();
  }

  private createLayerSource() {
    return new VectorSource();
  }

  private createLayer() {
    const layer = new VectorLayer({
      source: this.layerSource,
      zIndex: ZIndex.ROUTE_PLANNING,
    });

    this.mapSrv.getMap().addLayer(layer);
  }

  private registerListeners() {
    this.mapSrv.on('featureClicked', async (feature) => {
      await this.onFeatureClicked(feature);
    });

    this.routePlanningSrv.on('update', (route) => {
      this.updateRoute(route);
    });

    this.geolocationSrv.watchPosition(() => {
      if (this.stopFeatures.length === 0) {
        return;
      }

      // TODO: check if stops are reached and can be removed
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
    const deleteText = this.translate.instant('routeStop.delete');
    const cancelText = this.translate.instant('routeStop.cancel');

    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: deleteText,
          icon: 'trash',
          handler: () => {
            this.routePlanningSrv.removeStop(sequence);
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

  private async updateRoute(route: Route) {
    this.layerSource.clear();
    this.stopFeatures = [];

    route.forEach((stop, index) => {
      const stopFeature = new StopFeature(stop, index);
      this.stopFeatures.push(stopFeature);
      this.layerSource.addFeature(stopFeature);
    });

    this.lineFeature = new Feature();
    this.updateLineStringGeometry();
    this.layerSource.addFeature(this.lineFeature);
  }

  private updateLineStringGeometry() {
    const currentPos = this.geolocationSrv.getPosition().coords;
    const stopCoordinates = this.stopFeatures.map((stop) => {
      const { longitude, latitude } = stop.getStop();
      return [longitude, latitude];
    });

    this.lineFeature?.setGeometry(
      new LineString([
        [currentPos.longitude, currentPos.latitude],
        ...stopCoordinates,
      ]),
    );
  }
}
