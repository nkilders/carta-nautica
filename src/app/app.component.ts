import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

// Modals
import { MapLayersPage } from './map/modals/map-layers/map-layers.page';
import { SettingsPage } from './map/modals/settings/settings.page';
import { TracksPage } from './map/modals/tracks/tracks.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(private modalCtrl: ModalController) {}

  async click(name) {
    const comp = (name == 'map-layers' && MapLayersPage)
            || (name == 'tracks' && TracksPage)
            || (name == 'settings' && SettingsPage);

    const modal = await this.modalCtrl.create({
      component: comp
    });

    modal.present();
  }
}