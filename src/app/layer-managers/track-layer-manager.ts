import { Feature } from 'ol';
import { TrackRecorderService } from '../services/track-recorder.service';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Point } from '../models/tracks';
import { Stroke, Style } from 'ol/style';
import { ZIndex } from '../utils/z-indices';
import { LineString } from 'ol/geom';
import { MapService } from '../services/map.service';

export function createTrackLayerManager(
  // Services
  mapService: MapService,
  trackRecorderService: TrackRecorderService,
) {
  return new TrackLayerManager(mapService, trackRecorderService);
}

class TrackLayerManager {
  private layer?: VectorLayer;
  private line?: LineString;

  constructor(
    // Services
    private readonly mapService: MapService,
    private readonly trackRecorderService: TrackRecorderService,
  ) {
    this.registerListeners();
  }

  private registerListeners() {
    this.trackRecorderService.on('startRecording', () =>
      this.onStartRecording(),
    );
    this.trackRecorderService.on('stopRecording', (track) =>
      this.onStopRecording(),
    );
    this.trackRecorderService.on('newPoint', (track, point) =>
      this.onNewPoint(point),
    );
  }

  private onStartRecording() {
    this.createLayer();
  }

  private onStopRecording() {
    this.mapService.getMap().removeLayer(this.layer!);
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

    this.mapService.getMap().addLayer(this.layer);
  }
}
