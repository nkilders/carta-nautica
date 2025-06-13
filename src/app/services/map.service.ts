import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { Map as OLMap, View } from 'ol';
import { useGeographic } from 'ol/proj';
import { LongClick } from '../utils/longclick';
import { FeatureLike } from 'ol/Feature';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private readonly map: OLMap;
  private readonly eventEmitter: EventEmitter;

  /**
   * When the mouse is released after a long click, the
   * map's click event gets fired as well. This boolean
   * is used to track if a long click is in progress.
   * As long as it is true, all click events will be
   * ignored.
   */
  private longClickActive = false;

  constructor() {
    this.map = new OLMap();
    this.eventEmitter = new EventEmitter();

    this.initMap();
    this.initFeatureClick();
  }

  public getMap() {
    return this.map;
  }

  public setTarget(target: string | HTMLElement) {
    this.map.setTarget(target);
    this.initLongClick();
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

  public focus(longitude: number, latitude: number, zoom: number) {
    this.map.getView().setCenter([longitude, latitude]);
    this.map.getView().setZoom(zoom);
  }

  on(
    event: 'longClick',
    listener: (
      longitude: number,
      latitude: number,
      complete: () => void,
    ) => void,
  ): void;
  on(event: 'featureClicked', listener: (feature: FeatureLike) => void): void;

  public on(event: string, listener: (...args: any) => void) {
    this.eventEmitter.on(event, listener);
  }

  private initMap() {
    useGeographic();

    this.map.setView(
      new View({
        center: [0, 0],
        zoom: 2,
      }),
    );
  }

  private initLongClick() {
    new LongClick(this.map, (coordinate) => {
      const [longitude, latitude] = coordinate;

      this.longClickActive = true;

      this.eventEmitter.emit('longClick', longitude, latitude, () => {
        this.longClickActive = false;
      });
    });
  }

  private initFeatureClick() {
    this.map.on('click', (event) => {
      if (this.longClickActive) {
        return;
      }

      const [feature] = this.map.getFeaturesAtPixel(event.pixel);

      if (!feature) {
        return;
      }

      this.eventEmitter.emit('featureClicked', feature);
    });
  }
}
