import { Feature } from 'ol';
import { TrackRecorderService } from '../services/track-recorder.service';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Point } from '../models/tracks';
import { Stroke, Style } from 'ol/style';
import { ZIndex } from './z-indices';
import { LineString } from 'ol/geom';
import { MapService } from '../services/map.service';

export function createTrackLayerManager(
  mapSrv: MapService,
  trackRecorder: TrackRecorderService,
) {
  return new TrackLayerManager(mapSrv, trackRecorder);
}

class TrackLayerManager {
  private layer?: VectorLayer;
  private line?: LineString;

  constructor(
    private mapSrv: MapService,
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
    this.mapSrv.getMap().removeLayer(this.layer!);
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

    this.mapSrv.getMap().addLayer(this.layer);
  }
}
