import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonItem,
  IonIcon,
  IonThumbnail,
  IonNote,
  IonCol,
  IonLabel,
  IonChip,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'src/app/services/settings.service';
import { WeatherResponse } from 'src/app/models/weather';
import { addIcons } from 'ionicons';
import { paperPlane, rainy, thermometer, water } from 'ionicons/icons';
import { HttpStatusCode } from '@angular/common/http';
import { SettingsPage } from '../settings/settings.page';
import { UnitService } from 'src/app/services/unit.service';
import { SpeedUnit, TemperatureUnit } from 'src/app/models/settings';
import { ModalWrapper } from 'src/app/wrappers/modal-wrapper';
import { AlertWrapper } from 'src/app/wrappers/alert-wrapper';
import { LoadingWrapper } from 'src/app/wrappers/loading-wrapper';

const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
  standalone: true,
  imports: [
    IonChip,
    IonLabel,
    IonCol,
    IonNote,
    IonIcon,
    IonItem,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonCardHeader,
    IonCard,
    IonList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TranslateModule,
    IonThumbnail,
  ],
})
export class WeatherPage implements OnInit {
  @Input({ required: true })
  private readonly longitude: number = 13.404653508454397;
  @Input({ required: true })
  private readonly latitude: number = 52.51907918910106;

  weatherData: WeatherDay[] = [];

  constructor(
    // Controllers
    private readonly alertController: AlertWrapper,
    private readonly loadingController: LoadingWrapper,
    private readonly modalController: ModalWrapper,
    // Services
    private readonly settingsService: SettingsService,
    private readonly translateService: TranslateService,
    private readonly unitService: UnitService,
  ) {
    addIcons({ thermometer, water, rainy, paperPlane });
  }

  ngOnInit() {
    this.loadWeatherData();
  }

  private async loadWeatherData() {
    await this.showLoadingIndicator();

    const apiKeyValid = await this.isApiKeyValid();

    if (!apiKeyValid) {
      await this.hideLoadingIndicator();
      await this.showInvalidApiKeyPopUp();
      return;
    }

    const weather = await this.fetchWeatherForecast();
    this.weatherData = await this.prepareWeatherData(weather);
    await this.hideLoadingIndicator();
  }

  private async showLoadingIndicator() {
    const messageText = this.translateService.instant('weather.loading');

    const load = await this.loadingController.create({
      message: messageText,
    });

    await load.present();
  }

  private async hideLoadingIndicator() {
    await this.loadingController.dismiss();
  }

  private async showInvalidApiKeyPopUp() {
    const headerText = this.translateService.instant(
      'weather.invalidApiKey.header',
    );
    const messageText = this.translateService.instant(
      'weather.invalidApiKey.message',
    );
    const closeText = this.translateService.instant(
      'weather.invalidApiKey.close',
    );
    const settingsText = this.translateService.instant(
      'weather.invalidApiKey.settings',
    );

    const alert = await this.alertController.create({
      header: headerText,
      message: messageText,
      buttons: [
        {
          text: closeText,
          handler: async () => {
            await this.modalController.dismiss();
          },
          role: 'cancel',
        },
        {
          text: settingsText,
          handler: async () => {
            const modal = await this.modalController.create({
              component: SettingsPage,
            });

            modal.onWillDismiss().then(async () => {
              await alert.dismiss();
              await this.loadWeatherData();
            });

            await modal.present();
          },
        },
      ],
    });

    await alert.present();
  }

  private async prepareWeatherData(weather: WeatherResponse) {
    const weatherDays = new Map<number, WeatherDay>();

    for (const forecast of weather.list) {
      const date = new Date(forecast.dt * 1000);
      const day = date.getDay();

      let weatherDay = weatherDays.get(day);
      if (!weatherDay) {
        let dayName = '';

        if (new Date().getDay() === day) {
          dayName = this.translateService.instant('weather.day.today');
        } else if ((new Date().getDay() + 1) % 7 === day) {
          dayName = this.translateService.instant('weather.day.tomorrow');
        } else {
          dayName = this.translateDayByIndex(day);
        }

        const dayOfMonth = date.getDate().toString().padStart(2, '0');
        const month = date.getMonth().toString().padStart(2, '0');
        const year = date.getFullYear();

        weatherDay = {
          dayName,
          date: `${dayOfMonth}.${month}.${year}`,
          hours: [],
        };
      }

      let temperature = '';
      if (forecast.main.temp_min === forecast.main.temp_max) {
        const temp = await this.unitService.convertTemperature(
          forecast.main.temp,
          TemperatureUnit.CELSIUS,
        );

        temperature = `${temp.value.toFixed(0)} ${temp.unitText}`;
      } else {
        const tempMin = await this.unitService.convertTemperature(
          forecast.main.temp_min,
          TemperatureUnit.CELSIUS,
        );
        const tempMax = await this.unitService.convertTemperature(
          forecast.main.temp_max,
          TemperatureUnit.CELSIUS,
        );

        temperature = `${tempMin.value.toFixed(0)} ${tempMin.unitText} - ${tempMax.value.toFixed(0)} ${tempMin.unitText}`;
      }

      const wind = await this.unitService.convertSpeed(
        forecast.wind.speed,
        SpeedUnit.METERS_PER_SECOND,
      );

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes} Uhr`;

      weatherDay.hours.push({
        time,
        temperature,
        rainProbability: `${(forecast.pop * 100).toFixed(0)} %`,
        wind: `${wind.value.toFixed(0)} ${wind.unitText}`,
        iconUrl: `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`,
      });

      weatherDays.set(day, weatherDay);
    }

    return [...weatherDays.values()];
  }

  private async fetchWeatherForecast() {
    const apiKey = await this.settingsService.getOpenWeatherMapApiKey();

    const params = new URLSearchParams({
      lat: this.latitude.toString(),
      lon: this.longitude.toString(),
      appid: apiKey,
      units: 'metric',
      lang: this.translateService.getDefaultLang(),
    }).toString();

    const res = await fetch(`${FORECAST_API_URL}?${params}`, {
      method: 'GET',
    });

    const response = await res.json();

    return response as WeatherResponse;
  }

  private async isApiKeyValid() {
    const key = await this.settingsService.getOpenWeatherMapApiKey();

    if (key === '') {
      return false;
    }

    const params = new URLSearchParams({
      appid: key,
    }).toString();

    const response = await fetch(`${FORECAST_API_URL}?${params}`);

    return response.status !== HttpStatusCode.Unauthorized;
  }

  /**
   * @param dayIndex 0=Sunday; 6=Saturday
   */
  private translateDayByIndex(dayIndex: number) {
    const key =
      'weather.day.' +
      [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ][dayIndex];

    return this.translateService.instant(key);
  }
}

interface WeatherDay {
  dayName: string;
  date: string;
  hours: WeatherHour[];
}

interface WeatherHour {
  time: string;
  temperature: string;
  rainProbability: string;
  wind: string;
  iconUrl: string;
}
