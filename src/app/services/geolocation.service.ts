import { Injectable } from '@angular/core';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder';
import {
  Geolocation,
  PositionOptions,
  WatchPositionCallback,
} from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private readonly options: PositionOptions = {
    enableHighAccuracy: true,
  };

  private positionWatchCallbacks: WatchPositionCallback[] = [];

  constructor() {}

  public getPosition() {
    return Geolocation.getCurrentPosition(this.options);
  }

  public async watchPosition(callback: WatchPositionCallback) {
    this.positionWatchCallbacks.push(callback);

    if (this.positionWatchCallbacks.length === 1) {
      Geolocation.watchPosition(this.options, (position, err) => {
        this.positionWatchCallbacks.forEach((cb) => cb(position, err));
      });
    }
  }

  public async reverseGeocode(longitude: number, latitude: number) {
    const result = await NativeGeocoder.reverseGeocode(latitude, longitude, {
      maxResults: 1,
      useLocale: true,
    }).catch(() => null);

    return result && result[0];
  }
}
