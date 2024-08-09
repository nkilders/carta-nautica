import { Feature } from 'ol';
import { Circle, Fill, Stroke, Style, Text } from 'ol/style';
import { Point } from 'ol/geom';

export interface Marker extends MarkerWithoutId {
  id: string;
}

export interface MarkerWithoutId {
  name: string;
  longitude: number;
  latitude: number;
}

export class MarkerFeature extends Feature {
  constructor(private readonly marker: Marker) {
    super({
      geometry: new Point([marker.longitude, marker.latitude]),
    });

    this.initStyle();
  }

  private initStyle() {
    this.setStyle(
      new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color: 'rgba(255, 0, 0, 0.2)' }),
          stroke: new Stroke({ color: 'red', width: 2 }),
        }),
        text: new Text({
          text: this.marker.name,
          fill: new Fill({ color: 'black' }),
          stroke: new Stroke({ color: 'white', width: 2 }),
          font: 'bold 12px / 1 Arial',
        }),
      }),
    );
  }
}
