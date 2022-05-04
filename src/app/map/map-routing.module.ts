import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapPage } from './map.page';

const routes: Routes = [
  {
    path: '',
    component: MapPage
  },
  {
    path: 'map-layers',
    loadChildren: () => import('./modals/map-layers/map-layers.module').then( m => m.MapLayersPageModule)
  },
  {
    path: 'tracks',
    loadChildren: () => import('./modals/tracks/tracks.module').then( m => m.TracksPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./modals/settings/settings.module').then( m => m.SettingsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapPageRoutingModule {}
