import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { SettingsPage } from './modals/settings/settings.page';

@Component({
  selector: 'app-core',
  templateUrl: './core.page.html',
  styleUrls: ['./core.page.scss'],
})
export class CorePage {

  public modals = [
    { title: 'Settings', page: SettingsPage, icon: 'settings' },
  ];

  constructor(
    private modalCtrl: ModalController
  ) { }

  async showModal(page: any) {
    const modal = await this.modalCtrl.create({
      component: page,
      animated: true,
    });

    await modal.present();
  }
}
