import { Injectable } from '@angular/core';
import { Map as OLMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import { useGeographic } from 'ol/proj';
import { OSM, XYZ } from 'ol/source';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map: OLMap;

  constructor() {
    useGeographic();

    this.map = new OLMap({
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
  }

  public getMap() {
    return this.map;
  }

  public setTarget(target: string | HTMLElement) {
    this.map.setTarget(target);
  }

  public flyTo(
    longitude: number,
    latitude: number,
    zoom: number,
    durationMs: number,
  ) {
    this.map.getView().animate({
      center: [longitude, latitude],
      zoom,
      duration: durationMs,
    });
  }
}
