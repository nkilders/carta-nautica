import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  public heading: any = 0;
  public speed: any = 0;

  private map: L.Map;

  private pos: GeolocationPosition;
  private boat: any;

  constructor() { }

  ionViewDidEnter() {
    this.map = new L.Map('map', {
      zoomControl: false
    }).setView([0.0, 0.0], 0);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    L.control.scale().addTo(this.map);

    this.geoSetup();
  }

  private geoSetup() {
    if(navigator.geolocation) {
      navigator.geolocation.watchPosition(
        pos => this.geoHandle(this, pos),
        err => console.error(err),
        {
          enableHighAccuracy: true,
          maximumAge: 5000
        }
      );
    }
  }

  private geoHandle(t: this, pos: GeolocationPosition) {
    t.pos = pos;

    this.heading = pos.coords.heading === null ? 0 : Math.floor(pos.coords.heading);
    this.speed = pos.coords.speed === null ? 0 : pos.coords.speed.toFixed(2);

    if(this.boat === undefined) {
      let p = [pos.coords.latitude, pos.coords.longitude];

      this.boat = L.marker(
        p, {
          icon: L.icon({
            iconUrl: '/assets/icon/boat.png',

            iconSize: [64, 64],
            iconAnchor: [32, 32]
          })
        }
      ).addTo(this.map);
      this.map.flyTo(p, 15, {duration: 3});
    } else {
      this.boat.setLatLng(
        L.latLng(pos.coords.latitude, pos.coords.longitude)
      );
    }
  }
}