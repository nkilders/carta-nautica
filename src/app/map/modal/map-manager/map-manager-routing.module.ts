import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapManagerPage } from './map-manager.page';

const routes: Routes = [
  {
    path: '',
    component: MapManagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapManagerPageRoutingModule {}
