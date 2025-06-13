import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { DistanceUnit, SpeedUnit, TemperatureUnit } from '../models/settings';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  constructor(private readonly settings: SettingsService) {}

  public async convertSpeed(
    speed: number,
    sourceUnit: SpeedUnit,
  ): Promise<ConversionResult<SpeedUnit>> {
    const targetUnit = await this.settings.getSpeedUnit();

    if (sourceUnit == targetUnit) {
      return {
        value: speed,
        unit: targetUnit,
        unitText: this.speedUnitToText(targetUnit),
      };
    }

    const metersPerSecond = (() => {
      switch (sourceUnit) {
        case SpeedUnit.KILOMETERS_PER_HOUR:
          return speed / 3.6;
        case SpeedUnit.METERS_PER_SECOND:
          return speed;
        case SpeedUnit.KNOTS:
          return speed / 1.9438444924;
      }
    })();

    const targetSpeed = (() => {
      switch (targetUnit) {
        case SpeedUnit.KILOMETERS_PER_HOUR:
          return metersPerSecond * 3.6;
        case SpeedUnit.METERS_PER_SECOND:
          return metersPerSecond;
        case SpeedUnit.KNOTS:
          return metersPerSecond * 1.9438444924;
      }
    })();

    return {
      value: targetSpeed,
      unit: targetUnit,
      unitText: this.speedUnitToText(targetUnit),
    };
  }

  public async convertDistance(
    distance: number,
    sourceUnit: DistanceUnit,
  ): Promise<ConversionResult<DistanceUnit>> {
    const targetUnit = await this.settings.getDistanceUnit();

    if (sourceUnit == targetUnit) {
      return {
        value: distance,
        unit: targetUnit,
        unitText: this.distanceUnitToText(targetUnit),
      };
    }

    const meters = (() => {
      switch (sourceUnit) {
        case DistanceUnit.KILOMETERS:
          return distance * 1000;
        case DistanceUnit.METER:
          return distance;
        case DistanceUnit.SEA_MILES:
          return distance * 1852;
      }
    })();

    const targetDistance = (() => {
      switch (targetUnit) {
        case DistanceUnit.KILOMETERS:
          return meters / 1000;
        case DistanceUnit.METER:
          return meters;
        case DistanceUnit.SEA_MILES:
          return meters / 1852;
      }
    })();

    return {
      value: targetDistance,
      unit: targetUnit,
      unitText: this.distanceUnitToText(targetUnit),
    };
  }

  public async convertTemperature(
    temperature: number,
    sourceUnit: TemperatureUnit,
  ): Promise<ConversionResult<TemperatureUnit>> {
    const targetUnit = await this.settings.getTemperatureUnit();

    if (sourceUnit == targetUnit) {
      return {
        value: temperature,
        unit: targetUnit,
        unitText: this.temperatureUnitToText(targetUnit),
      };
    }

    const celsius = (() => {
      switch (sourceUnit) {
        case TemperatureUnit.CELSIUS:
          return temperature;
        case TemperatureUnit.FAHRENHEIT:
          return (temperature - 32) / 1.8;
      }
    })();

    const targetTemperature = (() => {
      switch (targetUnit) {
        case TemperatureUnit.CELSIUS:
          return celsius;
        case TemperatureUnit.FAHRENHEIT:
          return celsius * 1.8 + 32;
      }
    })();

    return {
      value: targetTemperature,
      unit: targetUnit,
      unitText: this.temperatureUnitToText(targetUnit),
    };
  }

  public speedUnitToText(unit: SpeedUnit) {
    switch (unit) {
      case SpeedUnit.KILOMETERS_PER_HOUR:
        return 'km/h';
      case SpeedUnit.METERS_PER_SECOND:
        return 'm/s';
      case SpeedUnit.KNOTS:
        return 'knt';
    }
  }

  public distanceUnitToText(unit: DistanceUnit) {
    switch (unit) {
      case DistanceUnit.KILOMETERS:
        return 'km';
      case DistanceUnit.METER:
        return 'm';
      case DistanceUnit.SEA_MILES:
        return 'sm';
    }
  }

  public temperatureUnitToText(unit: TemperatureUnit) {
    switch (unit) {
      case TemperatureUnit.CELSIUS:
        return '°C';
      case TemperatureUnit.FAHRENHEIT:
        return '°F';
    }
  }
}

export interface ConversionResult<Unit> {
  value: number;
  unit: Unit;
  unitText: string;
}
