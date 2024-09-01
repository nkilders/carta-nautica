export interface Settings {
  speedUnit: SpeedUnit;
  distanceUnit: DistanceUnit;
  temperatureUnit: TemperatureUnit;
  language: Language;
  mapPreloading: number;
  keepAwake: boolean;
  animations: boolean;
  openWeatherMapApiKey: string;
}

export enum SpeedUnit {
  KILOMETERS_PER_HOUR = 0,
  METERS_PER_SECOND = 1,
  KNOTS = 2,
}

export enum DistanceUnit {
  KILOMETERS = 0,
  METER = 1,
  SEA_MILES = 2,
}

export enum TemperatureUnit {
  CELSIUS = 0,
  FAHRENHEIT = 1,
}

export enum Language {
  GERMAN = 'de',
  ENGLISH = 'en',
}
