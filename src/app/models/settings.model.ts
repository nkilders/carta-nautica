export interface Settings {
    speedUnit: SpeedUnit;
    distanceUnit: DistanceUnit;
}

export enum SpeedUnit {
    KILOMETERS_PER_HOUR,
    METERS_PER_SECOND,
    KNOTS,
}

export enum DistanceUnit {
    KILOMETERS,
    METERS,
    SEA_MILES,
}