import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonListHeader, IonSelect, IonSelectOption, IonItem, IonLabel, IonToggle } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

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
  public mapPreloading = false;
  public keepAwake = false;

  constructor() { }

  ngOnInit() {
    this.loadSettingsValues();
  }

  private async loadSettingsValues() {
    // TODO: load all values
  }

  protected updateSpeedUnit() {
    // TODO: save new value
  }

  protected updateDistanceUnit() {
    // TODO: save new value
  }
  
  protected updateMapPreloading() {
    // TODO: save new value
  }
  
  protected updateKeepAwake() {
    // TODO: save new value
  }
}
