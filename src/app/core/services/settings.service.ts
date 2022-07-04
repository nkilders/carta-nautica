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
  ) {
    // delay is needed because the storage isn't fully initialized when this constructor is called
    setTimeout(() => this.init(), 1000);
  }

  getAllSettings(): Settings {
    return this.settings;
  }

  getSpeedUnit(): SpeedUnit {
    return this.settings.speedUnit;
  }

  setSpeedUnit(unit: SpeedUnit) {
    this.settings.speedUnit = unit;
    this.save();
  }

  getDistanceUnit(): DistanceUnit {
    return this.settings.distanceUnit;
  }

  setDistanceUnit(unit: DistanceUnit) {
    this.settings.distanceUnit = unit;
    this.save();
  }
  
  private async init() {
    if(!await this.storage.has(STORAGE_KEY)) {
      this.storage.set(STORAGE_KEY, this.defaultSettings());
    }
  }

  private defaultSettings(): Settings {
    return {
      distanceUnit: DistanceUnit.KILOMETERS,
      speedUnit: SpeedUnit.KILOMETERS_PER_HOUR
    }
  }

  private save() {
    this.storage.set(STORAGE_KEY, this.settings);
  }
}