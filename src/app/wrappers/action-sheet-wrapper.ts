import { Injectable } from '@angular/core';
import { ActionSheetController, ActionSheetOptions } from '@ionic/angular';
import { SettingsService } from '../services/settings.service';

@Injectable({
  providedIn: 'root',
})
export class ActionSheetWrapper {
  constructor(
    private readonly actionSheetController: ActionSheetController,
    private readonly settingsService: SettingsService,
  ) {}

  public async create(opts: ActionSheetOptions) {
    const animations = await this.settingsService.getAnimations();

    return this.actionSheetController.create({
      ...opts,
      animated: animations,
    });
  }

  public dismiss(data?: any, role?: string, id?: string) {
    return this.actionSheetController.dismiss(data, role, id);
  }

  public getTop() {
    return this.actionSheetController.getTop();
  }
}
