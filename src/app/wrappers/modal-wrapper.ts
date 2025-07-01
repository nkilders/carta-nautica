import { Injectable } from '@angular/core';
import { ModalController, ModalOptions } from '@ionic/angular';
import { SettingsService } from '../services/settings.service';

@Injectable({
  providedIn: 'root',
})
export class ModalWrapper {
  constructor(
    private readonly modalController: ModalController,
    private readonly settingsService: SettingsService,
  ) {}

  public async create(opts: ModalOptions) {
    const animations = await this.settingsService.getAnimations();

    return this.modalController.create({
      ...opts,
      animated: animations,
    });
  }

  public dismiss(data?: any, role?: string, id?: string) {
    return this.modalController.dismiss(data, role, id);
  }

  public getTop() {
    return this.modalController.getTop();
  }

  public async dismissTop() {
    const modal = await this.modalController.getTop();
    if (modal) {
      await modal.dismiss();
    }
  }
}
