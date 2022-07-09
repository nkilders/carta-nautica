import { Injectable } from '@angular/core';
import { Track } from '../models/track.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'tracks';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private tracks: Track[];

  constructor(
    private storageSrv: StorageService,
  ) { }

  async getAllTracks() {
    await this.init();

    return this.tracks;
  }

  async addTrack(track: Track) {
    await this.init();

    this.tracks.push(track);

    await this.save();
  }

  async updateTrack(track: Track) {
    await this.init();

    this.tracks.forEach((t, i) => {
      if(t.uuid !== track.uuid) return;

      this.tracks[i] = track;
    });

    await this.save();
  }

  async deleteTrack(track: Track) {
    await this.init();

    const toKeep: Track[] = [];
    for(const t of this.tracks) {
      if(t.uuid !== track.uuid) {
        toKeep.push(t);
      }
    }

    this.tracks = toKeep;

    await this.save();
  }

  private async init() {
    if(this.tracks) return;

    this.tracks = await this.storageSrv.get(STORAGE_KEY);

    if(!this.tracks) {
      this.tracks = [];
      await this.save();
    }
  }

  private async save() {
    await this.storageSrv.set(STORAGE_KEY, this.tracks);
  }
}