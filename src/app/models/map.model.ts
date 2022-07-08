import { v4 as uuid } from 'uuid';

export abstract class Map {
    readonly uuid: string;
    
    name: string;
    type: string;
    src: string;
    enabled: boolean;

    position: number;

    constructor(name: string, type: string, src: string, enabled: boolean = false) {
        this.uuid = uuid();

        this.name = name;
        this.type = type;
        this.src = src;
        this.enabled = enabled;
        
        this.position = 99999;
    }
}

export class OnlineMap extends Map {

    constructor(name: string, url: string, enabled: boolean = false) {
        super(name, 'online', url, enabled);
    }

}

export class OfflineMap extends Map {

    constructor(name: string, path: string, enabled: boolean = false) {
        super(name, 'offline', path, enabled);
    }
    
}