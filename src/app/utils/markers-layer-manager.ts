import { Feature, Map as OLMap } from 'ol';
import { MarkersService } from '../services/markers.service';
import { Marker, MarkerFeature } from '../models/markers';
import { Geometry, Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Text, Style, Circle } from 'ol/style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { ZIndex } from './z-indices';

export class MarkersLayerManager {
  private layer?: VectorLayer;
  private layerSource?: VectorSource;
  private markers: Map<string, Feature<Geometry>>;

  constructor(
    private map: OLMap,
    private markersSrv: MarkersService,
  ) {
    this.markers = new Map();

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

    this.map.addLayer(this.layer);
  }

  private registerListeners() {
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

  private onMarkerCreated(marker: Marker) {
    this.addMarker(marker);
  }

  private onMarkerUpdated(markerId: string, marker: Marker) {
    const markerFeature = this.markers.get(markerId);
    if (!markerFeature) {
      return;
    }

    markerFeature.setGeometry(new Point([marker.longitude, marker.latitude]));

    const markerStyle = markerFeature.getStyle() as Style;
    markerStyle.getText()?.setText(marker.name);
  }

  private onMarkerDeleted(markerId: string) {
    const marker = this.markers.get(markerId);
    if (!marker) {
      return;
    }

    this.layerSource?.removeFeature(marker);
    this.markers.delete(markerId);
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
