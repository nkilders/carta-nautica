import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  map: L.Map;

  constructor() { }

  ionViewDidEnter() {
    this.map = new L.Map('map', {
      zoomControl: false
    }).setView([0.0, 0.0], 0);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    L.control.scale().addTo(this.map);
  }

}
