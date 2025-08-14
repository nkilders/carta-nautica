import { Position } from '@capacitor/geolocation';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import { ZIndex } from '../utils/z-indices';
import { MapService } from '../services/map.service';
import { GeolocationService } from '../services/geolocation.service';

export function createBoatLayerManager(
  geolocationService: GeolocationService,
  mapService: MapService,
) {
  return new BoatLayerManager(geolocationService, mapService);
}

const ICON_URL = '/assets/boat.svg';

class BoatLayerManager {
  private readonly boatFeature: Feature<Point>;
  private readonly icon: Icon;

  constructor(
    private readonly geolocationService: GeolocationService,
    private readonly mapService: MapService,
  ) {
    this.icon = this.createIcon();
    this.boatFeature = this.createBoatFeature(this.icon);
    this.createBoatLayer(this.boatFeature);

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
  }

  private updatePosition(position: Position) {
    const { longitude, latitude } = position.coords;
    const heading = position.coords.heading ?? 0;

    this.boatFeature.setGeometry(new Point([longitude, latitude]));

    const rotation =
      (this.mapService.getMap().getView().getRotation() + heading / 57.29578) %
      (2 * Math.PI);

    this.icon.setRotation(rotation);
  }

  private createIcon() {
    return new Icon({
      anchor: [0.5, 0.5],
      src: ICON_URL,
      scale: 0.06,
      rotateWithView: true,
    });
  }

  private createBoatFeature(icon: Icon) {
    const boat = new Feature<Point>();
    boat.setStyle(
      new Style({
        image: icon,
      }),
    );
    return boat;
  }

  private createBoatLayer(boatFeature: Feature<Point>) {
    const layer = new VectorLayer({
      source: new VectorSource({
        features: [boatFeature],
      }),
      zIndex: ZIndex.BOAT,
    });

    this.mapService.getMap().addLayer(layer);
  }
}
