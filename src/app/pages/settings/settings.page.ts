import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonListHeader, IonSelect, IonSelectOption, IonItem, IonLabel, IonToggle } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Language } from 'src/app/models/settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TranslateModule, IonList, IonListHeader, IonSelect, IonSelectOption, IonItem, IonLabel, IonToggle]
})
export class SettingsPage implements OnInit {
  public speedUnit = '0';
  public distanceUnit = '0';
  public language = Language.GERMAN;
  public mapPreloading = false;
  public keepAwake = false;

  constructor(
    private settings: SettingsService,
    private translate: TranslateService,
  ) { }

  async ngOnInit() {
    await this.loadSettingsValues();
  }

  private async loadSettingsValues() {
    const {speedUnit, distanceUnit, language, mapPreloading, keepAwake} = await this.settings.getAllSettings();

    this.speedUnit = speedUnit.toString();
    this.distanceUnit = distanceUnit.toString();
    this.language = language;
    this.mapPreloading = mapPreloading;
    this.keepAwake = keepAwake;
  }

  protected async updateSpeedUnit() {
    const value= Number.parseInt(this.speedUnit);
    await this.settings.setSpeedUnit(value);
  }
  
  protected async updateDistanceUnit() {
    const value= Number.parseInt(this.distanceUnit);
    await this.settings.setDistanceUnit(value);
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
}
