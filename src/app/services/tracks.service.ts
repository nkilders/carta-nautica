import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { Track, TrackWithoutId } from '../models/tracks';

const STORAGE_KEY = 'tracks';

@Injectable({
  providedIn: 'root',
})
export class TracksService {
  private readonly eventEmitter: EventEmitter;
  private tracks?: Track[];

  constructor(private readonly storage: StorageService) {
    this.eventEmitter = new EventEmitter();
  }

  public async getAll() {
    await this.init();

    return this.tracks!;
  }

  public async get(trackId: string) {
    await this.init();

    const track = this.tracks?.find((m) => m.id === trackId);

    return track || null;
  }

  public async create(track: TrackWithoutId) {
    await this.init();

    const newTrack: Track = {
      id: uuidv4(),
      ...track,
    };

    this.tracks!.push(newTrack);

    this.eventEmitter.emit('create', newTrack.id, newTrack);

    await this.save();

    return newTrack;
  }

  public async update(trackId: string, track: TrackWithoutId) {
    await this.init();

    const oldTrack = await this.get(trackId);
    if (!oldTrack) {
      return;
    }

    const updatedTrack: Track = { id: trackId, ...track };

    this.tracks = this.tracks!.map((t) =>
      t.id === trackId ? updatedTrack : t,
    );

    this.eventEmitter.emit('update', trackId, updatedTrack);

    await this.save();

    return updatedTrack;
  }

  public async delete(trackId: string) {
    await this.init();

    const track = await this.get(trackId);
    if (!track) {
      return;
    }

    this.tracks = this.tracks!.filter((t) => t.id !== trackId);

    this.eventEmitter.emit('delete', trackId, track);

    await this.save();
  }

  on(
    event: 'create' | 'update' | 'delete',
    listener: (trackId: string, track: Track) => void,
  ): void;

  public on(event: string, listener: (...args: any) => void) {
    this.eventEmitter.on(event, listener);
  }

  private async init() {
    if (this.tracks) {
      return;
    }

    this.tracks = await this.storage.get(STORAGE_KEY);

    if (!this.tracks) {
      this.tracks = [];
      await this.save();
    }
  }

  private async save() {
    await this.storage.set(STORAGE_KEY, this.tracks);
  }
}
