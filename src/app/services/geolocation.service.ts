import { Injectable } from '@angular/core';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder';
import { Geolocation, Position, PositionOptions } from '@capacitor/geolocation';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'position';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private readonly options: PositionOptions = {
    enableHighAccuracy: true,
  };

  private position: Position;

  private readonly positionWatchCallbacks: Map<string, WatchPositionCallback> =
    new Map();

  constructor(private storage: StorageService) {
    this.position = this.defaultPosition();
  }

  public async fetchPosition() {
    const position = await Geolocation.getCurrentPosition(this.options);
    await this.updatePosition(position);
    return position;
  }

  public getPosition() {
    return this.position;
  }

  public async watchPosition(callback: WatchPositionCallback) {
    const watchId = uuidv4();

    this.positionWatchCallbacks.set(watchId, callback);

    Geolocation.watchPosition(this.options, (position) => {
      if (position == null) return;
      this.updatePosition(position);
      this.positionWatchCallbacks.forEach((cb) => cb(position));
    });

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

  public async loadLastKnownPosition() {
    const position = await this.storage.get(STORAGE_KEY);

    if (position) {
      this.position = position;
    }

    return this.position;
  }

  private async updatePosition(position: Position) {
    this.position = position;

    await this.storage.set(
      STORAGE_KEY,
      JSON.parse(JSON.stringify(this.position)),
    );
  }

  private defaultPosition(): Position {
    return {
      timestamp: -1,
      coords: {
        latitude: 0,
        longitude: 0,
        altitude: null,
        accuracy: -1,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
    };
  }
}

export type WatchPositionCallback = (position: Position) => void;
