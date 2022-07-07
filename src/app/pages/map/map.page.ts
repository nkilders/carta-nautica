import { Component, OnInit } from '@angular/core';
import { Feature, Map as OLMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { ScaleLine } from 'ol/control';
import { Subscription } from 'rxjs';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { Geoposition, PositionError, Coordinates } from '@ionic-native/geolocation/ngx'
import { useGeographic } from 'ol/proj';
import { Geometry, Point } from 'ol/geom';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { DragRotateAndZoom, defaults as defaultInteractions } from 'ol/interaction';
import { FabToggler } from 'src/app/models/fab-toggler.model';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { MapService } from 'src/app/services/map.service';
import XYZ from 'ol/source/XYZ';

useGeographic();
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  private map: OLMap;

  private boatLayer: VectorLayer<VectorSource<Geometry>>;
  private boat: Feature<Point>;

  private tileLayers: Map<string, TileLayer<XYZ>>;

  private geoSub: Subscription;
  private position: Coordinates;

  private fabFollowToggler: FabToggler;

  constructor(
    private insomnia: Insomnia,
    private geolocation: GeolocationService,
    private mapSrv: MapService,
  ) { }

  ngOnInit() {
    this.insomnia.keepAwake();

    this.mapSetup();
    this.geoSetup();
    this.fabSetup();
  }

  ionViewWillLeave() {
    this.insomnia.allowSleepAgain();

    // Unsubscribe from geolocation service
    if(this.geoSub) this.geoSub.unsubscribe();
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

    // Sometimes the map doesn't render until the window gets resized
    // This seems to improve the problem, but doesn't fix it
    setTimeout(() => this.map.updateSize(), 100);

    this.tileLayersSetup();
  }

  async tileLayersSetup() {
    this.tileLayers = new Map();

    const maps = await this.mapSrv.getAllMaps();

    maps.forEach(map => {
      const layer = new TileLayer({
        source: new XYZ({
          url: map.src,
        }),
        zIndex: -map.position,
        visible: map.enabled,
      });

      this.map.addLayer(layer);
      this.tileLayers.set(map.uuid, layer);
    });

    this.mapSrv.on('create', (uuid, map) => {
      const layer = new TileLayer({
        source: new XYZ({
          url: map.src,
        }),
        zIndex: -map.position,
        visible: map.enabled,
      });

      this.map.addLayer(layer);
      this.tileLayers.set(uuid, layer);
    });

    this.mapSrv.on('update', (uuid, oldMap, newMap) => {
      const layer = this.tileLayers.get(uuid);
      if(!layer) return;

      layer.setVisible(newMap.enabled);
      layer.setZIndex(-newMap.position);
    });

    this.mapSrv.on('delete', (uuid, map) => {
      const layer = this.tileLayers.get(uuid);
      if(!layer) return;

      this.map.removeLayer(layer);
      this.tileLayers.delete(uuid);
    });
  }

  async geoSetup() {
    const observable = await this.geolocation.watchPosition();
    this.geoSub = observable.subscribe(pos => {
      this.geoHandle(pos)
    });
  }

  /**
   * Handles the response from the geolocation service
   */
  geoHandle(pos: Geoposition | PositionError) {
    // Cancel if pos is an error
    if(!this.geolocation.isPosition(pos)) return;

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
    this.boatLayer = new VectorLayer({
      source: new VectorSource({
        features: [
          this.boat,
        ],
      }),
      zIndex: 1,
    });

    // Add layer to map
    this.map.addLayer(this.boatLayer);
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
  }

  fabFollow() {
    const active = this.fabFollowToggler.toggle();
    
    if(active) {
      this.flyTo(this.position.longitude, this.position.latitude, 15, 500);
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