import { Component, OnInit } from '@angular/core';
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

  speedUnitAlertOptions = {
    header: 'Speed Unit',
  };
  
  distanceUnitAlertOptions = {
    header: 'Distance Unit',
  };

  constructor(
    private settingsSrv: SettingsService
  ) { }

  async ngOnInit() {
    this.speedUnit = (await this.settingsSrv.getSpeedUnit()).toString();
    this.distanceUnit = (await this.settingsSrv.getDistanceUnit()).toString();
    this.mapPreloading = await this.settingsSrv.getMapPreloading();
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
}