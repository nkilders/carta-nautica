import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

// Ionic-Native
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { Geolocation, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';

// Modals
import { ModalController } from '@ionic/angular';
import { LayerSourcesPage } from './modals/layer-sources/layer-sources.page';
import { MapLayersPage } from './modals/map-layers/map-layers.page';
import { SettingsPage } from './modals/settings/settings.page';
import { TracksPage } from './modals/tracks/tracks.page';

// Services
import { OfflineMapService } from '../services/offline-map.service';

// Other stuff
import { FabToggler } from '../stuff/fab-toggler';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  private heading: any = 0;
  private speed: any = 0;

  private map: L.Map;

  private pos: GeolocationPosition;
  private boat: any;

  private fabLocateToggler: FabToggler;
  private fabTrackToggler: FabToggler;

  constructor(
    private insomnia: Insomnia,
    private geolocation: Geolocation,
    private offlineMapService: OfflineMapService,
    public modalCtrl: ModalController
  ) { }

  ionViewDidEnter() {
    // Keep display awake
    this.insomnia.keepAwake();

    // Create map
    this.map = new L.Map('map', {
      zoomControl: false
    }).setView([0.0, 0.0], 0);

    // Add a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    // Add scale
    L.control.scale().addTo(this.map);

    // Setup FAB Locate Toggler
    this.fabLocateToggler = new FabToggler('fabLocate', 'dark', 'primary');
    this.map.on('dragstart', () => {
      if(this.fabLocateToggler.active) {
        this.fabLocateToggler.toggle();
      }
    });

    // Setup FAB Track Toggler
    this.fabTrackToggler = new FabToggler('fabTrack', 'dark', 'danger');

    // Setup geolocation-stuff
    this.geoSetup();
  }

  /**
   * Sets up all geolocation stuff needed
   */
  private geoSetup() {
    let watch = this.geolocation.watchPosition({
      enableHighAccuracy: true,
      maximumAge: 5000
    });
    
    watch.subscribe(
      pos => this.geoHandle(this, pos),
      err => console.error(err)
    );
  }

  /**
   * Callback method for handling geolocation updates
   * 
   * @param t Reference to the MapPage object
   * @param pos New geoposition
   */
  private geoHandle(t: this, pos: any) {
    if(pos.coords === undefined) return;
      
    t.pos = pos;

    // Update heading and speed variables for the UI
    this.heading = pos.coords.heading === null ? 0 : Math.floor(pos.coords.heading);
    this.speed = pos.coords.speed === null ? 0 : pos.coords.speed.toFixed(2);

    let p = [pos.coords.latitude, pos.coords.longitude];

    if(this.boat === undefined) {
      // Create boat marker and add it to the map
      this.boat = L.marker(
        p, {
          icon: L.icon({
            iconUrl: '/assets/icon/boat.png',

            iconSize: [64, 64],
            iconAnchor: [32, 32]
          })
        }
      ).addTo(this.map);

      // Fly to current position on the map
      this.map.flyTo(p, 15, {duration: 3});
    } else {
      // Update boat position
      this.boat.setLatLng(
        L.latLng(pos.coords.latitude, pos.coords.longitude)
      );

      // If fabLocate is enabled, fly to the current geoposition on the map
      if(this.fabLocateToggler.active) {
        this.map.flyTo(p, 15, 1);
      }
    }
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
          duration:0.5
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

    // just for testing purposes, will be removed later
    this.showModal();
  }

  async showModal() {
    let modal = await this.modalCtrl.create({
      component: LayerSourcesPage
    });

    modal.present();
  }
}