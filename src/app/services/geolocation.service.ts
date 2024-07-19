import { Injectable } from '@angular/core';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder';
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

  public async reverseGeocode(longitude: number, latitude: number) {
    const result = await NativeGeocoder.reverseGeocode(latitude, longitude, {
      maxResults: 1,
      useLocale: true,
    }).catch(() => null);

    return result && result[0];
  }
}
