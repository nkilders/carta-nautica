import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackEditPage } from './track-edit.page';

const routes: Routes = [
  {
    path: '',
    component: TrackEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackEditPageRoutingModule {}
