import { Control } from 'ol/control';
import { SettingsService } from '../services/settings.service';
import { GeolocationService } from '../services/geolocation.service';
import { UnitService } from '../services/unit.service';
import { SpeedUnit } from '../models/settings';

export class SpeedHeadingControl extends Control {
  private readonly button: HTMLButtonElement;

  private speed: number = 0;
  private heading: number = 0;

  constructor(
    private readonly geolocationService: GeolocationService,
    private readonly settingsService: SettingsService,
    private readonly unitService: UnitService,
  ) {
    const element = document.createElement('div');
    element.className = 'ol-control';
    element.setAttribute('style', 'top: 0.5em; left: 3em; overflow: hidden;');

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
    button.addEventListener('click', () => this.cycleSpeedUnit());
    this.element.appendChild(button);

    this.updateText(null, null);

    return button;
  }

  private initListeners() {
    this.geolocationService.watchPosition((position) => {
      this.updateText(position.coords.speed, position.coords.heading);
    });

    this.settingsService.on('speedUnit', () => {
      this.updateText(this.speed, this.heading);
    });
  }

  private async cycleSpeedUnit() {
    const oldSpeedUnit = await this.settingsService.getSpeedUnit();
    const numberOfSpeedUnits = Object.keys(SpeedUnit).length / 2;

    const newSpeedUnit = (oldSpeedUnit + 1) % numberOfSpeedUnits;

    await this.settingsService.setSpeedUnit(newSpeedUnit);
  }

  private async updateText(speed: number | null, heading: number | null) {
    speed ??= 0;
    heading ??= 0;

    this.speed = speed;
    this.heading = heading;

    const convertedSpeed = await this.unitService.convertSpeed(
      this.speed,
      SpeedUnit.METERS_PER_SECOND,
    );

    const value = convertedSpeed.value.toFixed(1);
    const unit = convertedSpeed.unitText;

    this.button.innerHTML = `${value} ${unit}<br>${this.heading.toFixed(0)}°`;

    this.changed();
  }
}
