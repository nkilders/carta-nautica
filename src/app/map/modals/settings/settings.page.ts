import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  speedUnit: string;
  distanceUnit: string;
  keepAwake: boolean;
  language: string;

  constructor() { }

  ionViewWillEnter() {
    this.speedUnit = 'km/h';
    this.distanceUnit = 'km';
    this.keepAwake = true;
    this.language = 'de';
  }

}
