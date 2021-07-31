import { v4 as uuidv4 } from 'uuid';

export class Map {
    public uuid: string;
    public type: string;
    public name: string;
    public url: string;
    public enabled: boolean;

    constructor(type: string, name: string, url: string) {
        this.uuid = uuidv4();
        this.type = type;
        this.name = name;
        this.url = url;
        this.enabled = false;
    }
}