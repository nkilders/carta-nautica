import { Position } from '@capacitor/geolocation';
import { Feature, Map } from 'ol';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';

const ICON_URL = '/assets/boat-marker.png';

export class BoatMarker {
  private boat?: Feature<Point>;
  private boatLayer?: VectorLayer<Feature<Point>>;
  private icon?: Icon;

  constructor(map: Map) {
    this.init(map);
  }

  public updatePosition(position: Position) {
    const { longitude, latitude } = position.coords;
    const heading = position.coords.heading ?? 0;

    this.boat?.setGeometry(new Point([longitude, latitude]));

    this.icon?.setRotation(heading);
  }

  private init(map: Map) {
    this.icon = new Icon({
      anchor: [0.5, 0.5],
      src: ICON_URL,
      scale: 0.04,
      rotation: 2,
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
      zIndex: 1,
    });

    map.addLayer(this.boatLayer);
  }
}
