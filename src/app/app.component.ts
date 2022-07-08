import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapLayersPage } from './pages/map-layers/map-layers.page';
import { SettingsPage } from './pages/settings/settings.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  public modals = [
    { title: 'Map Layers', page: MapLayersPage, icon: 'layers' },
    { title: 'Settings', page: SettingsPage, icon: 'settings' },
  ];

  constructor(
    private modalCtrl: ModalController,
  ) {}

  async showModal(page: any) {
    const modal = await this.modalCtrl.create({
      component: page,
      animated: true,
    });

    await modal.present();
  }
}
