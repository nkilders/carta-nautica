import { Injectable } from '@angular/core';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder';
import {
  Geolocation,
  PositionOptions,
  WatchPositionCallback,
} from '@capacitor/geolocation';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private readonly options: PositionOptions = {
    enableHighAccuracy: true,
  };

  private positionWatchCallbacks: Map<string, WatchPositionCallback> =
    new Map();

  constructor() {}

  public getPosition() {
    return Geolocation.getCurrentPosition(this.options);
  }

  public async watchPosition(callback: WatchPositionCallback) {
    const watchId = uuidv4();

    this.positionWatchCallbacks.set(watchId, callback);

    if (this.positionWatchCallbacks.size === 1) {
      Geolocation.watchPosition(this.options, (position, err) => {
        this.positionWatchCallbacks.forEach((cb) => cb(position, err));
      });
    }

    return watchId;
  }

  public async cleanPositionWatch(watchId: string) {
    this.positionWatchCallbacks.delete(watchId);
  }

  public async reverseGeocode(longitude: number, latitude: number) {
    const result = await NativeGeocoder.reverseGeocode(latitude, longitude, {
      maxResults: 1,
      useLocale: true,
    }).catch(() => null);

    return result && result[0];
  }
}
