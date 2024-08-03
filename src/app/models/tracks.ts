export interface TrackWithoutId {
  name: string;
  points: Point[];
}

export interface Track extends TrackWithoutId {
  id: string;
}

export interface Point {
  timestamp: number;
  longitude: number;
  latitude: number;
}
