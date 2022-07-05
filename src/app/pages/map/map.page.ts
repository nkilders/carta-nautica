import { Component, OnInit } from '@angular/core';
import { Feature, Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { ZoomSlider } from 'ol/control';
import { Subscription } from 'rxjs';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { Geoposition, PositionError, Coordinates } from '@ionic-native/geolocation/ngx'
import { useGeographic } from 'ol/proj';
import { Geometry, Point } from 'ol/geom';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

useGeographic();
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  private map: Map;

  private boatLayer: VectorLayer<VectorSource<Geometry>>;
  private boat: Feature<Point>;

  private geoSub: Subscription;
  private position: Coordinates;

  constructor(
    private geolocation: GeolocationService,
  ) { }

  ngOnInit() {
    this.mapSetup();
    this.geoSetup();
  }

  ionViewWillLeave() {
    if(this.geoSub) this.geoSub.unsubscribe();
  }

  mapSetup() {
    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM({
            attributions: '',
          }),
        }),
      ],
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    this.map.addControl(new ZoomSlider());

    setTimeout(() => this.map.updateSize(), 100);
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
    if(!this.geolocation.isPosition(pos)) return;

    const coords = this.position = pos.coords;

    if(!this.boat) {
      this.setupBoat(coords);

      this.map.getView().animate({
        center: [
          pos.coords.longitude,
          pos.coords.latitude,
        ],
        zoom: 15,
        duration: 1000,
      });
    }
    
    this.updateBoat(coords);
  }

  /**
   * Creates the boat marker and adds it to the map
   */
  setupBoat(coords: Coordinates) {
    this.boat = new Feature();

    this.updateBoat(coords);

    this.boatLayer = new VectorLayer({
      source: new VectorSource({
        features: [
          this.boat,
        ],
      })
    });

    this.map.addLayer(this.boatLayer);
  }

  /**
   * Updates the boat marker's position and rotation
   */
  updateBoat(coords: Coordinates) {
    this.boat.setGeometry(new Point([
      coords.longitude,
      coords.latitude,
    ]));

    this.boat.setStyle(new Style({
      image: new Icon({
        anchor: [0.5, 0.5],
        src: '/assets/icon/navigation.png',
        scale: 0.04,
        rotation: coords.heading / 57.29578,
      }),
    }));
  }
}