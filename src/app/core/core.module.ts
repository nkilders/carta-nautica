import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CorePageRoutingModule } from './core-routing.module';

import { CorePage } from './core.page';

import { MapComponent } from './components/map/map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorePageRoutingModule
  ],
  declarations: [
    CorePage,
    MapComponent,
  ],
})
export class CorePageModule {}
