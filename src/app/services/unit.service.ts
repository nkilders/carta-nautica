import { Injectable } from '@angular/core';
import { DistanceUnit, SpeedUnit } from '../models/settings.model';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor(
    private settingsSrv: SettingsService,
  ) { }

  async convertSpeed(speed: number, sourceUnit: SpeedUnit): Promise<[number, SpeedUnit]> {
    const targetUnit = await this.settingsSrv.getSpeedUnit();

    if(sourceUnit === targetUnit) return [speed, targetUnit];

    const metersPerSecond = (() => {
      switch(sourceUnit) {
        case SpeedUnit.KILOMETERS_PER_HOUR:
          return speed / 3.6;
        case SpeedUnit.METERS_PER_SECOND:
          return speed;
        case SpeedUnit.KNOTS:
          return speed / 1.9438444924;
      }
    })();

    const targetSpeed = (() => {
      switch(targetUnit) {
        case SpeedUnit.KILOMETERS_PER_HOUR:
          return metersPerSecond * 3.6;
        case SpeedUnit.METERS_PER_SECOND:
          return metersPerSecond;
        case SpeedUnit.KNOTS:
          return metersPerSecond * 1.9438444924;
      }
    })();

    return [targetSpeed, targetUnit];
  }

  async convertDistance(distance: number, sourceUnit: DistanceUnit): Promise<[number, DistanceUnit]> {
    const targetUnit = await this.settingsSrv.getDistanceUnit();

    if(sourceUnit === targetUnit) return [distance, targetUnit];

    const meters = (() => {
      switch(sourceUnit) {
        case DistanceUnit.KILOMETERS:
          return distance * 1000;
        case DistanceUnit.METERS:
          return distance;
        case DistanceUnit.SEA_MILES:
          return distance * 1852;
      }
    })();

    const targetDistance = (() => {
      switch(targetUnit) {
        case DistanceUnit.KILOMETERS:
          return meters / 1000;
        case DistanceUnit.METERS:
          return meters;
        case DistanceUnit.SEA_MILES:
          return meters / 1852;
      }
    })();

    return [targetDistance, targetUnit];
  }

  speedUnitToShortText(unit: SpeedUnit) {
    switch(unit) {
      case SpeedUnit.KILOMETERS_PER_HOUR:
        return 'km/h';
      case SpeedUnit.METERS_PER_SECOND:
        return 'm/s';
      case SpeedUnit.KNOTS:
        return 'knt';
    }
  }

  distanceUnitToShortText(unit: DistanceUnit) {
    switch (unit) {
      case DistanceUnit.KILOMETERS:
        return 'km';
      case DistanceUnit.METERS:
        return 'm';
      case DistanceUnit.SEA_MILES:
        return 'sm';
    }
  }
}