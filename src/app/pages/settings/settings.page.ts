import { Component, OnInit } from '@angular/core';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  speedUnit: string = '-1';
  distanceUnit: string = '-1';
  mapPreloading: boolean = false;
  keepAwake: boolean = false;

  appVersion: string;

  speedUnitAlertOptions = {
    header: 'Speed Unit',
  };
  
  distanceUnitAlertOptions = {
    header: 'Distance Unit',
  };

  constructor(
    private settingsSrv: SettingsService,
    private appVersionPlugin: AppVersion,
  ) { }

  async ngOnInit() {
    this.speedUnit = (await this.settingsSrv.getSpeedUnit()).toString();
    this.distanceUnit = (await this.settingsSrv.getDistanceUnit()).toString();
    this.mapPreloading = await this.settingsSrv.getMapPreloading();
    this.keepAwake = await this.settingsSrv.getKeepAwake();

    this.appVersion = (await this.appVersionPlugin.getVersionNumber());
  }

  speedUnitUpdate() {
    this.settingsSrv.setSpeedUnit(Number.parseInt(this.speedUnit));
  }

  distanceUnitUpdate() {
    this.settingsSrv.setDistanceUnit(Number.parseInt(this.distanceUnit));
  }

  mapPreloadingUpdate() {
    this.settingsSrv.setMapPreloading(this.mapPreloading);
  }

  keepAwakeUpdate() {
    this.settingsSrv.setKeepAwake(this.keepAwake);
  }
}