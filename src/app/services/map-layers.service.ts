import { Injectable } from '@angular/core';
import * as EventEmitter from 'events';
import { Map } from '../models/map.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'map-layers';

@Injectable({
  providedIn: 'root'
})
export class MapLayersService {
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

  async saveMap(map: Map) {
    if(!this.maps) await this.init();

    let insert = true;
    this.maps.forEach((m, i) => {
      if(m.uuid === map.uuid) {
        this.maps[i] = map;
        this.eventEmitter.emit('update', map.uuid, map);
        insert = false;
      }
    });

    if(insert) {
      this.maps.push(map);
      this.eventEmitter.emit('create', map.uuid, map);
    }

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

  
  on(event: 'create' | 'update' | 'delete', listener: (uuid: string, map: Map) => void) {
    this.eventEmitter.on(event, listener);
  }
  
  private async init() {
    this.maps = await this.storage.get(STORAGE_KEY);

    if(!this.maps) {
      this.maps = [];
      await this.save();
    }
  }

  private async save() {
    await this.storage.set(STORAGE_KEY, this.maps);
  }
}