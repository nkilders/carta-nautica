import { MarkersService } from '../services/markers.service';
import { Marker, MarkerFeature } from '../models/markers';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { ZIndex } from '../utils/z-indices';
import { ActionSheetWrapper } from '../wrappers/action-sheet-wrapper';
import { addIcons } from 'ionicons';
import { closeCircle, locate, pencil, trash } from 'ionicons/icons';
import { MapService } from '../services/map.service';
import { FeatureLike } from 'ol/Feature';
import { TranslateService } from '@ngx-translate/core';
import { MarkersEditPage } from '../pages/markers-edit/markers-edit.page';
import { ModalWrapper } from '../wrappers/modal-wrapper';
import { AlertWrapper } from '../wrappers/alert-wrapper';

export function createMarkersLayerManager(
  // Controllers
  actionSheetController: ActionSheetWrapper,
  alertController: AlertWrapper,
  modalController: ModalWrapper,
  // Services
  mapService: MapService,
  markersService: MarkersService,
  translateService: TranslateService,
) {
  return new MarkersLayerManager(
    actionSheetController,
    alertController,
    modalController,
    mapService,
    markersService,
    translateService,
  );
}

class MarkersLayerManager {
  private readonly layerSource: VectorSource;
  private readonly markers: Map<string, MarkerFeature>;

  constructor(
    // Controllers
    private readonly actionSheetController: ActionSheetWrapper,
    private readonly alertController: AlertWrapper,
    private readonly modalController: ModalWrapper,
    // Services
    private readonly mapService: MapService,
    private readonly markersService: MarkersService,
    private readonly translateService: TranslateService,
  ) {
    this.layerSource = new VectorSource();
    this.markers = new Map();

    addIcons({
      closeCircle,
      locate,
      pencil,
      trash,
    });

    this.createLayer(this.layerSource);
    this.registerListeners();
    this.reloadAllMarkers();
  }

  private createLayer(source: VectorSource) {
    const layer = new VectorLayer({
      source,
      zIndex: ZIndex.MARKERS,
    });

    this.mapService.getMap().addLayer(layer);
  }

  private registerListeners() {
    this.mapService.on('featureClicked', async (feature) => {
      await this.onFeatureClicked(feature);
    });

    this.markersService.on('create', (markerId, marker) =>
      this.onMarkerCreated(marker),
    );
    this.markersService.on('update', (markerId, marker) =>
      this.onMarkerUpdated(markerId, marker),
    );
    this.markersService.on('delete', (markerId, marker) =>
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

    this.layerSource.removeFeature(marker);
    this.markers.delete(markerId);
  }

  private async showMarkerActionSheet(marker: Marker) {
    const flyToText = this.translateService.instant('markerClick.flyTo');
    const editText = this.translateService.instant('general.edit');
    const deleteText = this.translateService.instant('general.delete');
    const cancelText = this.translateService.instant('general.cancel');

    const actionSheet = await this.actionSheetController.create({
      header: marker.name,
      buttons: [
        {
          text: flyToText,
          icon: 'locate',
          handler: async () => {
            const { longitude, latitude } = marker;
            this.mapService.flyTo(longitude, latitude, 15, 1000);
          },
        },
        {
          text: editText,
          icon: 'pencil',
          handler: async () => this.editMarker(marker),
        },
        {
          text: deleteText,
          icon: 'trash',
          handler: async () => this.confirmDeleteMarker(marker),
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

    const allMarkers = await this.markersService.getAll();

    allMarkers.forEach((marker) => {
      this.addMarker(marker);
    });
  }

  private addMarker(marker: Marker) {
    const feature = new MarkerFeature(marker);

    this.layerSource.addFeature(feature);
    this.markers.set(marker.id, feature);
  }

  private removeAllMarkers() {
    this.markers.forEach((marker) => {
      this.layerSource.removeFeature(marker);
    });

    this.markers.clear();
  }

  private async editMarker(marker: Marker) {
    const modal = await this.modalController.create({
      component: MarkersEditPage,
      componentProps: {
        marker,
      },
    });

    modal.onWillDismiss().then(async () => {
      await this.reloadAllMarkers();
    });

    await modal.present();
  }

  private async confirmDeleteMarker(marker: Marker) {
    const deleteTitleText = this.translateService.instant(
      'markers.deleteConfirmHeader',
    );
    const cancelText = this.translateService.instant('general.cancel');
    const deleteText = this.translateService.instant('general.delete');

    const alert = await this.alertController.create({
      header: deleteTitleText,
      subHeader: marker.name,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
        },
        {
          text: deleteText,
          handler: async () => {
            await this.markersService.delete(marker.id);
            await alert.dismiss();
            await this.reloadAllMarkers();
          },
        },
      ],
    });

    await alert.present();
  }
}
