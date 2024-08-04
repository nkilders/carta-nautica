import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonNote,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  settingsOutline,
  settingsSharp,
  layersOutline,
  layersSharp,
  analyticsOutline,
  analyticsSharp,
  trailSignOutline,
  trailSignSharp,
  locationSharp,
  locationOutline,
} from 'ionicons/icons';
import { ModalController } from '@ionic/angular';
import { LayersPage } from './pages/layers/layers.page';
import { TracksPage } from './pages/tracks/tracks.page';
import { SettingsPage } from './pages/settings/settings.page';
import { SettingsService } from './services/settings.service';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { SignsPage } from './pages/signs/signs.page';
import { MarkersPage } from './pages/markers/markers.page';
import { APP_NAME, APP_VERSION } from './app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet,
    TranslateModule,
  ],
  providers: [ModalController],
})
export class AppComponent {
  public appPages = [
    { title: 'sidebar.layers', icon: 'layers', page: LayersPage },
    { title: 'sidebar.tracks', icon: 'analytics', page: TracksPage },
    { title: 'sidebar.signs', icon: 'trail-sign', page: SignsPage },
    { title: 'sidebar.markers', icon: 'location', page: MarkersPage },
    { title: 'sidebar.settings', icon: 'settings', page: SettingsPage },
  ];
  readonly appName = APP_NAME;
  readonly appVersion = APP_VERSION;

  constructor(
    private readonly modalCtrl: ModalController,
    private settings: SettingsService,
    private translate: TranslateService,
  ) {
    this.settings.getLanguage().then((language) => {
      this.translate.setDefaultLang(language);
    });

    this.initKeepAwake();

    addIcons({
      settingsOutline,
      settingsSharp,
      layersOutline,
      layersSharp,
      locationOutline,
      locationSharp,
      analyticsOutline,
      analyticsSharp,
      trailSignOutline,
      trailSignSharp,
    });
  }

  public async openModal(page: any) {
    const modal = await this.modalCtrl.create({
      component: page,
      animated: true,
    });

    await modal.present();
  }

  private async initKeepAwake() {
    const keepAwake = await this.settings.getKeepAwake();

    if (keepAwake) {
      await KeepAwake.keepAwake();
    } else {
      await KeepAwake.allowSleep();
    }

    this.settings.on('keepAwake', async (newValue) => {
      if (newValue) {
        await KeepAwake.keepAwake();
      } else {
        await KeepAwake.allowSleep();
      }
    });
  }
}
