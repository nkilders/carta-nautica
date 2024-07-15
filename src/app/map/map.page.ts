import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Map, View } from 'ol';
import { useGeographic } from 'ol/proj';
import { ScaleLine } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MapPage implements OnInit {
  private map?: Map;

  constructor() { 
  }
  
  ngOnInit() {
    this.initMap();
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
  }

}
