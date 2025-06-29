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
  mapSrv: MapService,
  geolocationSrv: GeolocationService,
) {
  return new BoatLayerManager(mapSrv, geolocationSrv);
}

const ICON_URL = '/assets/boat-marker.png';

class BoatLayerManager {
  private readonly boatFeature: Feature<Point>;
  private readonly icon: Icon;

  constructor(
    private readonly mapSrv: MapService,
    private readonly geolocation: GeolocationService,
  ) {
    this.icon = this.createIcon();
    this.boatFeature = this.createBoatFeature(this.icon);
    this.createBoatLayer(this.boatFeature);

    this.setInitialPosition();
    this.registerListeners();
  }

  private setInitialPosition() {
    const pos = this.geolocation.getPosition();
    if (pos.timestamp !== -1) {
      this.updatePosition(pos);
    }
  }

  private registerListeners() {
    this.geolocation.watchPosition((position) => {
      this.updatePosition(position);
    });
  }

  private updatePosition(position: Position) {
    const { longitude, latitude } = position.coords;
    const heading = position.coords.heading ?? 0;

    this.boatFeature.setGeometry(new Point([longitude, latitude]));

    const rotation =
      (this.mapSrv.getMap().getView().getRotation() + heading / 57.29578) %
      (2 * Math.PI);

    this.icon.setRotation(rotation);
  }

  private createIcon() {
    return new Icon({
      anchor: [0.5, 0.5],
      src: ICON_URL,
      scale: 0.04,
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

    this.mapSrv.getMap().addLayer(layer);
  }
}
