import { Injectable } from '@angular/core';
import { LoadingController, LoadingOptions } from '@ionic/angular';
import { SettingsService } from '../services/settings.service';

@Injectable({
  providedIn: 'root',
})
export class LoadingWrapper {
  constructor(
    private readonly loadingController: LoadingController,
    private readonly settingsService: SettingsService,
  ) {}

  public async create(opts: LoadingOptions) {
    const animations = await this.settingsService.getAnimations();

    return this.loadingController.create({
      ...opts,
      animated: animations,
    });
  }

  public dismiss(data?: any, role?: string, id?: string) {
    return this.loadingController.dismiss(data, role, id);
  }

  public getTop() {
    return this.loadingController.getTop();
  }
}
