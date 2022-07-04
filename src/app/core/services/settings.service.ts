import { Injectable } from '@angular/core';
import { Settings, DistanceUnit, SpeedUnit } from '../models/settings.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings: Settings;

  constructor(
    private storage: StorageService
  ) { }

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
    await this.save();
  }

  async getDistanceUnit() {
    if(!this.settings) await this.init();

    return this.settings.distanceUnit;
  }

  async setDistanceUnit(unit: DistanceUnit) {
    if(!this.settings) await this.init();

    this.settings.distanceUnit = unit;
    await this.save();
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
      speedUnit: SpeedUnit.KILOMETERS_PER_HOUR
    }
  }

  private async save() {
    await this.storage.set(STORAGE_KEY, this.settings);
  }
}