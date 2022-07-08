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

    this.maps.push(map);

    this.eventEmitter.emit('create', map.uuid, map);

    await this.save();
  }

  async updateMap(map: Map) {
    if(!this.maps) await this.init();

    this.maps.forEach((m, i) => {
      if(m.uuid === map.uuid) {
        this.maps[i] = map;
        this.eventEmitter.emit('update', map.uuid, m, map);
      }
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

    await this.save();
  }

  on(event: 'create' | 'delete', listener: (uuid: string, map: Map) => void): void;
  on(event: 'update', listener: (uuid: string, oldMap: Map, newMap: Map) => void): void;

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
}