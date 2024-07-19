import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { settingsOutline, settingsSharp, layersOutline, layersSharp, analyticsOutline, analyticsSharp } from 'ionicons/icons';
import { ModalController } from '@ionic/angular';
import { LayersPage } from './pages/layers/layers.page';
import { TracksPage } from './pages/tracks/tracks.page';
import { SettingsPage } from './pages/settings/settings.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet, TranslateModule],
  providers: [ModalController],
})
export class AppComponent {
  public appPages = [
    { title: 'sidebar.layers', icon: 'layers', page: LayersPage },
    { title: 'sidebar.tracks', icon: 'analytics', page: TracksPage },
    { title: 'sidebar.settings', icon: 'settings', page: SettingsPage },
  ];
  
  constructor(
    private readonly modalCtrl: ModalController,
  ) {
    addIcons({ 
      settingsOutline, settingsSharp,
      layersOutline, layersSharp,
      analyticsOutline, analyticsSharp,
    });
  }

  public async openModal(page: any) {
    const modal = await this.modalCtrl.create({
      component: page,
      animated: true,
    });

    await modal.present();
  }
}
