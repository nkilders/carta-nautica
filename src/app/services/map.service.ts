import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Map } from '../stuff/map';

const MAPS_KEY = 'cn-maps';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private storage: Storage;

  constructor() {
    this.storage = new Storage();
    this.storage.create();
  }

  public addMap(map: Map): Promise<any> {
    return this.storage.get(MAPS_KEY).then((maps: Map[]) => {
      if(maps) {
        maps.push(map);
        return this.storage.set(MAPS_KEY, maps);
      } else {
        return this.storage.set(MAPS_KEY, [map]);
      }
    });
  }

  getMaps(): Promise<Map[]> {
    return this.storage.get(MAPS_KEY);
  }

  updateMap(map: Map): Promise<any> {
    return this.storage.get(MAPS_KEY).then((maps: Map[]) => {
      if(!maps || maps.length == 0) return null;

      let newArr: Map[] = [];

      for(let m of maps) {
        if(map.uuid === m.uuid) {
          newArr.push(map);
        } else {
          newArr.push(m);
        }
      }

      return this.storage.set(MAPS_KEY, newArr);
    });
  }

  deleteMap(map: Map): Promise<Map> {
    return this.storage.get(MAPS_KEY).then((maps: Map[]) => {
      if(!maps || maps.length == 0) return null;

      let toKeep: Map[] = [];

      for(let m of maps) {
        if(m.uuid != map.uuid) {
          toKeep.push(m);
        }
      }

      return this.storage.set(MAPS_KEY, toKeep);
    });
  }
}
