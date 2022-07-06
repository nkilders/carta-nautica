import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapCreatePage } from './map-create.page';

const routes: Routes = [
  {
    path: '',
    component: MapCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapCreatePageRoutingModule {}
