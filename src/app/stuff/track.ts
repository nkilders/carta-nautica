import { v4 as uuidv4 } from 'uuid';

export class Track {
    public uuid: string;
    public name: string;
    public points: Array<Array<number>>;

    constructor(name: string) {
        this.uuid = uuidv4();
        this.name = name;
        this.points = [];
    }

    addPoint(point: Array<number>) {
        if(point.length == 2) {
            this.points.push(point)
        }
    }
}