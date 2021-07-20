import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapManagerPageRoutingModule } from './map-manager-routing.module';

import { MapManagerPage } from './map-manager.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapManagerPageRoutingModule
  ],
  declarations: [MapManagerPage]
})
export class MapManagerPageModule {}
