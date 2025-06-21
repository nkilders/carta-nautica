import { Feature, Map as OLMap } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Track } from '../models/tracks';
import { Stroke, Style } from 'ol/style';
import { ZIndex } from '../utils/z-indices';
import { LineString } from 'ol/geom';

export function createTrackViewLayerManager(map: OLMap, track: Track) {
  return new TrackViewLayerManager(map, track);
}

class TrackViewLayerManager {
  private readonly line: LineString;
  private readonly layer: VectorLayer;

  constructor(
    private readonly map: OLMap,
    private readonly track: Track,
  ) {
    this.line = this.createLine();
    this.layer = this.createLayer();

    this.addLayerAndFocusTrack();
  }

  private createLine() {
    const points = [...this.track.points];
    points.sort((a, b) => a.timestamp - b.timestamp);

    const coordinates = points.map((point) => [
      point.longitude,
      point.latitude,
    ]);

    return new LineString(coordinates);
  }

  private createLayer() {
    return new VectorLayer({
      source: new VectorSource({
        features: [
          new Feature({
            geometry: this.line,
          }),
        ],
      }),
      style: new Style({
        stroke: new Stroke({
          color: '#e74c3c',
          width: 4,
        }),
      }),
      zIndex: ZIndex.TRACK,
    });
  }

  private addLayerAndFocusTrack() {
    this.map.addLayer(this.layer);

    this.map.getView().fit(this.line.getExtent(), {
      padding: [5, 5, 5, 5],
      maxZoom: 10,
    });
  }
}
