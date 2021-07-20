import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LayerManagerPageRoutingModule } from './layer-manager-routing.module';

import { LayerManagerPage } from './layer-manager.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LayerManagerPageRoutingModule
  ],
  declarations: [LayerManagerPage]
})
export class LayerManagerPageModule {}
