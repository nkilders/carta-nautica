import { Component, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { ZoomSlider } from 'ol/control';
import { Subscription } from 'rxjs';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { Geoposition, PositionError } from '@ionic-native/geolocation/ngx'
import { useGeographic } from 'ol/proj';

useGeographic();
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  private map: Map;
  private geoSub: Subscription;

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
            attributions: ''
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

  geoHandle(pos: Geoposition | PositionError) {
    if(!this.geolocation.isPosition(pos)) return;

    console.log(pos);
    
    this.map.getView().animate({
      center: [
        pos.coords.longitude,
        pos.coords.latitude,
      ],
      zoom: 15,
      duration: 1000,
    })
  }
}