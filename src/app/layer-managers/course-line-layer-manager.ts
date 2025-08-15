import { Position } from '@capacitor/geolocation';
import { Feature } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import { ZIndex } from '../utils/z-indices';
import { MapService } from '../services/map.service';
import { GeolocationService } from '../services/geolocation.service';
import { LineString } from 'ol/geom';
import Stroke from 'ol/style/Stroke';
import { radians } from '../utils/coordinates';
import { SettingsService } from '../services/settings.service';

export function createCourseLineLayerManager(
  geolocationService: GeolocationService,
  mapService: MapService,
  settingsService: SettingsService,
) {
  return new CourseLineLayerManager(
    geolocationService,
    mapService,
    settingsService,
  );
}

const ICON_URL = '/assets/boat-marker.png';

class CourseLineLayerManager {
  private readonly headingFeature: Feature<LineString>;
  private readonly layer: VectorLayer;

  constructor(
    private readonly geolocationService: GeolocationService,
    private readonly mapService: MapService,
    private readonly settingsService: SettingsService,
  ) {
    this.headingFeature = this.createHeadingFeature();
    this.layer = this.createLayer([this.headingFeature]);

    this.setInitialPosition();
    this.registerListeners();
  }

  private setInitialPosition() {
    const pos = this.geolocationService.getPosition();
    if (pos.timestamp !== -1) {
      this.updatePosition(pos);
    }
  }

  private registerListeners() {
    this.geolocationService.watchPosition((position) => {
      this.updatePosition(position);
    });

    this.settingsService.on('courseLine', (visible) => {
      this.layer.setVisible(visible);
    });
  }

  private updatePosition(position: Position) {
    const { longitude, latitude } = position.coords;
    const heading = position.coords.heading ?? 0;
    const rad = radians(heading);
    const length = 0.09045;
    const targetLon = longitude + Math.sin(rad) * length;
    const targetLat = latitude + Math.cos(rad) * length;

    this.headingFeature.setGeometry(
      new LineString([
        [longitude, latitude],
        [targetLon, targetLat],
      ]),
    );
  }

  private createHeadingFeature() {
    const feature = new Feature<LineString>(
      new LineString([
        [0, 0],
        [0, 0],
      ]),
    );
    feature.setStyle(
      new Style({
        stroke: new Stroke({
          color: '#000',
          width: 3,
          lineDash: [10, 10],
        }),
      }),
    );
    return feature;
  }

  private createLayer(features: Feature[]) {
    const layer = new VectorLayer({
      source: new VectorSource({
        features,
      }),
      zIndex: ZIndex.COURSE_LINE,
    });

    this.settingsService.getCourseLine().then((visible) => {
      layer.setVisible(visible);
    });

    this.mapService.getMap().addLayer(layer);

    return layer;
  }
}
