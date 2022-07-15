import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'compass',
    loadChildren: () => import('./pages/compass/compass.module').then( m => m.CompassPageModule)
  },
  {
    path: 'map-layers',
    loadChildren: () => import('./pages/map-layers/map-layers.module').then(m => m.MapLayersPageModule),
  },
  {
    path: 'tracks',
    loadChildren: () => import('./pages/tracks/tracks.module').then( m => m.TracksPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule),
  },
  {
    path: 'map-create',
    loadChildren: () => import('./pages/map-create/map-create.module').then( m => m.MapCreatePageModule),
  },
  {
    path: 'map-edit',
    loadChildren: () => import('./pages/map-edit/map-edit.module').then( m => m.MapEditPageModule),
  },
  {
    path: 'track-edit',
    loadChildren: () => import('./pages/track-edit/track-edit.module').then( m => m.TrackEditPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
