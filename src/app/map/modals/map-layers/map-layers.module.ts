import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapLayersPageRoutingModule } from './map-layers-routing.module';

import { MapLayersPage } from './map-layers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapLayersPageRoutingModule
  ],
  declarations: [MapLayersPage]
})
export class MapLayersPageModule {}
