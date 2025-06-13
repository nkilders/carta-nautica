import { Injectable } from '@angular/core';
import { AlertController, AlertOptions } from '@ionic/angular';
import { SettingsService } from '../services/settings.service';

@Injectable({
  providedIn: 'root',
})
export class AlertWrapper {
  constructor(
    private readonly alertCtrl: AlertController,
    private readonly settings: SettingsService,
  ) {}

  public async create(opts: AlertOptions) {
    const animations = await this.settings.getAnimations();

    return this.alertCtrl.create({
      ...opts,
      animated: animations,
    });
  }

  public dismiss(data?: any, role?: string, id?: string) {
    return this.alertCtrl.dismiss(data, role, id);
  }

  public getTop() {
    return this.alertCtrl.getTop();
  }
}
