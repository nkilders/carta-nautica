import { Control } from 'ol/control';
import { SettingsService } from '../services/settings.service';
import { GeolocationService } from '../services/geolocation.service';
import { UnitService } from '../services/unit.service';
import { DistanceUnit } from '../models/settings';
import { RoutePlanningService } from '../services/route-planning.service';
import { geoDistance } from './coordinates';
import { Route } from '../models/route-planning';
import { Position } from '@capacitor/geolocation';

export class RoutePlanningControl extends Control {
  private readonly button: HTMLButtonElement;

  constructor(
    // Services
    private readonly geolocationService: GeolocationService,
    private readonly routePlanningService: RoutePlanningService,
    private readonly settingsService: SettingsService,
    private readonly unitService: UnitService,
  ) {
    const element = document.createElement('div');
    element.className = 'ol-control';
    element.setAttribute('style', 'top: 4em; left: 0.5em; overflow: hidden;');

    super({ element });

    this.button = this.initButton();

    this.initListeners();
  }

  private initButton() {
    const button = document.createElement('button');

    button.setAttribute(
      'style',
      'height: 2.75em; width: auto; float: left; padding: 0 10px; line-height: 1; text-align: start;',
    );
    this.element.appendChild(button);

    return button;
  }

  private initListeners() {
    this.geolocationService.watchPosition((position) => {
      this.updateText();
    });

    this.settingsService.on('distanceUnit', (distanceUnit) => {
      this.updateText();
    });

    this.routePlanningService.on('update', (route) => {
      if (route.length === 0) {
        this.setVisible(false);
        return;
      }

      this.setVisible(true);
      this.updateText();
    });
  }

  private setVisible(visible: boolean) {
    this.element.style.display = visible ? 'block' : 'none';
  }

  private async updateText() {
    const position = this.geolocationService.getPosition();
    const route = this.routePlanningService.get();

    if (route.length === 0) {
      return;
    }

    const speedMps = position.coords.speed || 0;
    const speedKmh = speedMps * 3.6;

    const { distance, travelTime } = await this.calculateDataToFirstStop(
      position,
      route,
      speedKmh,
    );
    this.button.innerHTML = distance;
    if (speedKmh !== 0) {
      this.button.innerHTML += `, ~${travelTime}`;
    }

    if (route.length > 1) {
      const { distance, travelTime } = await this.calculateTotalData(
        position,
        route,
        speedKmh,
      );
      this.button.innerHTML += `<br>${distance}`;
      if (speedKmh !== 0) {
        this.button.innerHTML += `, ~${travelTime}`;
      }
    }

    this.changed();
  }

  private async calculateDataToFirstStop(
    position: Position,
    route: Route,
    speedKmh: number,
  ) {
    const distanceKm = geoDistance(
      position.coords.latitude,
      position.coords.longitude,
      route[0].latitude,
      route[0].longitude,
    );
    const distance = await this.unitService.convertDistance(
      distanceKm,
      DistanceUnit.KILOMETERS,
    );

    return {
      distance: `${distance.value.toFixed(1)} ${distance.unitText}`,
      travelTime: this.formatTravelTime(distanceKm / speedKmh),
    };
  }

  private async calculateTotalData(
    position: Position,
    route: Route,
    speedKmh: number,
  ) {
    let distanceKm = geoDistance(
      position.coords.latitude,
      position.coords.longitude,
      route[0].latitude,
      route[0].longitude,
    );
    for (let i = 1; i < route.length; i++) {
      const pointA = route[i - 1];
      const pointB = route[i];
      distanceKm += geoDistance(
        pointA.latitude,
        pointA.longitude,
        pointB.latitude,
        pointB.longitude,
      );
    }
    const distance = await this.unitService.convertDistance(
      distanceKm,
      DistanceUnit.KILOMETERS,
    );

    return {
      distance: `${distance.value.toFixed(1)} ${distance.unitText}`,
      travelTime: this.formatTravelTime(distanceKm / speedKmh),
    };
  }

  private formatTravelTime(hours: number) {
    const integerHour = Math.floor(hours);
    const minutes = Math.round((hours - integerHour) * 60);
    const paddedMinutes = minutes.toFixed(0).padStart(2, '0');

    if (integerHour === 0) {
      return `${minutes.toFixed(0)} min`;
    } else {
      return `${integerHour}:${paddedMinutes} h`;
    }
  }
}
