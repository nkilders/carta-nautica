import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapEditPageRoutingModule } from './map-edit-routing.module';

import { MapEditPage } from './map-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapEditPageRoutingModule
  ],
  declarations: [MapEditPage]
})
export class MapEditPageModule {}
