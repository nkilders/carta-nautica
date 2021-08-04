import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LayerSourcesPageRoutingModule } from './layer-sources-routing.module';

import { LayerSourcesPage } from './layer-sources.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LayerSourcesPageRoutingModule
  ],
  declarations: [LayerSourcesPage]
})
export class LayerSourcesPageModule {}
