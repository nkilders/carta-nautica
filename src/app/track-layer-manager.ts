import { Feature, Map as OLMap } from 'ol';
import { TrackRecorderService } from './services/track-recorder.service';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Point, Track, TrackWithoutId } from './models/tracks';
import { Stroke, Style } from 'ol/style';
import { ZIndex } from './z-indices';
import { LineString } from 'ol/geom';

export class TrackLayerManager {
  private layer?: VectorLayer;
  private line?: LineString;

  constructor(
    private map: OLMap,
    private trackRecorder: TrackRecorderService,
  ) {
    this.registerListeners();
  }

  private registerListeners() {
    this.trackRecorder.on('startRecording', () => this.onStartRecording());
    this.trackRecorder.on('stopRecording', (track) => this.onStopRecording());
    this.trackRecorder.on('newPoint', (track, point) => this.onNewPoint(point));
  }

  private onStartRecording() {
    this.createLayer();
  }

  private onStopRecording() {
    this.map.removeLayer(this.layer!);
    delete this.layer;
    delete this.line;
  }

  private onNewPoint(point: Point) {
    if (!this.line) {
      return;
    }

    this.line.appendCoordinate([point.longitude, point.latitude]);
  }

  private createLayer() {
    this.line = new LineString([]);

    this.layer = new VectorLayer({
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

    this.map.addLayer(this.layer);
  }
}
