import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'layers',
    loadComponent: () =>
      import('./pages/layers/layers.page').then((m) => m.LayersPage),
  },
  {
    path: 'layers-create',
    loadComponent: () =>
      import('./pages/layers-create/layers-create.page').then(
        (m) => m.LayersCreatePage,
      ),
  },
  {
    path: 'layers-edit',
    loadComponent: () =>
      import('./pages/layers-edit/layers-edit.page').then(
        (m) => m.LayersEditPage,
      ),
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/map/map.page').then((m) => m.MapPage),
  },
  {
    path: 'markers',
    loadComponent: () =>
      import('./pages/markers/markers.page').then((m) => m.MarkersPage),
  },
  {
    path: 'markers-create',
    loadComponent: () =>
      import('./pages/markers-create/markers-create.page').then(
        (m) => m.MarkersCreatePage,
      ),
  },
  {
    path: 'markers-edit',
    loadComponent: () =>
      import('./pages/markers-edit/markers-edit.page').then(
        (m) => m.MarkersEditPage,
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'signs',
    loadComponent: () =>
      import('./pages/signs/signs.page').then((m) => m.SignsPage),
  },
  {
    path: 'tracks',
    loadComponent: () =>
      import('./pages/tracks/tracks.page').then((m) => m.TracksPage),
  },
  {
    path: 'tracks-edit',
    loadComponent: () =>
      import('./pages/tracks-edit/tracks-edit.page').then(
        (m) => m.TracksEditPage,
      ),
  },
  {
    path: 'tracks-view',
    loadComponent: () =>
      import('./pages/tracks-view/tracks-view.page').then(
        (m) => m.TracksViewPage,
      ),
  },
  {
    path: 'weather',
    loadComponent: () =>
      import('./pages/weather/weather.page').then((m) => m.WeatherPage),
  },
  {
    path: '**',
    redirectTo: 'map',
  },
];
