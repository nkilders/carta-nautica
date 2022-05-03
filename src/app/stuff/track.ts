import { v4 as uuidv4 } from 'uuid';
import * as L from 'leaflet';

export class Track {
    public readonly uuid: string;
    public readonly name: string;
    
    private points: L.LatLngTuple[];

    constructor(name: string) {
        this.uuid = uuidv4();
        this.name = name;
        this.points = [];
    }

    addPoint(point: L.LatLngTuple) {
        this.points.push(point);
    }

    getPoints() {
        return this.points;
    }
}