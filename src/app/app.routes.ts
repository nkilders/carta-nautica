import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'map',
    loadComponent: () => import('./pages/map/map.page').then((m) => m.MapPage),
  },
  {
    path: '**',
    redirectTo: 'map',
  },
];
