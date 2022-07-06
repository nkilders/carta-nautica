import { v4 as uuid } from 'uuid';

export abstract class Map {
    readonly uuid: string;
    
    name: string;
    type: string;
    src: string;

    position: number;
    enabled: boolean;

    constructor(name: string, type: string, src: string) {
        this.uuid = uuid();

        this.name = name;
        this.type = type;
        this.src = src;
        
        this.position = 99999;
        this.enabled = false;
    }
}

export class OnlineMap extends Map {

    constructor(name: string, url: string) {
        super(name, 'online', url);
    }

}

export class OfflineMap extends Map {

    constructor(name: string, path: string) {
        super(name, 'offline', path);
    }
    
}