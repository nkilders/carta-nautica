import { getUserProjection } from 'ol/proj';

const { PI, sin, cos, atan2, asin, sqrt } = Math;
const EARTH_RADIUS_METERS = 6_371_000;

export function geoDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const dLat = radians(lat2 - lat1);
  const dLon = radians(lon2 - lon1);

  lat1 = radians(lat1);
  lat2 = radians(lat2);

  const a =
    sin(dLat / 2) * sin(dLat / 2) +
    sin(dLon / 2) * sin(dLon / 2) * cos(lat1) * cos(lat2);
  const c = 2 * atan2(sqrt(a), sqrt(1 - a));

  return (EARTH_RADIUS_METERS / 1000) * c;
}

// https://stackoverflow.com/a/67582451/19471211
export function toProjectedDistance(distanceMeters: number, latitude: number) {
  const latitudeRadians = radians(latitude);
  const factor = cos(latitudeRadians);
  const metersPerUnit = getUserProjection()!.getMetersPerUnit()!;

  return (distanceMeters / metersPerUnit) * factor;
}

/**
 * Calculates the bearing between two geographic coordinates. Value is 0 for North, 90 for East, 180 for South, and 270 for West.
 *
 * @param lat1 latitude of first point in degrees
 * @param lon1 longitude of first point in degrees
 * @param lat2 latitude of second point in degrees
 * @param lon2 longitude of second point in degrees
 * @returns bearing in degrees, normalized to 0-360
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  // Convert to radians
  lat1 = radians(lat1);
  lat2 = radians(lat2);
  const diffLong = radians(lon2 - lon1);

  // Calculate bearing
  const x = sin(diffLong) * cos(lat2);
  const y = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(diffLong);
  let initialBearing = atan2(x, y);

  // Convert to degrees and normalize to 0-360
  initialBearing = degrees(initialBearing);
  return (initialBearing + 360) % 360;
}

/**
 * @param latitude latitude in degrees
 * @param longitude longitude in degrees
 * @param distance distance in meters
 * @param bearing bearing in degrees
 *
 * @returns target coordinates in degrees
 */
export function offsetCoordinate(
  latitude: number,
  longitude: number,
  distance: number,
  bearing: number,
): { latitude: number; longitude: number } {
  const d = distance / EARTH_RADIUS_METERS;

  const rad = radians(bearing);
  const lat1 = radians(latitude);
  const lon1 = radians(longitude);

  const lat2 = asin(sin(lat1) * cos(d) + cos(lat1) * sin(d) * cos(rad));
  const lon2 =
    lon1 + atan2(sin(rad) * sin(d) * cos(lat1), cos(d) - sin(lat1) * sin(lat2));

  return { latitude: degrees(lat2), longitude: degrees(lon2) };
}

export function radians(degrees: number) {
  return degrees * (PI / 180);
}

export function degrees(radians: number) {
  return radians * (180 / PI);
}
