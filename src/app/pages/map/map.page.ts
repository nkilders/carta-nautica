import { Component, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { defaults as defaultControls, ZoomSlider } from 'ol/control';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  private map: Map;

  constructor() { }

  ngOnInit() {
    this.mapSetup();
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

    // this.map.getView().animate({
    //   center: this.rab,
    //   duration: 3000,
    //   zoom: 15
    // })
  }
}