import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { Route, Stop } from '../models/route-planning';
import { StorageService } from './storage.service';
import { GeolocationService } from './geolocation.service';
import { Position } from '@capacitor/geolocation';
import { calculateBearing } from '../utils/coordinates';

const STORAGE_KEY = 'route-planning';

@Injectable({
  providedIn: 'root',
})
export class RoutePlanningService {
  private readonly eventEmitter: EventEmitter;
  private route: Route;

  constructor(
    private readonly storage: StorageService,
    private readonly geolocation: GeolocationService,
  ) {
    this.eventEmitter = new EventEmitter();
    this.route = [];

    this.loadRoute();

    this.geolocation.watchPosition((position) => this.handlePosition(position));
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

  private handlePosition(position: Position) {
    if (this.route.length <= 1) {
      return;
    }

    const { longitude, latitude, heading } = position.coords;

    if (!heading) {
      return;
    }

    const [nextHeading, nextNextHeading] = this.calculateHeadings(
      latitude,
      longitude,
      heading,
    );

    const frontAngle = 45;
    const backAngle = 90;

    const nextHeadingMatches =
      nextHeading > 180 - backAngle / 2 && nextHeading < 180 + backAngle / 2;
    const nextNextHeadingMatches =
      nextNextHeading > 360 - frontAngle / 2 ||
      nextNextHeading < frontAngle / 2;

    if (nextHeadingMatches && nextNextHeadingMatches) {
      this.removeStop(0);
    }
  }

  private calculateHeadings(
    latitude: number,
    longitude: number,
    heading: number,
  ) {
    const nextStop = this.route[0];
    const nextHeading = calculateBearing(
      latitude,
      longitude,
      nextStop.latitude,
      nextStop.longitude,
    );
    const nextHeadingNormalized = (nextHeading - heading + 360) % 360;

    const nextNextStop = this.route[1];
    const nextNextHeading = calculateBearing(
      latitude,
      longitude,
      nextNextStop.latitude,
      nextNextStop.longitude,
    );
    const nextNextHeadingNormalized = (nextNextHeading - heading + 360) % 360;

    return [nextHeadingNormalized, nextNextHeadingNormalized];
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
