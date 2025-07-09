import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Circle, Fill, Stroke, Style } from 'ol/style';

export interface Seamark {
  longitude: number;
  latitude: number;
  id: number;
  tags: {
    [key: string]: string;
  };
}

export class SeamarkFeature extends Feature {
  constructor(private readonly seamark: Seamark) {
    super();

    this.setStyle(
      new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color: 'red' }),
          stroke: new Stroke({ color: 'red', width: 2 }),
        }),
      }),
    );

    this.updatePosition();
  }

  public getSeamark() {
    return this.seamark;
  }

  private updatePosition() {
    const { longitude, latitude } = this.seamark;
    this.setGeometry(new Point([longitude, latitude]));
  }
}
