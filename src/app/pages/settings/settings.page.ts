import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonListHeader,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonToggle,
  IonInput,
  IonRange,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Language } from 'src/app/models/settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TranslateModule,
    IonList,
    IonListHeader,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel,
    IonToggle,
    IonInput,
    IonRange,
  ],
})
export class SettingsPage implements OnInit {
  public speedUnit = '0';
  public distanceUnit = '0';
  public temperatureUnit = '0';
  public language = Language.GERMAN;
  public mapPreloading = 1;
  public keepAwake = false;
  public animations = false;
  public positionAccuracy = false;
  public openWeatherMapApiKey = '';

  constructor(
    private readonly settings: SettingsService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit() {
    this.loadSettingsValues();
  }

  private async loadSettingsValues() {
    const {
      speedUnit,
      distanceUnit,
      temperatureUnit,
      language,
      mapPreloading,
      keepAwake,
      animations,
      positionAccuracy,
      openWeatherMapApiKey,
    } = await this.settings.getAllSettings();

    this.speedUnit = speedUnit.toString();
    this.distanceUnit = distanceUnit.toString();
    this.temperatureUnit = temperatureUnit.toString();
    this.language = language;
    this.mapPreloading = mapPreloading;
    this.keepAwake = keepAwake;
    this.animations = animations;
    this.positionAccuracy = positionAccuracy;
    this.openWeatherMapApiKey = openWeatherMapApiKey;
  }

  protected async updateSpeedUnit() {
    const value = Number.parseInt(this.speedUnit);
    await this.settings.setSpeedUnit(value);
  }

  protected async updateDistanceUnit() {
    const value = Number.parseInt(this.distanceUnit);
    await this.settings.setDistanceUnit(value);
  }

  protected async updateTemperatureUnit() {
    const value = Number.parseInt(this.temperatureUnit);
    await this.settings.setTemperatureUnit(value);
  }

  protected async updateLanguage() {
    const value = this.language;
    await this.settings.setLanguage(value);
    this.translate.setDefaultLang(value);
  }

  protected async updateMapPreloading() {
    await this.settings.setMapPreloading(this.mapPreloading);
  }

  protected async updateKeepAwake() {
    await this.settings.setKeepAwake(this.keepAwake);
  }

  protected async updateAnimations() {
    await this.settings.setAnimations(this.animations);
  }

  protected async updatePositionAccuracy() {
    await this.settings.setPositionAccuracy(this.positionAccuracy);
  }

  protected async updateOpenWeatherMapApiKey() {
    await this.settings.setOpenWeatherMapApiKey(this.openWeatherMapApiKey);
  }
}
