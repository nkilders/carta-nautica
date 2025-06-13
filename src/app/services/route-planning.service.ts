import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { Route, Stop } from '../models/route-planning';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'route-planning';

@Injectable({
  providedIn: 'root',
})
export class RoutePlanningService {
  private route: Route;
  private readonly eventEmitter: EventEmitter;

  constructor(private readonly storage: StorageService) {
    this.route = [];
    this.eventEmitter = new EventEmitter();

    this.loadRoute();
  }

  public get() {
    return this.route;
  }

  public async addStop(stop: Stop, sequence: number) {
    this.route.splice(sequence, 0, stop);
    await this.save();
    this.eventEmitter.emit('update', this.route);
  }

  public async removeStop(sequence: number) {
    this.route.splice(sequence, 1);
    await this.save();
    this.eventEmitter.emit('update', this.route);
  }

  on(event: 'update', listener: (route: Route) => void): void;

  public on(event: string, listener: (...args: any) => void) {
    this.eventEmitter.on(event, listener);
  }

  private async save() {
    await this.storage.set(STORAGE_KEY, this.route);
  }

  private loadRoute() {
    this.storage.get(STORAGE_KEY).then((route) => {
      if (route) {
        this.route = route;
        this.eventEmitter.emit('update', this.route);
      }
    });
  }
}
