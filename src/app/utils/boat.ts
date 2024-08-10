import { Position } from '@capacitor/geolocation';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import { ZIndex } from './z-indices';
import { MapService } from '../services/map.service';

const ICON_URL = '/assets/boat-marker.png';

export class BoatMarker {
  private boat?: Feature<Point>;
  private boatLayer?: VectorLayer<VectorSource<Feature<Point>>, Feature<Point>>;
  private icon?: Icon;

  constructor(private mapSrv: MapService) {
    this.init();
  }

  public updatePosition(position: Position) {
    const { longitude, latitude } = position.coords;
    const heading = position.coords.heading ?? 0;

    this.boat?.setGeometry(new Point([longitude, latitude]));

    const rotation =
      (this.mapSrv.getMap().getView().getRotation() + heading / 57.29578) %
      (2 * Math.PI);

    this.icon?.setRotation(rotation);
  }

  private init() {
    this.icon = new Icon({
      anchor: [0.5, 0.5],
      src: ICON_URL,
      scale: 0.04,
      rotateWithView: true,
    });

    this.boat = new Feature();
    this.boat.setStyle(
      new Style({
        image: this.icon,
      }),
    );

    this.boatLayer = new VectorLayer({
      source: new VectorSource({
        features: [this.boat],
      }),
      zIndex: ZIndex.BOAT,
    });

    this.mapSrv.getMap().addLayer(this.boatLayer);
  }
}
