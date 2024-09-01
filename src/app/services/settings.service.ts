import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import {
  DistanceUnit,
  Language,
  Settings,
  SpeedUnit,
  TemperatureUnit,
} from '../models/settings';
import { EventEmitter } from 'events';

const STORAGE_KEY = 'settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private settings?: Settings;
  private eventEmitter: EventEmitter;

  constructor(private storage: StorageService) {
    this.eventEmitter = new EventEmitter();
  }

  public async getAllSettings() {
    await this.init();

    return this.settings!;
  }

  public async getSpeedUnit() {
    await this.init();

    return this.settings!.speedUnit;
  }

  public async setSpeedUnit(unit: SpeedUnit) {
    await this.init();

    this.settings!.speedUnit = unit;
    this.eventEmitter.emit('speedUnit', unit);

    await this.save();
  }

  public async getDistanceUnit() {
    await this.init();

    return this.settings!.distanceUnit;
  }

  public async setDistanceUnit(unit: DistanceUnit) {
    await this.init();

    this.settings!.distanceUnit = unit;
    this.eventEmitter.emit('distanceUnit', unit);

    await this.save();
  }

  public async getTemperatureUnit() {
    await this.init();

    return this.settings!.temperatureUnit;
  }

  public async setTemperatureUnit(unit: TemperatureUnit) {
    await this.init();

    this.settings!.temperatureUnit = unit;
    this.eventEmitter.emit('temperatureUnit', unit);

    await this.save();
  }

  public async getLanguage() {
    await this.init();

    return this.settings!.language;
  }

  public async setLanguage(language: Language) {
    await this.init();

    this.settings!.language = language;
    this.eventEmitter.emit('language', language);

    await this.save();
  }

  public async getMapPreloading() {
    await this.init();

    return this.settings!.mapPreloading;
  }

  public async setMapPreloading(preloading: number) {
    await this.init();

    this.settings!.mapPreloading = preloading;
    this.eventEmitter.emit('mapPreloading', preloading);

    await this.save();
  }

  public async getKeepAwake() {
    await this.init();

    return this.settings!.keepAwake;
  }

  public async setKeepAwake(keepAwake: boolean) {
    await this.init();

    this.settings!.keepAwake = keepAwake;
    this.eventEmitter.emit('keepAwake', keepAwake);

    await this.save();
  }

  public async getAnimations() {
    await this.init();

    return this.settings!.animations;
  }

  public async setAnimations(animations: boolean) {
    await this.init();

    this.settings!.animations = animations;
    this.eventEmitter.emit('animations', animations);

    await this.save();
  }

  public async getOpenWeatherMapApiKey() {
    await this.init();

    return this.settings!.openWeatherMapApiKey;
  }

  public async setOpenWeatherMapApiKey(openWeatherMapApiKey: string) {
    await this.init();

    this.settings!.openWeatherMapApiKey = openWeatherMapApiKey;
    this.eventEmitter.emit('openWeatherMapApiKey', openWeatherMapApiKey);

    await this.save();
  }

  on(event: 'speedUnit', listener: (newValue: SpeedUnit) => void): void;
  on(event: 'distanceUnit', listener: (newValue: DistanceUnit) => void): void;
  on(
    event: 'temperatureUnit',
    listener: (newValue: TemperatureUnit) => void,
  ): void;
  on(event: 'language', listener: (newValue: Language) => void): void;
  on(event: 'mapPreloading', listener: (newValue: number) => void): void;
  on(event: 'keepAwake', listener: (newValue: boolean) => void): void;
  on(event: 'animations', listener: (newValue: boolean) => void): void;
  on(event: 'openWeatherMapApiKey', listener: (newValue: string) => void): void;

  public on(event: string, listener: (...args: any) => void) {
    this.eventEmitter.on(event, listener);
  }

  private async init() {
    if (this.settings) {
      return;
    }

    const storedSettings = await this.storage.get(STORAGE_KEY);
    this.settings = {
      ...this.defaultSettings(),
      ...storedSettings,
    };

    if (!this.settings) {
      this.settings = this.defaultSettings();
      await this.save();
    }
  }

  private defaultSettings(): Settings {
    return {
      speedUnit: SpeedUnit.KILOMETERS_PER_HOUR,
      distanceUnit: DistanceUnit.KILOMETERS,
      temperatureUnit: TemperatureUnit.CELSIUS,
      language: Language.GERMAN,
      mapPreloading: 1,
      keepAwake: true,
      animations: true,
      openWeatherMapApiKey: '',
    };
  }

  private async save() {
    await this.storage.set(STORAGE_KEY, this.settings);
  }
}
