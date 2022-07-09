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

    getCoordinatesForRendering() {
        return this.points.map(point => point[1]);
    }
}