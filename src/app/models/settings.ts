export interface Settings {
  speedUnit: SpeedUnit;
  distanceUnit: DistanceUnit;
  language: Language;
  mapPreloading: boolean;
  keepAwake: boolean;
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

export enum Language {
  GERMAN = 'de',
  ENGLISH = 'en',
}
