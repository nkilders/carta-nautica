import { Geoposition, PositionError } from "@ionic-native/geolocation";
import { Control } from "ol/control";
import { GeolocationService } from "../services/geolocation.service";
import { SettingsService } from "../services/settings.service";
import { UnitService } from "../services/unit.service";
import { SpeedUnit } from "./settings.model";

export class SpeedHeadingControl extends Control {
    private speedElement: HTMLButtonElement;
    private headingElement: HTMLButtonElement;

    private settingsSrv: SettingsService;
    private geolocationSrv: GeolocationService;
    private unitSrv: UnitService;

    private speed: number = 0;

    constructor(settingsSrv: SettingsService, geolocationSrv: GeolocationService, unitSrv: UnitService) {
        const element = document.createElement('div');
        element.className = 'ol-control';
        element.setAttribute('style', 'top: 0.5em; left: 3em; overflow: hidden;');

        super({
            element: element,
        });
        
        this.settingsSrv = settingsSrv;
        this.geolocationSrv = geolocationSrv;
        this.unitSrv = unitSrv;

        this.speedElement = document.createElement('button');
        this.speedElement.setAttribute('style', 'height: 2.75em; width: auto; float: left; margin-right: 0.25em; padding: 0 10px;');
        this.speedElement.innerHTML = '0 m/s';
        this.speedElement.addEventListener('click', () => this.handleSpeedClick());
        element.appendChild(this.speedElement);
    
        this.headingElement = document.createElement('button');
        this.headingElement.setAttribute('style', 'height: 2.75em; width: auto; float: left; padding: 0 10px;');
        this.headingElement.innerHTML = '0°';
        element.appendChild(this.headingElement);

        this.init();
    }

    async init() {
        const obs = await this.geolocationSrv.watchPosition();
        obs.subscribe((pos) => this.geoHandle(pos));

        this.settingsSrv.on('speedUnit', () => this.updateSpeedText());
    }

    geoHandle(pos: Geoposition | PositionError) {
        if(!this.geolocationSrv.isPosition(pos)) return;

        const heading = (pos.coords.heading || 0).toFixed(0);
        this.headingElement.innerHTML = heading + '°';
        
        this.speed = (pos.coords.speed || 0);
        this.updateSpeedText();
    }

    async handleSpeedClick() {
        let speedUnit = await this.settingsSrv.getSpeedUnit();

        speedUnit = ++speedUnit % (Object.keys(SpeedUnit).length / 2);

        await this.settingsSrv.setSpeedUnit(speedUnit);
    }

    async updateSpeedText() {
        const speedData = await this.unitSrv.convertSpeed(this.speed, SpeedUnit.METERS_PER_SECOND);

        const speed = speedData[0].toFixed(2);
        
        this.speedElement.innerHTML = speed + ' ' + this.unitSrv.speedUnitToShortText(speedData[1]);
    }
}