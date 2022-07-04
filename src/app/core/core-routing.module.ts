import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CorePage } from './core.page';

const routes: Routes = [
  {
    path: '',
    component: CorePage,
  },
  {
    path: 'settings',
    loadChildren: () => import('./modals/settings/settings.module').then(m => m.SettingsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CorePageRoutingModule {}
