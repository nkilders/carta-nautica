import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Map } from '../../stuff/map';

const MAPS_KEY = 'cn-maps';

@Injectable({
  providedIn: 'root'
})
export class MapStorageService {
  private storage: Storage;
  private updateListeners: Function[];

  constructor() {
    this.storage = new Storage();
    this.storage.create();

    this.updateListeners = [];
  }

  async saveMap(map: Map) {
    let maps: Map[] = await this.storage.get(MAPS_KEY);
    
    if(!maps) {
      maps = [ map ];
    } else {
      maps.push(map);
    }

    this.fireUpdateListeners(maps);

    await this.storage.set(MAPS_KEY, maps);
  }

  async getMaps() {
    return this.storage.get(MAPS_KEY);
  }

  async updateMap(map: Map) {
    const maps: Map[] = await this.storage.get(MAPS_KEY);
    if(!maps) return;

    const newArr: Map[] = [];

    for(const m of maps) {
      newArr.push((m.uuid === map.uuid) ? map : m);
    }

    this.fireUpdateListeners(newArr);

    await this.storage.set(MAPS_KEY, newArr);
  }

  async deleteMap(map: Map) {
    const maps: Map[] = await this.storage.get(MAPS_KEY);
    if(!maps || maps.length === 0) return;

    const toKeep: Map[] = [];

    for(const m of maps) {
      if(m.uuid !== map.uuid) {
        toKeep.push(m);
      }
    }

    this.fireUpdateListeners(toKeep);

    await this.storage.set(MAPS_KEY, toKeep);
  }

  registerUpdateListener(listener: Function) {
    this.updateListeners.push(listener);
  }

  private fireUpdateListeners(maps: Map[]) {
    this.updateListeners.forEach(l => l(maps));
  }
}
