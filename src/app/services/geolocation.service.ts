import { Injectable } from '@angular/core';
import { Geolocation, PositionOptions, WatchPositionCallback } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private readonly options: PositionOptions = {
    enableHighAccuracy: true,
  };

  constructor() { }

  public getPosition() {
    return Geolocation.getCurrentPosition(this.options);
  }

  public watchPosition(callback: WatchPositionCallback) {
    return Geolocation.watchPosition(this.options, callback);
  }

  public clearWatch(id: string) {
    Geolocation.clearWatch({ id });
  }

  public reverseGeocode(longitude: number, latitude: number) {}
}
