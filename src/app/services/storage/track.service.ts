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



  async saveTrack(track: Track) {
    const tracks: Track[] = await this.storage.get(TRACKS_KEY);

    tracks.push(track);

    await this.storage.set(TRACKS_KEY, tracks);
  }

  async getTracks() {
    return this.storage.get(TRACKS_KEY);
  }

  async updateTrack(track: Track) {
    const tracks: Track[] = await this.storage.get(TRACKS_KEY);
    if(!tracks || tracks.length == 0) return;

    const newArr: Track[] = [];

    for(const t of tracks) {
      newArr.push((t.uuid === track.uuid) ? track : t);
    }

    await this.storage.set(TRACKS_KEY, newArr);
  }

  async deleteTrack(track: Track) {
    const tracks: Track[] = await this.storage.get(TRACKS_KEY);
    if(!track || tracks.length == 0) return;

    const toKeep: Track[] = [];

    for(const t of tracks) {
      if(t.uuid !== track.uuid) {
        toKeep.push(t);
      }
    }

    await this.storage.set(TRACKS_KEY, toKeep);
  }
}
