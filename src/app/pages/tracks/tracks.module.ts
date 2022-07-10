import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TracksPageRoutingModule } from './tracks-routing.module';

import { TracksPage } from './tracks.page';
import { TrackLengthPipe } from 'src/app/pipes/track-length.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TracksPageRoutingModule,
  ],
  declarations: [
    TracksPage,
    TrackLengthPipe,
  ],
})
export class TracksPageModule {}
