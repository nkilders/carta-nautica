import { Injectable } from '@angular/core';
import { ModalController, ModalOptions } from '@ionic/angular';
import { SettingsService } from '../services/settings.service';

@Injectable({
  providedIn: 'root',
})
export class ModalWrapper {
  constructor(
    private readonly modalCtrl: ModalController,
    private readonly settings: SettingsService,
  ) {}

  public async create(opts: ModalOptions) {
    const animations = await this.settings.getAnimations();

    return this.modalCtrl.create({
      ...opts,
      animated: animations,
    });
  }

  public dismiss(data?: any, role?: string, id?: string) {
    return this.modalCtrl.dismiss(data, role, id);
  }

  public getTop() {
    return this.modalCtrl.getTop();
  }

  public async dismissTop() {
    const modal = await this.modalCtrl.getTop();
    if (modal) {
      await modal.dismiss();
    }
  }
}
