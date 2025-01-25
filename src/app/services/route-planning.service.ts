import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { Route, Stop } from '../models/route-planning';

@Injectable({
  providedIn: 'root',
})
export class RoutePlanningService {
  private readonly route: Route;
  private readonly eventEmitter: EventEmitter;

  constructor() {
    this.route = [];
    this.eventEmitter = new EventEmitter();
  }

  public get() {
    return this.route;
  }

  public addStop(stop: Stop, sequence: number) {
    this.route.splice(sequence, 0, stop);
    this.eventEmitter.emit('update', this.route);
  }

  public removeStop(sequence: number) {
    this.route.splice(sequence, 1);
    this.eventEmitter.emit('update', this.route);
  }

  on(event: 'update', listener: (route: Route) => void): void;

  public on(event: string, listener: (...args: any) => void) {
    this.eventEmitter.on(event, listener);
  }
}
