import { getUserProjection } from 'ol/proj';

export function geoDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const earthRadiusKm = 6371;

  const dLat = radians(lat2 - lat1);
  const dLon = radians(lon2 - lon1);

  lat1 = radians(lat1);
  lat2 = radians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

// https://stackoverflow.com/a/67582451/19471211
export function toProjectedDistance(distanceMeters: number, latitude: number) {
  const latitudeRadians = radians(latitude);
  const factor = Math.cos(latitudeRadians);
  const metersPeterUnit = getUserProjection()!.getMetersPerUnit()!;

  return (distanceMeters / metersPeterUnit) * factor;
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
  const x = Math.sin(diffLong) * Math.cos(lat2);
  const y =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(diffLong);
  let initialBearing = Math.atan2(x, y);

  // Convert to degrees and normalize to 0-360
  initialBearing = degrees(initialBearing);
  return (initialBearing + 360) % 360;
}

function radians(degrees: number) {
  return degrees * (Math.PI / 180);
}

function degrees(radians: number) {
  return radians * (180 / Math.PI);
}
