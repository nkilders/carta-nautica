import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackEditPageRoutingModule } from './track-edit-routing.module';

import { TrackEditPage } from './track-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackEditPageRoutingModule
  ],
  declarations: [TrackEditPage]
})
export class TrackEditPageModule {}
