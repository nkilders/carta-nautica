import { Component } from '@angular/core';

// Modals
import { ModalController } from '@ionic/angular';
import { LayerSourcesPage } from './map/modals/layer-sources/layer-sources.page';
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
    let comp = (name == 'map-layers' && MapLayersPage)
            || (name == 'tracks' && TracksPage)
            || (name == 'layer-sources' && LayerSourcesPage)
            || (name == 'settings' && SettingsPage);

    let modal = await this.modalCtrl.create({
      component: comp
    });

    modal.present();
  }
}