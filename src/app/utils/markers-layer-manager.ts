import { MarkersService } from '../services/markers.service';
import { Marker, MarkerFeature } from '../models/markers';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { ZIndex } from './z-indices';
import { ActionSheetWrapper } from '../wrappers/action-sheet-wrapper';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';
import { MapService } from '../services/map.service';
import { FeatureLike } from 'ol/Feature';

export class MarkersLayerManager {
  private layer?: VectorLayer;
  private layerSource?: VectorSource;
  private markers: Map<string, MarkerFeature>;

  constructor(
    private mapSrv: MapService,
    private markersSrv: MarkersService,
    private actionSheetCtrl: ActionSheetWrapper,
  ) {
    this.markers = new Map();

    addIcons({
      closeCircle,
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
    const actionSheet = await this.actionSheetCtrl.create({
      header: marker.name,
      buttons: [
        {
          text: 'Abbrechen',
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
