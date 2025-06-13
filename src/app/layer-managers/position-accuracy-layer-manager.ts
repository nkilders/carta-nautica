import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { ZIndex } from '../utils/z-indices';
import { MapService } from '../services/map.service';
import { SettingsService } from '../services/settings.service';
import { GeolocationService } from '../services/geolocation.service';
import { Feature } from 'ol';
import { Circle } from 'ol/geom';
import { Fill, Stroke, Style } from 'ol/style';
import { toProjectedDistance } from '../utils/coordinates';

export function createPositionAccuracyLayerManager(
  mapSrv: MapService,
  settingsSrv: SettingsService,
  geolocationSrv: GeolocationService,
) {
  return new PositionAccuracyLayerManager(mapSrv, settingsSrv, geolocationSrv);
}

class PositionAccuracyLayerManager {
  private readonly layer: VectorLayer;
  private readonly layerSource: VectorSource;
  private feature?: Feature;

  constructor(
    private readonly mapSrv: MapService,
    private readonly settingsSrv: SettingsService,
    private readonly geolocationSrv: GeolocationService,
  ) {
    this.layerSource = new VectorSource();
    this.layer = this.createLayer(this.layerSource);
    this.registerListeners();
  }

  private createLayer(source: VectorSource) {
    const layer = new VectorLayer({
      source,
      zIndex: ZIndex.POSITION_ACCURACY,
      visible: false,
    });

    this.settingsSrv.getPositionAccuracy().then((positionAccuracy) => {
      layer.setVisible(positionAccuracy);
    });

    this.mapSrv.getMap().addLayer(layer);

    return layer;
  }

  private registerListeners() {
    this.settingsSrv.on('positionAccuracy', (positionAccuracy) => {
      this.layer.setVisible(positionAccuracy);
    });

    this.geolocationSrv.watchPosition((position) => {
      if (!this.feature) {
        this.initFeature();
      }

      const { longitude, latitude, accuracy } = position.coords;

      const projectedRadius = toProjectedDistance(accuracy, latitude);

      this.feature?.setGeometry(
        new Circle([longitude, latitude], projectedRadius),
      );
    });
  }

  private initFeature() {
    this.feature = new Feature();

    this.feature.setStyle(
      new Style({
        fill: new Fill({ color: 'rgba(1, 1, 1, 0.15)' }),
        stroke: new Stroke({ color: 'red', width: 2, lineDash: [5, 5] }),
      }),
    );

    this.layerSource.addFeature(this.feature);
  }
}
