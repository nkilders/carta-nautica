import { MarkersService } from '../services/markers.service';
import { Marker, MarkerFeature } from '../models/markers';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { ZIndex } from '../utils/z-indices';
import { ActionSheetWrapper } from '../wrappers/action-sheet-wrapper';
import { addIcons } from 'ionicons';
import { closeCircle, locate } from 'ionicons/icons';
import { MapService } from '../services/map.service';
import { FeatureLike } from 'ol/Feature';
import { TranslateService } from '@ngx-translate/core';

export function createMarkersLayerManager(
  mapSrv: MapService,
  markersSrv: MarkersService,
  actionSheetCtrl: ActionSheetWrapper,
  translate: TranslateService,
) {
  return new MarkersLayerManager(
    mapSrv,
    markersSrv,
    actionSheetCtrl,
    translate,
  );
}

class MarkersLayerManager {
  private layer?: VectorLayer;
  private layerSource?: VectorSource;
  private markers: Map<string, MarkerFeature>;

  constructor(
    private mapSrv: MapService,
    private markersSrv: MarkersService,
    private actionSheetCtrl: ActionSheetWrapper,
    private translate: TranslateService,
  ) {
    this.markers = new Map();

    addIcons({
      closeCircle,
      locate,
    });

    this.createLayer();
    this.registerListeners();
    this.reloadAllMarkers();
  }

  private createLayer() {
    this.layerSource = new VectorSource();

    this.layer = new VectorLayer({
      source: this.layerSource,
      zIndex: ZIndex.MARKERS,
    });

    this.mapSrv.getMap().addLayer(this.layer);
  }

  private registerListeners() {
    this.mapSrv.on('featureClicked', async (feature) => {
      await this.onFeatureClicked(feature);
    });

    this.markersSrv.on('create', (markerId, marker) =>
      this.onMarkerCreated(marker),
    );
    this.markersSrv.on('update', (markerId, marker) =>
      this.onMarkerUpdated(markerId, marker),
    );
    this.markersSrv.on('delete', (markerId, marker) =>
      this.onMarkerDeleted(markerId),
    );
  }

  private async onFeatureClicked(feature: FeatureLike) {
    if (!(feature instanceof MarkerFeature)) {
      return;
    }

    await this.showMarkerActionSheet(feature.getMarker());
  }

  private onMarkerCreated(marker: Marker) {
    this.addMarker(marker);
  }

  private onMarkerUpdated(markerId: string, marker: Marker) {
    const markerFeature = this.markers.get(markerId);
    if (!markerFeature) {
      return;
    }

    markerFeature.onMarkerUpdated(marker);
  }

  private onMarkerDeleted(markerId: string) {
    const marker = this.markers.get(markerId);
    if (!marker) {
      return;
    }

    this.layerSource?.removeFeature(marker);
    this.markers.delete(markerId);
  }

  private async showMarkerActionSheet(marker: Marker) {
    const flyToText = this.translate.instant('markerClick.flyTo');
    const cancelText = this.translate.instant('general.cancel');

    const actionSheet = await this.actionSheetCtrl.create({
      header: marker.name,
      buttons: [
        {
          text: flyToText,
          icon: 'locate',
          handler: async () => {
            const { longitude, latitude } = marker;
            this.mapSrv.flyTo(longitude, latitude, 15, 1000);
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

  private async reloadAllMarkers() {
    this.removeAllMarkers();

    const allMarkers = await this.markersSrv.getAll();

    allMarkers.forEach((marker) => {
      this.addMarker(marker);
    });
  }

  private addMarker(marker: Marker) {
    const feature = new MarkerFeature(marker);

    this.layerSource?.addFeature(feature);
    this.markers.set(marker.id, feature);
  }

  private removeAllMarkers() {
    this.markers.forEach((marker) => {
      this.layerSource?.removeFeature(marker);
    });

    this.markers.clear();
  }
}
