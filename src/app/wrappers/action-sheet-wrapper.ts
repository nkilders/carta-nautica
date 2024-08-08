import { Injectable } from '@angular/core';
import { ActionSheetController, ActionSheetOptions } from '@ionic/angular';
import { SettingsService } from '../services/settings.service';

@Injectable({
  providedIn: 'root',
})
export class ActionSheetWrapper {
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private settings: SettingsService,
  ) {}

  public async create(opts: ActionSheetOptions) {
    const animations = await this.settings.getAnimations();

    return this.actionSheetCtrl.create({
      ...opts,
      animated: animations,
    });
  }

  public dismiss(data?: any, role?: string, id?: string) {
    return this.actionSheetCtrl.dismiss(data, role, id);
  }

  public getTop() {
    return this.actionSheetCtrl.getTop();
  }
}
