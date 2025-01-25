import { Control } from 'ol/control';
import { SettingsService } from '../services/settings.service';
import { GeolocationService } from '../services/geolocation.service';
import { UnitService } from '../services/unit.service';
import { SpeedUnit } from '../models/settings';

export class SpeedHeadingControl extends Control {
  private speedElement?: HTMLButtonElement;
  private headingElement?: HTMLButtonElement;

  private speed: number = 0;

  constructor(
    private settingsSrv: SettingsService,
    private geolocationSrv: GeolocationService,
    private unitSrv: UnitService,
  ) {
    const element = document.createElement('div');
    element.className = 'ol-control';
    element.setAttribute('style', 'top: 0.5em; left: 3em; overflow: hidden;');

    super({ element });

    this.initElements();
    this.updateSpeedText(null);
    this.updateHeadingText(null);
    this.initPositionWatch();
    this.initSettingsListeners();
  }

  private initElements() {
    this.speedElement = document.createElement('button');
    this.speedElement.setAttribute(
      'style',
      'height: 2.75em; width: auto; float: left; margin-right: 0.25em; padding: 0 10px;',
    );
    this.speedElement.addEventListener('click', () => this.handleSpeedClick());
    this.element.appendChild(this.speedElement);

    this.headingElement = document.createElement('button');
    this.headingElement.setAttribute(
      'style',
      'height: 2.75em; width: auto; float: left; padding: 0 10px;',
    );
    this.element.appendChild(this.headingElement);
  }

  private async initPositionWatch() {
    await this.geolocationSrv.watchPosition((position) => {
      this.updateSpeedText(position.coords.speed);
      this.updateHeadingText(position.coords.heading);
      this.changed();
    });
  }

  private initSettingsListeners() {
    this.settingsSrv.on('speedUnit', () => {
      this.updateSpeedText(this.speed);
    });
  }

  private async handleSpeedClick() {
    const oldSpeedUnit = await this.settingsSrv.getSpeedUnit();
    const numberOfSpeedUnits = Object.keys(SpeedUnit).length / 2;

    const newSpeedUnit = (oldSpeedUnit + 1) % numberOfSpeedUnits;

    await this.settingsSrv.setSpeedUnit(newSpeedUnit);
  }

  private async updateSpeedText(speed: number | null) {
    if (!speed) {
      speed = 0;
    }

    this.speed = speed;

    const convertedSpeed = await this.unitSrv.convertSpeed(
      this.speed,
      SpeedUnit.METERS_PER_SECOND,
    );

    const value = convertedSpeed.value.toFixed(1);
    const unit = convertedSpeed.unitText;

    this.speedElement!.innerHTML = `${value} ${unit}`;
  }

  private updateHeadingText(heading: number | null) {
    if (!heading) {
      heading = 0;
    }

    this.headingElement!.innerHTML = `${heading.toFixed(0)}°`;
  }
}
