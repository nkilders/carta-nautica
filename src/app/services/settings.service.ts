import { Injectable } from '@angular/core';
import * as EventEmitter from 'events';
import { Settings, DistanceUnit, SpeedUnit } from '../models/settings.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings: Settings;
  private eventEmitter: EventEmitter;

  constructor(
    private storageSrv: StorageService
  ) {
    this.eventEmitter = new EventEmitter();
  }

  async getAllSettings() {
    await this.init();

    return this.settings;
  }

  async getSpeedUnit() {
    await this.init();

    return this.settings.speedUnit;
  }

  async setSpeedUnit(unit: SpeedUnit) {
    await this.init();
    
    this.settings.speedUnit = unit;
    this.eventEmitter.emit('speedUnit', unit);

    await this.save();
  }

  async getDistanceUnit() {
    await this.init();

    return this.settings.distanceUnit;
  }

  async setDistanceUnit(unit: DistanceUnit) {
    await this.init();

    this.settings.distanceUnit = unit;
    this.eventEmitter.emit('distanceUnit', unit);

    await this.save();
  }

  async getMapPreloading() {
    await this.init();
    
    return this.settings.mapPreloading;
  }

  async setMapPreloading(preloading: boolean) {
    await this.init();

    this.settings.mapPreloading = preloading;
    this.eventEmitter.emit('mapPreloading', preloading);

    await this.save();
  }

  async getKeepAwake() {
    await this.init();

    return this.settings.keepAwake;
  }

  async setKeepAwake(keepAwake: boolean) {
    await this.init();

    this.settings.keepAwake = keepAwake;
    this.eventEmitter.emit('keepAwake', keepAwake);

    await this.save();
  }
  
  on(event: 'speedUnit', listener: (newValue: SpeedUnit) => void): void;
  on(event: 'distanceUnit', listener: (newValue: DistanceUnit) => void): void;
  on(event: 'mapPreloading', listener: (newValue: boolean) => void): void;
  on(event: 'keepAwake', listener: (newValue: boolean) => void): void;

  on(event: string, listener: (...args: any) => void) {
    this.eventEmitter.on(event, listener);
  }
  
  private async init() {
    if(this.settings) return;

    this.settings = await this.storageSrv.get(STORAGE_KEY);

    if(!this.settings) {
      this.settings = this.defaultSettings();
      await this.save();
    }
  }

  private defaultSettings(): Settings {
    return {
      distanceUnit: DistanceUnit.KILOMETERS,
      speedUnit: SpeedUnit.KILOMETERS_PER_HOUR,
      mapPreloading: true,
      keepAwake: true,
    }
  }

  private async save() {
    await this.storageSrv.set(STORAGE_KEY, this.settings);
  }
}