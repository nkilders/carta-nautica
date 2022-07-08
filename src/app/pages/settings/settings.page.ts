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
    private settings: SettingsService
  ) { }

  async ngOnInit() {
    this.speedUnit = (await this.settings.getSpeedUnit()).toString();
    this.distanceUnit = (await this.settings.getDistanceUnit()).toString();
    this.mapPreloading = await this.settings.getMapPreloading();
  }

  speedUnitUpdate() {
    this.settings.setSpeedUnit(Number.parseInt(this.speedUnit));
  }

  distanceUnitUpdate() {
    this.settings.setDistanceUnit(Number.parseInt(this.distanceUnit));
  }

  mapPreloadingUpdate() {
    this.settings.setMapPreloading(this.mapPreloading);
  }
}