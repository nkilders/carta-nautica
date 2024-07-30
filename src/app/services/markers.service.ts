import { Injectable } from '@angular/core';
import { Marker, MarkerWithoutId } from '../models/markers';
import { StorageService } from './storage.service';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'markers';

@Injectable({
  providedIn: 'root',
})
export class MarkersService {
  private markers?: Marker[];
  private eventEmitter: EventEmitter;

  constructor(private storage: StorageService) {
    this.eventEmitter = new EventEmitter();
  }

  public async getAll() {
    await this.init();

    return this.markers!;
  }

  public async get(markerId: string) {
    await this.init();

    const marker = this.markers?.find((m) => m.id === markerId);

    return marker || null;
  }

  public async create(marker: MarkerWithoutId) {
    await this.init();

    const newMarker: Marker = {
      id: uuidv4(),
      ...marker,
    };

    this.markers!.push(newMarker);

    this.eventEmitter.emit('create', newMarker.id, newMarker);

    await this.save();

    return newMarker;
  }

  public async update(markerId: string, marker: MarkerWithoutId) {
    await this.init();

    const oldMarker = await this.get(markerId);
    if (!oldMarker) {
      return;
    }

    const updatedMarker: Marker = { id: markerId, ...marker };

    this.markers = this.markers!.map((m) =>
      m.id === markerId ? updatedMarker : m,
    );

    this.eventEmitter.emit('update', markerId, updatedMarker);

    await this.save();

    return updatedMarker;
  }

  public async delete(markerId: string) {
    await this.init();

    const marker = await this.get(markerId);
    if (!marker) {
      return;
    }

    this.markers = this.markers!.filter((m) => m.id !== markerId);

    this.eventEmitter.emit('delete', markerId, marker);

    await this.save();
  }

  on(
    event: 'create' | 'update' | 'delete',
    listener: (markerId: string, marker: Marker) => void,
  ): void;

  public on(event: string, listener: (...args: any) => void) {
    this.eventEmitter.on(event, listener);
  }

  private async init() {
    if (this.markers) {
      return;
    }

    this.markers = await this.storage.get(STORAGE_KEY);

    if (!this.markers) {
      this.markers = [];
      await this.save();
    }
  }

  private async save() {
    await this.storage.set(STORAGE_KEY, this.markers);
  }
}
