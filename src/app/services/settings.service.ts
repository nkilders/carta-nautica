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
    private storage: StorageService
  ) {
    this.eventEmitter = new EventEmitter();
  }

  async getAllSettings() {
    if(!this.settings) await this.init();

    return this.settings;
  }

  async getSpeedUnit() {
    if(!this.settings) await this.init();

    return this.settings.speedUnit;
  }

  async setSpeedUnit(unit: SpeedUnit) {
    if(!this.settings) await this.init();
    
    this.settings.speedUnit = unit;
    this.eventEmitter.emit('speedUnit', unit);

    await this.save();
  }

  async getDistanceUnit() {
    if(!this.settings) await this.init();

    return this.settings.distanceUnit;
  }

  async setDistanceUnit(unit: DistanceUnit) {
    if(!this.settings) await this.init();

    this.settings.distanceUnit = unit;
    this.eventEmitter.emit('distanceUnit', unit);

    await this.save();
  }

  async getMapPreloading() {
    if(!this.settings) await this.init();
    
    return this.settings.mapPreloading;
  }

  async setMapPreloading(preloading: boolean) {
    if(!this.settings) await this.init();

    this.settings.mapPreloading = preloading;
    this.eventEmitter.emit('mapPreloading', preloading);

    await this.save();
  }
  
  on(event: 'speedUnit', listener: (newValue: SpeedUnit) => void): void;
  on(event: 'distanceUnit', listener: (newValue: DistanceUnit) => void): void;
  on(event: 'mapPreloading', listener: (newValue: boolean) => void): void;

  on(event: string, listener: (...args: any) => void) {
    this.eventEmitter.on(event, listener);
  }
  
  private async init() {
    this.settings = await this.storage.get(STORAGE_KEY);

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
    }
  }

  private async save() {
    await this.storage.set(STORAGE_KEY, this.settings);
  }
}