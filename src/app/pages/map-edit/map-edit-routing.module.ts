import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapEditPage } from './map-edit.page';

const routes: Routes = [
  {
    path: '',
    component: MapEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapEditPageRoutingModule {}
