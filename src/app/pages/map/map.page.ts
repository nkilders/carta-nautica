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
import { createBoatLayerManager } from '../../layer-managers/boat-layer-manager';
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
import { createSeamarkLayerManager } from 'src/app/layer-managers/seamark-layer-manager';
import { AlertWrapper } from 'src/app/wrappers/alert-wrapper';
import { createCourseLineLayerManager } from 'src/app/layer-managers/course-line-layer-manager';
import { RoutePlanningControl } from 'src/app/utils/route-planning-control';

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

  private lastToolbarTitleUpdate: number;
  private fabFollowToggler?: FabToggler;
  private fabRecordTrackToggler?: FabToggler;

  constructor(
    // Controllers
    private readonly actionSheetController: ActionSheetWrapper,
    private readonly alertController: AlertWrapper,
    private readonly modalController: ModalWrapper,
    // Services
    private readonly geolocation: GeolocationService,
    private readonly layersService: LayersService,
    private readonly mapService: MapService,
    private readonly markersService: MarkersService,
    private readonly routePlanningService: RoutePlanningService,
    private readonly settingsService: SettingsService,
    private readonly trackRecorderService: TrackRecorderService,
    private readonly translateService: TranslateService,
    private readonly unitService: UnitService,
    // Others
    private readonly ref: ChangeDetectorRef,
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

  ngOnInit() {
    this.initMap();
    this.initMapLayerManagers();
    this.initPositionWatch();
    this.initSettingsListeners();
    this.initFabs();
  }

  public fabRecordTrack() {
    const active = this.fabRecordTrackToggler?.toggle();

    if (active) {
      this.trackRecorderService.startRecording();
    } else {
      this.trackRecorderService.stopRecording();
    }
  }

  public fabFollow() {
    const active = this.fabFollowToggler?.toggle();

    if (active) {
      this.flyToCurrentPosition();
    }
  }

  private initMap() {
    this.mapService.setTarget('map');

    this.mapService.getMap().addControl(
      new ScaleLine({
        bar: false,
        units: 'metric',
      }),
    );

    this.mapService
      .getMap()
      .addControl(
        new SpeedHeadingControl(
          this.geolocation,
          this.settingsService,
          this.unitService,
        ),
      );

    this.mapService
      .getMap()
      .addControl(
        new RoutePlanningControl(
          this.geolocation,
          this.routePlanningService,
          this.settingsService,
          this.unitService,
        ),
      );

    this.mapService.on(
      'longClick',
      async (longitude, latitude, completeLongClick) =>
        this.onLongClick(longitude, latitude, completeLongClick),
    );
  }

  private initMapLayerManagers() {
    createLayerManager(
      this.layersService,
      this.mapService,
      this.settingsService,
    );
    createBoatLayerManager(this.geolocation, this.mapService);
    createCourseLineLayerManager(
      this.geolocation,
      this.mapService,
      this.settingsService,
    );
    createMarkersLayerManager(
      this.actionSheetController,
      this.alertController,
      this.modalController,
      this.mapService,
      this.markersService,
      this.translateService,
    );
    createTrackLayerManager(this.mapService, this.trackRecorderService);
    createPositionAccuracyLayerManager(
      this.geolocation,
      this.mapService,
      this.settingsService,
    );
    createRoutePlanningLayerManager(
      this.actionSheetController,
      this.geolocation,
      this.mapService,
      this.routePlanningService,
      this.translateService,
    );
    createSeamarkLayerManager(this.modalController, this.mapService);
  }

  private async onLongClick(
    longitude: number,
    latitude: number,
    completeLongClick: () => void,
  ) {
    const actionSheet = await this.actionSheetController.create({
      header: this.translateService.instant('longClick.title'),
      buttons: [
        {
          text: await this.buildLongClickDistanceText(longitude, latitude),
          disabled: true,
          icon: 'information-circle',
        },
        {
          text: this.translateService.instant('longClick.createMarker'),
          icon: 'location',
          handler: async () => {
            await this.openCreateMarkerPopUp(longitude, latitude);
          },
        },
        this.longClickRoutePlanningButton(longitude, latitude),
        {
          text: this.translateService.instant('longClick.weather'),
          icon: 'sunny',
          handler: async () => {
            await this.openWeatherPopUp(longitude, latitude);
          },
        },
        {
          text: this.translateService.instant('general.cancel'),
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

    const distance = await this.unitService.convertDistance(
      distanceKm,
      DistanceUnit.KILOMETERS,
    );

    const distanceText = distance.value.toFixed(2);
    const unitText = distance.unitText;

    return this.translateService.instant('longClick.distance', {
      distance: distanceText,
      unit: unitText,
    });
  }

  private longClickRoutePlanningButton(longitude: number, latitude: number) {
    if (this.routePlanningService.get().length === 0) {
      return {
        text: this.translateService.instant('longClick.setDestination'),
        icon: 'flag',
        handler: async () =>
          this.routePlanningService.addStop({ latitude, longitude }, 0),
      };
    } else {
      return {
        text: this.translateService.instant('longClick.addStop'),
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
        text: this.translateService.instant('routeStop.addStopBefore1'),
        handler: () =>
          this.routePlanningService.addStop({ latitude, longitude }, 0),
      },
    ];

    this.routePlanningService.get().forEach((stop, i) => {
      buttons.push({
        text: this.translateService.instant('routeStop.addStopAfter', {
          sequence: i + 1,
        }),
        handler: () =>
          this.routePlanningService.addStop({ latitude, longitude }, i + 1),
      });
    });

    const actionSheet = await this.actionSheetController.create({
      header: this.translateService.instant('routeStop.addStopTitle'),
      buttons,
    });

    await actionSheet.present();
  }

  private async openCreateMarkerPopUp(longitude: number, latitude: number) {
    const modal = await this.modalController.create({
      component: MarkersCreatePage,
      componentProps: {
        longitude,
        latitude,
      },
    });

    await modal.present();
  }

  private async openWeatherPopUp(longitude: number, latitude: number) {
    const modal = await this.modalController.create({
      component: WeatherPage,
      componentProps: {
        longitude,
        latitude,
      },
    });

    await modal.present();
  }

  private async initPositionWatch() {
    const { timestamp, coords } =
      await this.geolocation.loadLastKnownPosition();
    if (timestamp !== -1) {
      this.mapService.focus(coords.longitude, coords.latitude, 15);
    }

    await this.geolocation.watchPosition((pos) => {
      this.onPositionChanged(pos);
    });
  }

  private initSettingsListeners() {
    this.settingsService.on('mapPreloading', (preload) => {
      const layers = this.mapService.getMap().getAllLayers();

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
    this.updateToolbarTitle();

    if (this.fabFollowToggler?.isActive()) {
      this.flyToCurrentPosition();
    }
  }

  private flyToCurrentPosition() {
    const { longitude, latitude } = this.geolocation.getPosition().coords;

    this.mapService.flyTo(longitude, latitude, 15, 1_000);
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

  private formatToolbarTitle(result: NativeGeocoderResult | undefined) {
    if (!result) {
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

    this.mapService.getMap().on('pointerdrag', () => {
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
