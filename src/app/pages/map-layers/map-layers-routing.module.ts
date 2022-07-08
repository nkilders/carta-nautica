import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapLayersPage } from './map-layers.page';

const routes: Routes = [
  {
    path: '',
    component: MapLayersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapLayersPageRoutingModule {}
