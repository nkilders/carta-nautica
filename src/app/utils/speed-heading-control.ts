import { Control } from 'ol/control';
import { SettingsService } from '../services/settings.service';
import { GeolocationService } from '../services/geolocation.service';
import { UnitService } from '../services/unit.service';
import { SpeedUnit } from '../models/settings';

export class SpeedHeadingControl extends Control {
  private readonly speedElement: HTMLButtonElement;
  private readonly headingElement: HTMLButtonElement;

  private speed: number = 0;

  constructor(
    private readonly geolocationService: GeolocationService,
    private readonly settingsService: SettingsService,
    private readonly unitService: UnitService,
  ) {
    const element = document.createElement('div');
    element.className = 'ol-control';
    element.setAttribute('style', 'top: 0.5em; left: 3em; overflow: hidden;');

    super({ element });

    this.speedElement = this.initSpeedElement();
    this.headingElement = this.initHeadingElement();

    this.updateSpeedText(null);
    this.updateHeadingText(null);
    this.initPositionWatch();
    this.initSettingsListeners();
  }

  private initSpeedElement() {
    const speedElement = document.createElement('button');

    speedElement.setAttribute(
      'style',
      'height: 2.75em; width: auto; float: left; margin-right: 0.25em; padding: 0 10px;',
    );
    speedElement.addEventListener('click', () => this.handleSpeedClick());
    this.element.appendChild(speedElement);

    return speedElement;
  }

  private initHeadingElement() {
    const headingElement = document.createElement('button');

    headingElement.setAttribute(
      'style',
      'height: 2.75em; width: auto; float: left; padding: 0 10px;',
    );
    this.element.appendChild(headingElement);

    return headingElement;
  }

  private initPositionWatch() {
    this.geolocationService.watchPosition((position) => {
      this.updateSpeedText(position.coords.speed);
      this.updateHeadingText(position.coords.heading);
      this.changed();
    });
  }

  private initSettingsListeners() {
    this.settingsService.on('speedUnit', () => {
      this.updateSpeedText(this.speed);
    });
  }

  private async handleSpeedClick() {
    const oldSpeedUnit = await this.settingsService.getSpeedUnit();
    const numberOfSpeedUnits = Object.keys(SpeedUnit).length / 2;

    const newSpeedUnit = (oldSpeedUnit + 1) % numberOfSpeedUnits;

    await this.settingsService.setSpeedUnit(newSpeedUnit);
  }

  private async updateSpeedText(speed: number | null) {
    speed ??= 0;

    this.speed = speed;

    const convertedSpeed = await this.unitService.convertSpeed(
      this.speed,
      SpeedUnit.METERS_PER_SECOND,
    );

    const value = convertedSpeed.value.toFixed(1);
    const unit = convertedSpeed.unitText;

    this.speedElement.innerHTML = `${value} ${unit}`;
  }

  private updateHeadingText(heading: number | null) {
    heading ??= 0;

    this.headingElement.innerHTML = `${heading.toFixed(0)}°`;
  }
}
