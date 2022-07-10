import { Coordinate } from 'ol/coordinate';
import { v4 as uuid } from 'uuid';

export class Track {
    readonly uuid: string;
    
    name: string;
    points: [number, Coordinate][];

    constructor(name: string, points: [number, Coordinate][]) {
        this.uuid = uuid();

        this.name = name;
        this.points = points;
    }
}

export function getCoordinatesForRendering(track: Track) {
    return track.points.map(point => point[1]);
}

export function getTrackLength(track: Track) {
    let length = 0;

    for(let i = 1; i < track.points.length; i++) {
        length += distance(track.points[i-1][1], track.points[i][1]);
    }

    return length;
}

function distance(p1: Coordinate, p2: Coordinate) {
    const p = 0.017453292519943295; // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((p2[1] - p1[1]) * p) / 2 + 
            c(p1[1] * p) * c(p2[1] * p) * 
            (1 - c((p2[0] - p1[0]) * p)) / 2;
  
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}