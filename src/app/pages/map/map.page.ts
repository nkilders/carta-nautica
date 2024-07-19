import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { Map, View } from 'ol';
import { useGeographic } from 'ol/proj';
import { Control, ScaleLine } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';
import { GeolocationService } from '../../services/geolocation.service';
import { Position } from '@capacitor/geolocation';
import { BoatMarker } from '../../boat';
import { countryCodeEmoji } from 'country-code-emoji';
import { NativeGeocoderResult } from '@awesome-cordova-plugins/native-geocoder';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton]
})
export class MapPage implements OnInit {
  public toolbarTitle = 'Carta Nautica';
  public speed = '';
  public heading = '';

  private map?: Map;
  private posWatchId?: string;
  private position?: Position;
  private boat?: BoatMarker;
  private receivedInitialPosition: boolean;
  private lastToolbarTitleUpdate: number;

  constructor(
    private geolocation: GeolocationService,
    private ref: ChangeDetectorRef,
  ) {
    this.receivedInitialPosition = false;
    this.lastToolbarTitleUpdate = 0;
  }
  
  ngOnInit() {
    this.initMap();
    this.initPositionWatch();
  }
  
  public changeSpeedUnit() {
    // TODO: implement when app supports different speed units
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

    this.map.addControl(new Control({
      element: document.getElementById('speedHeadingControl')!
    }));

    this.boat = new BoatMarker(this.map);
  }

  private async initPositionWatch() {
    this.posWatchId = await this.geolocation.watchPosition((pos, err) => {
      this.onPositionChanged(pos, err);
    });
  }

  private onPositionChanged(position: Position | null, err: unknown) {
    if(!position) {
      return;
    }

    this.position = position;

    if(!this.receivedInitialPosition) {
      this.receivedInitialPosition = true;

      this.onInitialPositionReceived(position);
    }

    this.boat?.updatePosition(position);
    this.updateSpeedHeadingControl();
    this.updateToolbarTitle();
  }
  
  private onInitialPositionReceived(position: Position) {
    this.flyToCurrentPosition();
  }

  private flyToCurrentPosition() {
    if(!this.position) {
      return;
    }

    const {longitude, latitude} = this.position.coords;

    this.flyTo(longitude, latitude, 15, 1_000);
  }

  private flyTo(longitude: number, latitude: number, zoom: number, durationMs: number) {
    this.map?.getView().animate({
      center: [ longitude, latitude ],
      zoom,
      duration: durationMs,
    });
  }

  private updateSpeedHeadingControl() {
    if(!this.position) {
      return;
    }

    const heading = this.position.coords.heading ?? 0;
    this.heading = `${heading.toFixed(0)}°`;

    const speed = this.position.coords.speed ?? 0;
    this.speed = `${speed.toFixed(2)} m/s`;
  }

  private async updateToolbarTitle() {
    if(Date.now() - this.lastToolbarTitleUpdate < 60_000) {
      return;
    }

    if(this.position == null) {
      return;
    }

    this.lastToolbarTitleUpdate = Date.now();

    const { longitude, latitude } = this.position.coords;
    const result = await this.geolocation.reverseGeocode(longitude, latitude);
    
    this.toolbarTitle = this.formatToolbarTitle(result);

    // The toolbar's text doesn't refresh correctly until one
    // manually interacts with the UI. Maybe there is a better
    // way to fix this, but unfortunately I don't know it atm.
    this.ref.markForCheck();
  }

  private formatToolbarTitle(result : NativeGeocoderResult | null ) {
    if(result == null) {
      return '🌍 Carta Nautica';
    }

    let emoji = '🌍';
    let text = 'Carta Nautica';

    if(result.countryCode) {
      emoji = countryCodeEmoji(result.countryCode);
    }

    if(result.locality && result.subLocality) {
      text = `${result.locality}, ${result.subLocality}`;
    } else if(result.locality) {
      text = result.locality;
    } else if(result.administrativeArea && result.subAdministrativeArea) {
      text = `${result.administrativeArea}, ${result.subAdministrativeArea}`;
    } else if(result.administrativeArea) {
      text = result.administrativeArea;
    } else if(result.countryName) {
      text = result.countryName;
    }

    return `${emoji} ${text}`;
  }
}
