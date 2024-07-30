export interface Marker extends MarkerWithoutId {
  id: string;
}

export interface MarkerWithoutId {
  name: string;
  longitude: number;
  latitude: number;
}
