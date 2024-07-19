import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { DistanceUnit, Settings, SpeedUnit } from '../models/settings';

const STORAGE_KEY = 'settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings?: Settings;

  constructor(
    private storage: StorageService,
  ) { }

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
    // TODO: emit event

    await this.save();
  }

  public async getDistanceUnit() {
    await this.init();

    return this.settings!.distanceUnit;
  }

  public async setDistanceUnit(unit: DistanceUnit) {
    await this.init();

    this.settings!.distanceUnit = unit;
    // TODO: emit event

    await this.save();
  }

  public async getMapPreloading() {
    await this.init();

    return this.settings!.mapPreloading;
  }

  public async setMapPreloading(preloading: boolean) {
    await this.init();

    this.settings!.mapPreloading = preloading;
    // TODO: emit event

    await this.save();
  }

  public async getKeepAwake() {
    await this.init();

    return this.settings!.keepAwake;
  }

  public async setKeepAwake(keepAwake: boolean) {
    await this.init();

    this.settings!.keepAwake = keepAwake;
    // TODO: emit event

    await this.save();
  }

  private async init() {
    if(this.settings) {
      return;
    }

    this.settings = await this.storage.get(STORAGE_KEY);

    if(!this.settings) {
      this.settings = this.defaultSettings();
      await this.save();
    }
  }

  private defaultSettings() : Settings {
    return {
      speedUnit: SpeedUnit.KILOMETERS_PER_HOUR,
      distanceUnit: DistanceUnit.KILOMETERS,
      mapPreloading: true,
      keepAwake: true,
    };
  }

  private async save() {
    await this.storage.set(STORAGE_KEY, this.settings);
  }
}
