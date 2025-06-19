import { Injectable } from '@angular/core';
import { AlertController, AlertOptions } from '@ionic/angular';
import { SettingsService } from '../services/settings.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AlertWrapper {
  constructor(
    private readonly alertCtrl: AlertController,
    private readonly settings: SettingsService,
    private readonly translate: TranslateService,
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

  public async show(headerTextKey: string, messageTextKey: string) {
    const headerText = await this.translate.instant(headerTextKey);
    const messageText = await this.translate.instant(messageTextKey);
    const okText = await this.translate.instant('general.ok');

    const toast = await this.create({
      header: headerText,
      message: messageText,
      buttons: [
        {
          text: okText,
        },
      ],
    });

    await toast.present();
  }
}
