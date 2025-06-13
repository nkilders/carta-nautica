import { Injectable } from '@angular/core';
import { LoadingController, LoadingOptions } from '@ionic/angular';
import { SettingsService } from '../services/settings.service';

@Injectable({
  providedIn: 'root',
})
export class LoadingWrapper {
  constructor(
    private readonly loadingCtrl: LoadingController,
    private readonly settings: SettingsService,
  ) {}

  public async create(opts: LoadingOptions) {
    const animations = await this.settings.getAnimations();

    return this.loadingCtrl.create({
      ...opts,
      animated: animations,
    });
  }

  public dismiss(data?: any, role?: string, id?: string) {
    return this.loadingCtrl.dismiss(data, role, id);
  }

  public getTop() {
    return this.loadingCtrl.getTop();
  }
}
