import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { settingsOutline, settingsSharp, layersOutline, layersSharp, analyticsOutline, analyticsSharp } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet, TranslateModule],
})
export class AppComponent {
  public appPages = [
    { title: 'sidebar.layers', icon: 'layers' },
    { title: 'sidebar.tracks', icon: 'analytics' },
    { title: 'sidebar.settings', icon: 'settings' },
  ];
  constructor() {
    addIcons({ 
      settingsOutline, settingsSharp,
      layersOutline, layersSharp,
      analyticsOutline, analyticsSharp,
    });
  }
}
