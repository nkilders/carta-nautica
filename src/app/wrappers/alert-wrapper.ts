import { Injectable } from '@angular/core';
import { AlertController, AlertOptions } from '@ionic/angular';
import { SettingsService } from '../services/settings.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AlertWrapper {
  constructor(
    private readonly alertController: AlertController,
    private readonly settingsService: SettingsService,
    private readonly translateService: TranslateService,
  ) {}

  public async create(opts: AlertOptions) {
    const animations = await this.settingsService.getAnimations();

    return this.alertController.create({
      ...opts,
      animated: animations,
    });
  }

  public dismiss(data?: any, role?: string, id?: string) {
    return this.alertController.dismiss(data, role, id);
  }

  public getTop() {
    return this.alertController.getTop();
  }

  public async show(headerTextKey: string, messageTextKey: string) {
    const headerText = await this.translateService.instant(headerTextKey);
    const messageText = await this.translateService.instant(messageTextKey);
    const okText = await this.translateService.instant('general.ok');

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
