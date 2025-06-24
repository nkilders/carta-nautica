import { Feature } from 'ol';
import { Circle, Fill, Stroke, Style, Text } from 'ol/style';
import { Point } from 'ol/geom';

export interface Stop {
  longitude: number;
  latitude: number;
}

export type Route = Stop[];

export class StopFeature extends Feature {
  constructor(
    private readonly stop: Stop,
    private readonly sequence: number,
  ) {
    super();

    this.updateCenter();
    this.updateStyle();
  }

  public getStop() {
    return this.stop;
  }

  public getSequence() {
    return this.sequence;
  }

  private updateCenter() {
    const { longitude, latitude } = this.stop;
    this.setGeometry(new Point([longitude, latitude]));
  }

  private updateStyle(): void {
    this.setStyle(
      new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color: 'rgb(231, 76, 60)' }),
          stroke: new Stroke({ color: 'black', width: 2 }),
        }),
        text: new Text({
          text: String(this.sequence + 1),
          fill: new Fill({ color: 'black' }),
          font: '10pt Arial',
        }),
      }),
    );
  }
}
