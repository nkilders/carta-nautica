import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Map, View } from 'ol';
import { useGeographic } from 'ol/proj';
import { ScaleLine } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';
import { GeolocationService } from '../services/geolocation.service';
import { Position } from '@capacitor/geolocation';
import { BoatMarker } from '../boat';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MapPage implements OnInit {
  private map?: Map;
  private posWatchId?: string;
  private position?: Position;
  private boat?: BoatMarker;
  private receivedInitialPosition: boolean;

  constructor(
    private geolocation: GeolocationService
  ) {
    this.receivedInitialPosition = false;
  }
  
  ngOnInit() {
    this.initMap();
    this.initPositionWatch();
  }
  
  private initMap() {
    useGeographic();

    this.map = new Map({
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
      
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://a.tile.openstreetmap.de/{z}/{x}/{y}.png', // OpenStreetMap DE
            // url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', // OpenStreetMap
          }),
          preload: Infinity,
        }),
        new TileLayer({
          source: new XYZ({
            url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', // OpenSeaMap
          }),
          preload: Infinity,
        }),
      ],
    });

    this.map.addControl(new ScaleLine({
      bar: false,
      units: 'metric',
    }));

    this.boat = new BoatMarker(this.map);
  }

  private async initPositionWatch() {
    this.posWatchId = await this.geolocation.watchPosition((pos, err) => {
      this.onPositionChanged(pos, err);
    });
  }

  private onPositionChanged(position: Position | null, err: unknown) {
    if(!position) {
      return;
    }

    this.position = position;

    if(!this.receivedInitialPosition) {
      this.receivedInitialPosition = true;

      this.onInitialPositionReceived(position);
    }

    this.boat?.updatePosition(position);
  }
  
  private onInitialPositionReceived(position: Position) {
    this.flyToCurrentPosition();
  }

  private flyToCurrentPosition() {
    if(!this.position) {
      return;
    }

    const {longitude, latitude} = this.position.coords;

    this.flyTo(longitude, latitude, 15, 1_000);
  }

  private flyTo(longitude: number, latitude: number, zoom: number, durationMs: number) {
    this.map?.getView().animate({
      center: [ longitude, latitude ],
      zoom,
      duration: durationMs,
    });
  }
}
