import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Track } from '../../stuff/track';

const TRACKS_KEY = 'cn-tracks';

@Injectable({
  providedIn: 'root'
})
export class TrackStorageService {
  private storage: Storage;

  constructor() {
    this.storage = new Storage();
    this.storage.create();
  }

  public saveTrack(track: Track): Promise<any> {
    return this.storage.get(TRACKS_KEY).then((tracks: Track[]) => {
      if(tracks) {
        tracks.push(track);
        return this.storage.set(TRACKS_KEY, tracks);
      } else {
        return this.storage.set(TRACKS_KEY, [track]);
      }
    });
  }

  getTracks(): Promise<Track[]> {
    return this.storage.get(TRACKS_KEY);
  }

  updateTrack(track: Track): Promise<any> {
    return this.storage.get(TRACKS_KEY).then((tracks: Track[]) => {
      if(!tracks || tracks.length == 0) return null;

      let newArr: Track[] = [];

      for(let t of tracks) {
        if(track.uuid === t.uuid) {
          newArr.push(track);
        } else {
          newArr.push(t);
        }
      }

      return this.storage.set(TRACKS_KEY, newArr);
    });
  }

  deleteTrack(track: Track): Promise<Track> {
    return this.storage.get(TRACKS_KEY).then((tracks: Track[]) => {
      if(!tracks || tracks.length == 0) return null;

      let toKeep: Track[] = [];

      for(let t of tracks) {
        if(t.uuid != track.uuid) {
          toKeep.push(t);
        }
      }

      return this.storage.set(TRACKS_KEY, toKeep);
    });
  }
}
