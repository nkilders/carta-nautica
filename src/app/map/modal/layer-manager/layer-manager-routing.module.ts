import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayerManagerPage } from './layer-manager.page';

const routes: Routes = [
  {
    path: '',
    component: LayerManagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayerManagerPageRoutingModule {}
