import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { Map as OLMap, View } from 'ol';
import { useGeographic } from 'ol/proj';
import { Control, ScaleLine } from 'ol/control';
import { GeolocationService } from '../../services/geolocation.service';
import { Position } from '@capacitor/geolocation';
import { BoatMarker } from '../../boat';
import { countryCodeEmoji } from 'country-code-emoji';
import { NativeGeocoderResult } from '@awesome-cordova-plugins/native-geocoder';
import { SettingsService } from 'src/app/services/settings.service';
import BaseTileLayer from 'ol/layer/BaseTile';
import { UnitService } from 'src/app/services/unit.service';
import { SpeedUnit } from 'src/app/models/settings';
import { LayersService } from 'src/app/services/layers.service';
import { LayerManager } from 'src/app/layer-manager';
import { FabToggler } from 'src/app/fab-toggler';
import { addIcons } from 'ionicons';
import { locate } from 'ionicons/icons';
import { LongClick } from 'src/app/longclick';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonFabButton,
    IonFab,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
  ],
})
export class MapPage implements OnInit {
  public toolbarTitle = 'Carta Nautica';
  public speed = '';
  public heading = '';

  private map?: OLMap;
  private posWatchId?: string;
  private position?: Position;
  private boat?: BoatMarker;
  private receivedInitialPosition: boolean;
  private lastToolbarTitleUpdate: number;
  private fabFollowToggler?: FabToggler;

  constructor(
    private geolocation: GeolocationService,
    private settings: SettingsService,
    private unit: UnitService,
    private layers: LayersService,
    private ref: ChangeDetectorRef,
    private actionSheetCtrl: ActionSheetController,
  ) {
    this.receivedInitialPosition = false;
    this.lastToolbarTitleUpdate = 0;

    addIcons({
      locate,
    });
  }

  ngOnInit() {
    this.initMap();
    this.initPositionWatch();
    this.initSettingsListeners();
    this.initFabs();
  }

  public async changeSpeedUnit() {
    const oldSpeedUnit = await this.settings.getSpeedUnit();
    const numberOfSpeedUnits = Object.keys(SpeedUnit).length / 2;

    const newSpeedUnit = (oldSpeedUnit + 1) % numberOfSpeedUnits;

    await this.settings.setSpeedUnit(newSpeedUnit);
  }

  public fabFollow() {
    const active = this.fabFollowToggler?.toggle();

    if (active) {
      this.flyToCurrentPosition();
    }
  }

  private async initMap() {
    useGeographic();

    this.map = new OLMap({
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    this.map.addControl(
      new ScaleLine({
        bar: false,
        units: 'metric',
      }),
    );

    this.map.addControl(
      new Control({
        element: document.getElementById('speedHeadingControl')!,
      }),
    );

    this.boat = new BoatMarker(this.map);

    new LayerManager(this.map!, this.layers, this.settings);
    new LongClick(this.map, async (coords) => {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Aktion an dieser Stelle',
        buttons: [
          {
            text: 'Abbrechen',
            role: 'cancel',
          },
        ],
      });

      await actionSheet.present();
    });
  }

  private async initPositionWatch() {
    this.posWatchId = await this.geolocation.watchPosition((pos, err) => {
      this.onPositionChanged(pos, err);
    });
  }

  private initSettingsListeners() {
    this.settings.on('mapPreloading', (newValue) => {
      const layers = this.map?.getAllLayers();

      if (!layers) {
        return;
      }

      const preload = newValue ? Infinity : 0;

      for (const layer of layers) {
        if (layer instanceof BaseTileLayer) {
          layer.setPreload(preload);
        }
      }
    });

    this.settings.on('speedUnit', (newValue) => {
      this.updateSpeedHeadingControl();
    });
  }

  private onPositionChanged(position: Position | null, err: unknown) {
    if (!position) {
      return;
    }

    this.position = position;

    if (!this.receivedInitialPosition) {
      this.receivedInitialPosition = true;

      this.onInitialPositionReceived(position);
    }

    this.boat?.updatePosition(position);
    this.updateSpeedHeadingControl();
    this.updateToolbarTitle();

    if (this.fabFollowToggler?.isActive()) {
      this.flyToCurrentPosition();
    }
  }

  private onInitialPositionReceived(position: Position) {
    this.flyToCurrentPosition();
  }

  private flyToCurrentPosition() {
    if (!this.position) {
      return;
    }

    const { longitude, latitude } = this.position.coords;

    this.flyTo(longitude, latitude, 15, 1_000);
  }

  private flyTo(
    longitude: number,
    latitude: number,
    zoom: number,
    durationMs: number,
  ) {
    this.map?.getView().animate({
      center: [longitude, latitude],
      zoom,
      duration: durationMs,
    });
  }

  private async updateSpeedHeadingControl() {
    if (!this.position) {
      return;
    }

    const heading = this.position.coords.heading ?? 0;
    this.heading = `${heading.toFixed(0)}°`;

    const speedMps = this.position.coords.speed ?? 0;
    const speed = await this.unit.convertSpeed(
      speedMps,
      SpeedUnit.METERS_PER_SECOND,
    );
    const unit = this.unit.speedUnitToText(speed.unit);
    this.speed = `${speed.value.toFixed(2)} ${unit}`;
  }

  private async updateToolbarTitle() {
    if (Date.now() - this.lastToolbarTitleUpdate < 60_000) {
      return;
    }

    if (this.position == null) {
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

  private formatToolbarTitle(result: NativeGeocoderResult | null) {
    if (result == null) {
      return '🌍 Carta Nautica';
    }

    let emoji = '🌍';
    let text = 'Carta Nautica';

    if (result.countryCode) {
      emoji = countryCodeEmoji(result.countryCode);
    }

    if (result.locality && result.subLocality) {
      text = `${result.locality}, ${result.subLocality}`;
    } else if (result.locality) {
      text = result.locality;
    } else if (result.administrativeArea && result.subAdministrativeArea) {
      text = `${result.administrativeArea}, ${result.subAdministrativeArea}`;
    } else if (result.administrativeArea) {
      text = result.administrativeArea;
    } else if (result.countryName) {
      text = result.countryName;
    }

    return `${emoji} ${text}`;
  }

  private initFabs() {
    this.fabFollowToggler = new FabToggler('fabFollow', 'dark', 'primary');

    this.map?.on('pointerdrag', () => {
      if (this.fabFollowToggler?.isActive()) {
        this.fabFollowToggler.toggle();
      }
    });
  }
}
