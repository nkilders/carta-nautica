import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Track } from 'src/app/models/tracks';
import { Map as OLMap } from 'ol';
import { createLayerManager } from 'src/app/layer-managers/layer-manager';
import { LayersService } from 'src/app/services/layers.service';
import { SettingsService } from 'src/app/services/settings.service';
import { useGeographic } from 'ol/proj';
import { createTrackViewLayerManager } from 'src/app/layer-managers/track-view-layer-manager';

@Component({
  selector: 'app-tracks-view',
  templateUrl: './tracks-view.page.html',
  styleUrls: ['./tracks-view.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class TracksViewPage implements OnInit {
  @Input({ required: true })
  readonly track!: Track;

  private readonly map: OLMap;

  constructor(
    private readonly layers: LayersService,
    private readonly settings: SettingsService,
  ) {
    this.map = new OLMap({});
  }

  ngOnInit() {
    this.map.setTarget('tracks-view-map');

    useGeographic();

    createLayerManager(this.map, this.layers, this.settings);
    createTrackViewLayerManager(this.map, this.track);
  }
}
