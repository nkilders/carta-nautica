import { Injectable } from '@angular/core';
import * as EventEmitter from 'events';
import { Map, OnlineMap } from '../models/map.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'map-layers';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private maps: Map[];
  private eventEmitter: EventEmitter;

  constructor(
    private storage: StorageService,
  ) {
    this.eventEmitter = new EventEmitter();
  }

  async getAllMaps() {
    if(!this.maps) await this.init();

    return this.maps;
  }

  async getMapById(mapId: string) {
    if(!this.maps) await this.init();

    return this.maps.find(map => map.uuid === mapId);
  }

  async addMap(map: Map) {
    if(!this.maps) await this.init();

    map.position = this.maps.length;

    this.maps.push(map);

    this.eventEmitter.emit('create', map.uuid, map);

    await this.save();
  }

  async updateMap(map: Map) {
    if(!this.maps) await this.init();

    this.maps.forEach((m, i) => {
      if(m.uuid !== map.uuid) return;
      
      this.maps[i] = map;

      this.eventEmitter.emit('update', map.uuid, map);
    });

    await this.save();
  }

  async updateMapPosition(map: Map, newPosition: number) {
    if(!this.maps) await this.init();

    this.maps.sort((a, b) => a.position - b.position);

    this.arrayMove(this.maps, map.position, newPosition);
    
    this.maps.forEach((m, i) => {
      if(m.position === i) return;

      m.position = i;
      this.maps[i] = m;
      
      this.eventEmitter.emit('update', m.uuid, m);
    });

    await this.save();
  }

  async deleteMap(map: Map) {
    if(!this.maps) await this.init();

    this.eventEmitter.emit('delete', map.uuid, map);

    const toKeep: Map[] = [];
    for(const m of this.maps) {
      if(m.uuid !== map.uuid) {
        toKeep.push(m);
      }
    }

    this.maps = toKeep;

    this.updatePositions();

    await this.save();
  }

  private updatePositions() {
    this.maps.sort((a, b) => a.position - b.position);

    this.maps.forEach((m, i) => {
      if(m.position === i) return;
      
      m.position = i;
      this.eventEmitter.emit('update', m.uuid, m);
    });
  }

  on(event: 'create' | 'update' | 'delete', listener: (uuid: string, map: Map) => void): void;

  on(event: string, listener: (...args: any) => void) {
    this.eventEmitter.on(event, listener);
  }
  
  private async init() {
    this.maps = await this.storage.get(STORAGE_KEY);

    if(!this.maps) {
      this.maps = this.initialMaps();
      await this.save();
    }
  }

  private async save() {
    await this.storage.set(STORAGE_KEY, this.maps);
  }

  private initialMaps(): Map[] {
    return [
      new OnlineMap('OpenSeaMap', 'http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', true),
      new OnlineMap('OpenStreetMap DE', 'https://a.tile.openstreetmap.de/{z}/{x}/{y}.png', true),
      new OnlineMap('OpenStreetMap', 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'),
    ];
  }

  private arrayMove(arr: any[], indexFrom: number, indexTo: number) {
    if (indexTo >= arr.length) {
      let k = indexTo - arr.length + 1;

      while (k--) {
        arr.push(undefined);
      }
    }

    arr.splice(indexTo, 0, arr.splice(indexFrom, 1)[0]);

    return arr;
  }
}