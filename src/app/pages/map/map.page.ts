import { Component, OnInit } from '@angular/core';
import { Geoposition, PositionError, Coordinates } from '@ionic-native/geolocation/ngx'
import { Subscription } from 'rxjs';
import { Insomnia } from '@ionic-native/insomnia/ngx';

import { Feature, Map as OLMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { ScaleLine } from 'ol/control';
import { useGeographic } from 'ol/proj';
import { LineString, Point } from 'ol/geom';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { DragRotateAndZoom, defaults as defaultInteractions } from 'ol/interaction';
import XYZ from 'ol/source/XYZ';
import Stroke from 'ol/style/Stroke';

import { FabToggler } from 'src/app/models/fab-toggler.model';
import { getCoordinatesForRendering } from 'src/app/models/track.model';
import { SpeedHeadingControl } from 'src/app/models/speed-heading-control.model';

import { MapService } from 'src/app/services/map.service';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { TrackRecorderService } from 'src/app/services/track-recorder.service';
import { UnitService } from 'src/app/services/unit.service';
import { SettingsService } from 'src/app/services/settings.service';

useGeographic();
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  private map: OLMap;

  private boat: Feature<Point>;

  private trackLayer: VectorLayer<VectorSource>;
  private track: Feature<LineString>;

  private tileLayers: Map<string, TileLayer<XYZ>>;

  private geoSub: Subscription;
  private position: Coordinates;

  private fabFollowToggler: FabToggler;
  private fabRecordToggler: FabToggler;

  constructor(
    private insomnia: Insomnia,
    private geolocationSrv: GeolocationService,
    private mapSrv: MapService,
    private settingsSrv: SettingsService,
    private trackRecordSrv: TrackRecorderService,
    private unitSrv: UnitService,
  ) { }

  ngOnInit() {
    this.insomniaSetup();
    this.mapSetup();
    this.geoSetup();
    this.fabSetup();
  }

  ionViewWillLeave() {
    this.insomnia.allowSleepAgain();

    // Unsubscribe from geolocation service
    if(this.geoSub) this.geoSub.unsubscribe();
  }

  async insomniaSetup() {
    const initKeepAwake = await this.settingsSrv.getKeepAwake();
    if(initKeepAwake) this.insomnia.keepAwake();

    this.settingsSrv.on('keepAwake', (keepAwake) => {
      if(keepAwake) {
        this.insomnia.keepAwake();
      } else {
        this.insomnia.allowSleepAgain();
      }
    });
  }

  mapSetup() {
    // Create map
    this.map = new OLMap({
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    // Update boat rotation after rotating the map
    // Not the best solution, should be revised at some point
    this.map.on('moveend', () => this.updateBoat(this.position));

    this.map.addControl(new ScaleLine({
      bar: false,
      units: 'metric',
    }));

    this.map.addControl(new SpeedHeadingControl(this.settingsSrv, this.geolocationSrv, this.unitSrv));

    // Sometimes the map doesn't render until the window gets resized
    // This seems to improve the problem, but doesn't fix it
    setInterval(() => this.map.updateSize(), 1000);

    this.tileLayersSetup();
    this.trackLayerSetup();
    this.settingsListenerSetup();
  }

  async tileLayersSetup() {
    this.tileLayers = new Map();

    const maps = await this.mapSrv.getAllMaps();
    const preload = await this.settingsSrv.getMapPreloading();

    maps.forEach((map) => {
      const layer = new TileLayer({
        source: new XYZ({
          url: map.src,
        }),
        zIndex: -map.position,
        visible: map.enabled,
        preload: preload ? Infinity : 0,
      });

      this.map.addLayer(layer);
      this.tileLayers.set(map.uuid, layer);
    });

    this.mapSrv.on('create', async (uuid, map) => {
      const preload = await this.settingsSrv.getMapPreloading();

      const layer = new TileLayer({
        source: new XYZ({
          url: map.src,
        }),
        zIndex: -map.position,
        visible: map.enabled,
        preload: preload ? Infinity : 0,
      });

      this.map.addLayer(layer);
      this.tileLayers.set(uuid, layer);
    });

    this.mapSrv.on('update', (uuid, map) => {
      const layer = this.tileLayers.get(uuid);
      if(!layer) return;

      layer.setVisible(map.enabled);
      layer.setZIndex(-map.position);
    });

    this.mapSrv.on('delete', (uuid, map) => {
      const layer = this.tileLayers.get(uuid);
      if(!layer) return;

      this.map.removeLayer(layer);
      this.tileLayers.delete(uuid);
    });
  }

  async trackLayerSetup() {
    this.track = new Feature({
      geometry: new LineString([]),
    });

    this.trackLayer = new VectorLayer({
      source: new VectorSource({
        features: [
          this.track,
        ],
      }),
      style: new Style({
        stroke: new Stroke({
          color: '#e74c3c',
          width: 4,
        }),
      }),
      visible: false,
      zIndex: 1,
    });

    this.map.addLayer(this.trackLayer);

    this.trackRecordSrv.on('newPoint', (track) => {
      console.log('new point');
      
      this.track.setGeometry(new LineString(getCoordinatesForRendering(track)));
    });
  }

  async settingsListenerSetup() {
    this.settingsSrv.on('mapPreloading', (state) => {
      for(const layer of this.tileLayers.values()) {
        layer.setPreload(state ? Infinity : 0);
      }
    });
  }

  async geoSetup() {
    const observable = await this.geolocationSrv.watchPosition();
    this.geoSub = observable.subscribe((pos) => {
      this.geoHandle(pos)
    });
  }

  /**
   * Handles the response from the geolocation service
   */
  geoHandle(pos: Geoposition | PositionError) {
    // Cancel if pos is an error
    if(!GeolocationService.isPosition(pos)) return;

    const coords = this.position = pos.coords;

    // Create boat marker and set map view if marker doesn't exist
    if(!this.boat) {
      this.setupBoat(coords);
      this.flyTo(coords.longitude, coords.latitude, 15, 1000);
    }
    
    // Update boat marker position and rotation
    this.updateBoat(coords);

    if(this.fabFollowToggler.active) {
      this.flyTo(coords.longitude, coords.latitude, 15, 1000);
    }
  }

  /**
   * Creates the boat marker and adds it to the map
   */
  setupBoat(coords: Coordinates) {
    // Create boat marker
    this.boat = new Feature();

    // Set marker position and rotation
    this.updateBoat(coords);

    // Create layer and add marker to it
    const boatLayer = new VectorLayer({
      source: new VectorSource({
        features: [
          this.boat,
        ],
      }),
      zIndex: 1,
    });

    // Add layer to map
    this.map.addLayer(boatLayer);
  }

  /**
   * Updates the boat marker's position and rotation
   */
  updateBoat(coords: Coordinates) {
    // Set position
    this.boat.setGeometry(new Point([
      coords.longitude,
      coords.latitude,
    ]));

    // Calculate rotation
    const rotation = (this.map.getView().getRotation() + (coords.heading / 57.29578)) % (2 * Math.PI);

    // Set rotation
    this.boat.setStyle(new Style({
      image: new Icon({
        anchor: [0.5, 0.5],
        src: '/assets/icon/navigation.png',
        scale: 0.04,
        rotation: rotation,
      }),
    }));
  }

  fabSetup() {
    this.fabFollowToggler = new FabToggler('fabFollow', 'dark', 'primary');
    this.map.on('pointerdrag', () => {
      if(this.fabFollowToggler.active) {
        this.fabFollowToggler.toggle();
      }
    });

    this.fabRecordToggler = new FabToggler('fabRecord', 'dark', 'danger');
  }

  fabFollow() {
    const active = this.fabFollowToggler.toggle();
    
    if(active) {
      this.flyTo(this.position.longitude, this.position.latitude, 15, 500);
    }
  }

  fabRecord() {
    const active = this.fabRecordToggler.toggle();

    if(active) {
      this.trackRecordSrv.startRecording();
      this.trackLayer.setVisible(true);
    } else {
      this.trackRecordSrv.stopRecording();
      this.trackLayer.setVisible(false);
    }
  }

  flyTo(long: number, lat: number, zoom: number, duration: number) {
    this.map.getView().animate({
      center: [ long, lat ],
      zoom: zoom,
      duration: duration,
    });
  }
}