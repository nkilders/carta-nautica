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
import { ScaleLine } from 'ol/control';
import { GeolocationService } from '../../services/geolocation.service';
import { Position } from '@capacitor/geolocation';
import { BoatMarker } from '../../utils/boat';
import { countryCodeEmoji } from 'country-code-emoji';
import { NativeGeocoderResult } from '@awesome-cordova-plugins/native-geocoder';
import { SettingsService } from 'src/app/services/settings.service';
import BaseTileLayer from 'ol/layer/BaseTile';
import { UnitService } from 'src/app/services/unit.service';
import { DistanceUnit } from 'src/app/models/settings';
import { LayersService } from 'src/app/services/layers.service';
import { createLayerManager } from 'src/app/layer-managers/layer-manager';
import { FabToggler } from 'src/app/utils/fab-toggler';
import { addIcons } from 'ionicons';
import {
  closeCircle,
  flag,
  informationCircle,
  locate,
  location,
  recording,
  sunny,
} from 'ionicons/icons';
import { TranslateService } from '@ngx-translate/core';
import { geoDistance } from 'src/app/utils/coordinates';
import { MarkersCreatePage } from '../markers-create/markers-create.page';
import { createMarkersLayerManager } from 'src/app/layer-managers/markers-layer-manager';
import { MarkersService } from 'src/app/services/markers.service';
import { SpeedHeadingControl } from 'src/app/utils/speed-heading-control';
import { APP_NAME } from 'src/app/app';
import { TrackRecorderService } from 'src/app/services/track-recorder.service';
import { createTrackLayerManager } from 'src/app/layer-managers/track-layer-manager';
import { WeatherPage } from '../weather/weather.page';
import { ModalWrapper } from 'src/app/wrappers/modal-wrapper';
import { ActionSheetWrapper } from 'src/app/wrappers/action-sheet-wrapper';
import { MapService } from 'src/app/services/map.service';
import { createPositionAccuracyLayerManager } from 'src/app/layer-managers/position-accuracy-layer-manager';
import { createRoutePlanningLayerManager } from 'src/app/layer-managers/route-planning-layer-manager';
import { RoutePlanningService } from 'src/app/services/route-planning.service';

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

  private boat?: BoatMarker;
  private lastToolbarTitleUpdate: number;
  private fabFollowToggler?: FabToggler;
  private fabRecordTrackToggler?: FabToggler;

  constructor(
    private mapSrv: MapService,
    private geolocation: GeolocationService,
    private settings: SettingsService,
    private unit: UnitService,
    private layers: LayersService,
    private markersSrv: MarkersService,
    private trackRecord: TrackRecorderService,
    private routePlanningSrv: RoutePlanningService,
    private ref: ChangeDetectorRef,
    private actionSheetCtrl: ActionSheetWrapper,
    private modalCtrl: ModalWrapper,
    private translate: TranslateService,
  ) {
    this.lastToolbarTitleUpdate = 0;

    addIcons({
      locate,
      recording,
      location,
      closeCircle,
      informationCircle,
      sunny,
      flag,
    });
  }

  async ngOnInit() {
    await this.initMap();
    this.initMapLayerManagers();
    await this.initPositionWatch();
    this.initSettingsListeners();
    this.initFabs();
  }

  public fabRecordTrack() {
    const active = this.fabRecordTrackToggler?.toggle();

    if (active) {
      this.trackRecord.startRecording();
    } else {
      this.trackRecord.stopRecording();
    }
  }

  public fabFollow() {
    const active = this.fabFollowToggler?.toggle();

    if (active) {
      this.flyToCurrentPosition();
    }
  }

  private async initMap() {
    this.mapSrv.setTarget('map');

    this.mapSrv.getMap().addControl(
      new ScaleLine({
        bar: false,
        units: 'metric',
      }),
    );

    this.mapSrv
      .getMap()
      .addControl(
        new SpeedHeadingControl(this.settings, this.geolocation, this.unit),
      );

    this.boat = new BoatMarker(this.mapSrv);

    this.mapSrv.on(
      'longClick',
      async (longitude, latitude, completeLongClick) =>
        this.onLongClick(longitude, latitude, completeLongClick),
    );
  }

  private initMapLayerManagers() {
    createLayerManager(this.mapSrv, this.layers, this.settings);
    createMarkersLayerManager(
      this.mapSrv,
      this.markersSrv,
      this.actionSheetCtrl,
      this.translate,
    );
    createTrackLayerManager(this.mapSrv, this.trackRecord);
    createPositionAccuracyLayerManager(
      this.mapSrv,
      this.settings,
      this.geolocation,
    );
    createRoutePlanningLayerManager(
      this.mapSrv,
      this.routePlanningSrv,
      this.geolocation,
      this.actionSheetCtrl,
      this.translate,
    );
  }

  private async onLongClick(
    longitude: number,
    latitude: number,
    completeLongClick: () => void,
  ) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translate.instant('longClick.title'),
      buttons: [
        {
          text: await this.buildLongClickDistanceText(longitude, latitude),
          disabled: true,
          icon: 'information-circle',
        },
        {
          text: this.translate.instant('longClick.createMarker'),
          icon: 'location',
          handler: async () => {
            await this.openCreateMarkerPopUp(longitude, latitude);
          },
        },
        this.longClickRoutePlanningButton(longitude, latitude),
        {
          text: this.translate.instant('longClick.weather'),
          icon: 'sunny',
          handler: async () => {
            await this.openWeatherPopUp(longitude, latitude);
          },
        },
        {
          text: this.translate.instant('general.cancel'),
          role: 'cancel',
          icon: 'close-circle',
        },
      ],
    });

    actionSheet.onDidDismiss().then(() => completeLongClick());

    await actionSheet.present();
  }

  private async buildLongClickDistanceText(
    clickLongitude: number,
    clickLatitude: number,
  ) {
    const { longitude, latitude } = this.geolocation.getPosition().coords;

    const distanceKm = geoDistance(
      clickLatitude,
      clickLongitude,
      latitude,
      longitude,
    );

    const distance = await this.unit.convertDistance(
      distanceKm,
      DistanceUnit.KILOMETERS,
    );

    const distanceText = distance.value.toFixed(2);
    const unitText = distance.unitText;

    return this.translate.instant('longClick.distance', {
      distance: distanceText,
      unit: unitText,
    });
  }

  private longClickRoutePlanningButton(longitude: number, latitude: number) {
    if (this.routePlanningSrv.get().length === 0) {
      return {
        text: this.translate.instant('longClick.setDestination'),
        icon: 'flag',
        handler: async () =>
          this.routePlanningSrv.addStop({ latitude, longitude }, 0),
      };
    } else {
      return {
        text: this.translate.instant('longClick.addStop'),
        icon: 'flag',
        handler: async () =>
          await this.showRoutePlanningAddStopActionSheet(longitude, latitude),
      };
    }
  }

  private async showRoutePlanningAddStopActionSheet(
    longitude: number,
    latitude: number,
  ) {
    const buttons = [
      {
        text: this.translate.instant('routeStop.addStopBefore1'),
        handler: async () =>
          this.routePlanningSrv.addStop({ latitude, longitude }, 0),
      },
    ];

    this.routePlanningSrv.get().forEach((stop, i) => {
      buttons.push({
        text: this.translate.instant('routeStop.addStopAfter', {
          sequence: i + 1,
        }),
        handler: async () =>
          this.routePlanningSrv.addStop({ latitude, longitude }, i + 1),
      });
    });

    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translate.instant('routeStop.addStopTitle'),
      buttons,
    });

    await actionSheet.present();
  }

  private async openCreateMarkerPopUp(longitude: number, latitude: number) {
    const modal = await this.modalCtrl.create({
      component: MarkersCreatePage,
      componentProps: {
        longitude,
        latitude,
      },
    });

    await modal.present();
  }

  private async openWeatherPopUp(longitude: number, latitude: number) {
    const modal = await this.modalCtrl.create({
      component: WeatherPage,
      componentProps: {
        longitude,
        latitude,
      },
    });

    await modal.present();
  }

  private async initPositionWatch() {
    await this.focusLastKnownPosition();
    await this.geolocation.watchPosition((pos) => {
      this.onPositionChanged(pos);
    });
  }

  private async focusLastKnownPosition() {
    const pos = await this.geolocation.loadLastKnownPosition();
    if (pos.timestamp !== -1) {
      this.mapSrv.focus(pos.coords.longitude, pos.coords.latitude, 15);
    }
    this.boat?.updatePosition(pos);
  }

  private initSettingsListeners() {
    this.settings.on('mapPreloading', (preload) => {
      const layers = this.mapSrv.getMap().getAllLayers();

      if (!layers) {
        return;
      }

      for (const layer of layers) {
        if (layer instanceof BaseTileLayer) {
          layer.setPreload(preload);
        }
      }
    });
  }

  private onPositionChanged(position: Position) {
    this.boat?.updatePosition(position);
    this.updateToolbarTitle();

    if (this.fabFollowToggler?.isActive()) {
      this.flyToCurrentPosition();
    }
  }

  private flyToCurrentPosition() {
    const { longitude, latitude } = this.geolocation.getPosition().coords;

    this.mapSrv.flyTo(longitude, latitude, 15, 1_000);
  }

  private async updateToolbarTitle() {
    if (Date.now() - this.lastToolbarTitleUpdate < 60_000) {
      return;
    }

    this.lastToolbarTitleUpdate = Date.now();

    const { longitude, latitude } = this.geolocation.getPosition().coords;
    const result = await this.geolocation.reverseGeocode(longitude, latitude);

    this.toolbarTitle = this.formatToolbarTitle(result);

    // The toolbar's text doesn't refresh correctly until one
    // manually interacts with the UI. Maybe there is a better
    // way to fix this, but unfortunately I don't know it atm.
    this.ref.markForCheck();
  }

  private formatToolbarTitle(result: NativeGeocoderResult | null) {
    if (result == null) {
      return `🌍 ${APP_NAME}`;
    }

    let emoji = '🌍';
    let text = APP_NAME;

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
    this.fabFollowToggler.toggle();

    this.mapSrv.getMap().on('pointerdrag', () => {
      if (this.fabFollowToggler?.isActive()) {
        this.fabFollowToggler.toggle();
      }
    });

    this.fabRecordTrackToggler = new FabToggler(
      'fabRecordTrack',
      'dark',
      'danger',
    );
  }
}
