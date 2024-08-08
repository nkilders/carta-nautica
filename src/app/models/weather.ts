// https://openweathermap.org/forecast5

export interface WeatherResponse {
  cod: string;
  message: number;
  list: WeatherForecast[];
  city: WeatherCity;
}

export interface WeatherForecast {
  /** Time of data forecasted, unix, UTC */
  dt: number;
  main: {
    /** Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit */
    temp: number;
    /** This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit */
    feels_like: number;
    /** Minimum temperature at the moment of calculation. This is minimal forecasted temperature (within large megalopolises and urban areas), use this parameter optionally. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit */
    temp_min: number;
    /** Maximum temperature at the moment of calculation. This is maximal forecasted temperature (within large megalopolises and urban areas), use this parameter optionally. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit */
    temp_max: number;
    /** Atmospheric pressure on the sea level by default, hPa */
    pressure: number;
    /** Atmospheric pressure on the sea level, hPa */
    sea_level: number;
    /** Atmospheric pressure on the ground level, hPa */
    grnd_level: number;
    /** Humidity, % */
    humidity: number;
    temp_kf: number;
  };
  weather: {
    /** Weather condition id */
    id: number;
    /** Group of weather parameters (Rain, Snow, Clouds etc.) */
    main: string;
    /** Weather condition within the group */
    description: string;
    /** Weather icon id */
    icon: string;
  }[];
  clouds: {
    /** Cloudiness, % */
    all: number;
  };
  wind: {
    /** Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour */
    speed: number;
    /** Wind direction, degrees (meteorological) */
    deg: number;
    /** Wind gust. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour */
    gust: number;
  };
  rain: {
    /** Rain volume for last 3 hours, mm. Please note that only mm as units of measurement are available for this parameter */
    '3h': number;
  };
  /** Average visibility, metres. The maximum value of the visibility is 10km */
  visibility: number;
  /** Probability of precipitation. The values of the parameter vary between 0 and 1, where 0 is equal to 0%, 1 is equal to 100% */
  pop: number;
  sys: {
    /** Part of the day (n - night, d - day) */
    pod: string;
  };
  /** Time of data forecasted, ISO, UTC */
  dt_txt: string;
}

export interface WeatherCity {
  /** City ID */
  id: number;
  /** City name */
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  /** Country code (GB, JP etc.) */
  country: string;
  /** City population */
  population: number;
  /** Shift in seconds from UTC */
  timezone: number;
  /** Sunrise time, Unix, UTC */
  sunrise: number;
  /** Sunset time, Unix, UTC */
  sunset: number;
}
