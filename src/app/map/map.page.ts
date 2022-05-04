import { Component } from '@angular/core';
import * as L from 'leaflet';

// Ionic-Native
import { Insomnia } from '@ionic-native/insomnia/ngx';

// Services
import { GeoPositionService } from '../services/geo-position.service'
import { MapStorageService } from '../services/storage/map.service';

// Other stuff
import { FabToggler } from '../stuff/fab-toggler';
import { Map as MapObj } from '../stuff/map';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  private heading: any = 0;
  private speed: any = 0;

  private layers: Map<string, any>;

  private map: L.Map;

  private pos: GeolocationPosition;
  private boat: any;

  private fabLocateToggler: FabToggler;
  private fabTrackToggler: FabToggler;

  constructor(
    private insomnia: Insomnia,
    private mapService: MapStorageService,
    private geoService: GeoPositionService,
  ) { }

  ionViewDidEnter() {
    // Keep display awake
    this.insomnia.keepAwake();

    // Setup map
    this.mapSetup();

    // Setup FAB-Togglers
    this.fabSetup();

    // Setup geolocation-stuff
    this.geoSetup();
  }

  private mapSetup() {
    // Create map
    this.map = new L.Map('map', {
      zoomControl: false
    }).setView([0.0, 0.0], 0);

    // Add scale
    L.control.scale().addTo(this.map);

    this.mapService.getMaps().then(maps => {
      this.layers = new Map();

      maps.sort((m1, m2) => m2.position - m1.position);
      
      maps.forEach(map => {
        let tileLayer = L.tileLayer(map.url);
        this.layers.set(map.uuid, tileLayer);

        if(map.enabled) {
          tileLayer.addTo(this.map);
        }
      });

      this.mapService.registerUpdateListener(maps => this.onMapUpdate(this, maps));
    });
  }

  private fabSetup() {
    // Setup FAB Locate Toggler
    this.fabLocateToggler = new FabToggler('fabLocate', 'dark', 'primary');
    this.map.on('dragstart', () => {
      if(this.fabLocateToggler.active) {
        this.fabLocateToggler.toggle();
      }
    });

    // Setup FAB Track Toggler
    this.fabTrackToggler = new FabToggler('fabTrack', 'dark', 'danger');
  }

  /**
   * Sets up all geolocation stuff needed
   */
  private geoSetup() {
    this.geoService.watchPosition().subscribe(
      pos => this.geoHandle(this, pos),
      err => console.log(err)
    );
  }

  /**
   * Callback method for handling geolocation updates
   * 
   * @param t Reference to the MapPage object
   * @param pos New geoposition
   */
  private geoHandle(t: this, pos: any) {
    if(!pos.coords) return;
      
    t.pos = pos;

    // Update heading and speed variables for the UI
    this.heading = !pos.coords.heading ? 0 : Math.floor(pos.coords.heading);
    this.speed = !pos.coords.speed ? 0 : pos.coords.speed.toFixed(2);

    let p: L.LatLngTuple = [
      pos.coords.latitude,
      pos.coords.longitude
    ];

    if(!this.boat) {
      // Create boat marker and add it to the map
      this.boat = L.marker(p, {
        icon: L.icon({
          iconUrl: '/assets/icon/boat.png',
          iconSize: [64, 64],
          iconAnchor: [32, 32]
        })
      }).addTo(this.map);

      // Fly to current position on the map
      this.map.flyTo(p, 15, {
        duration: 3
      });
    } else {
      // Update boat position
      this.boat.setLatLng(
        L.latLng(pos.coords.latitude, pos.coords.longitude)
      );

      // If fabLocate is enabled, fly to the current geoposition on the map
      if(this.fabLocateToggler.active) {
        this.map.flyTo(p, 15, {
          duration: 1
        });
      }
    }
  }

  onMapUpdate(that: this, maps: MapObj[]) {
    that.layers.forEach(val => {
      val.remove();
    });
    that.layers.clear();

    maps.sort((a, b) => b.position - a.position).forEach(map => {
      let tileLayer = L.tileLayer(map.url);
      that.layers.set(map.uuid, tileLayer);

      if(map.enabled) {
        tileLayer.addTo(that.map);
      }
    });
  }

  /**
   * Click-Handler for FAB #fabLocate
   */
  fabLocate() {
    // Toggle the FAB
    let state = this.fabLocateToggler.toggle();
    
    // If the FAB is enabled, fly to the current geoposition on the map
    if(state) {
      this.map.flyTo(
        [
          this.pos.coords.latitude, 
          this.pos.coords.longitude
        ], 15, {
          duration: 0.5
        }
      );
    }
  }

  /**
   * Click-Handler for FAB #fabTrack
   */
  fabTrack() {
    // Toggle the FAB
    this.fabTrackToggler.toggle();

    // TODO: Track logic
  }
}