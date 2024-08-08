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
import { AlertController, ModalController } from '@ionic/angular';
import { SettingsPage } from '../settings/settings.page';
import { UnitService } from 'src/app/services/unit.service';
import { SpeedUnit, TemperatureUnit } from 'src/app/models/settings';

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
  private longitude: number = 13.404653508454397;
  @Input({ required: true })
  private latitude: number = 52.51907918910106;

  weatherData: WeatherDay[] = [];

  constructor(
    private settings: SettingsService,
    private unit: UnitService,
    private translate: TranslateService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
  ) {
    addIcons({ thermometer, water, rainy, paperPlane });
  }

  async ngOnInit() {
    await this.loadWeatherData();
  }

  private async loadWeatherData() {
    const apiKeyValid = await this.isApiKeyValid();

    if (!apiKeyValid) {
      await this.showInvalidApiKeyPopUp();
      return;
    }

    const weather = await this.fetchWeatherForecast();
    this.weatherData = await this.prepareWeatherData(weather);
  }

  private async showInvalidApiKeyPopUp() {
    const headerText = this.translate.instant('weather.invalidApiKey.header');
    const messageText = this.translate.instant('weather.invalidApiKey.message');
    const closeText = this.translate.instant('weather.invalidApiKey.close');
    const settingsText = this.translate.instant(
      'weather.invalidApiKey.settings',
    );

    const alert = await this.alertCtrl.create({
      header: headerText,
      animated: true,
      message: messageText,
      buttons: [
        {
          text: closeText,
          handler: async () => {
            await this.modalCtrl.dismiss();
          },
          role: 'cancel',
        },
        {
          text: settingsText,
          handler: async () => {
            const modal = await this.modalCtrl.create({
              component: SettingsPage,
              animated: true,
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
          dayName = this.translate.instant('weather.day.today');
        } else if ((new Date().getDay() + 1) % 7 === day) {
          dayName = this.translate.instant('weather.day.tomorrow');
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
        const temp = await this.unit.convertTemperature(
          forecast.main.temp,
          TemperatureUnit.CELSIUS,
        );
        const unit = this.unit.temperatureUnitToText(temp.unit);

        temperature = `${temp.value.toFixed(0)} ${unit}`;
      } else {
        const tempMin = await this.unit.convertTemperature(
          forecast.main.temp_min,
          TemperatureUnit.CELSIUS,
        );
        const tempMax = await this.unit.convertTemperature(
          forecast.main.temp_max,
          TemperatureUnit.CELSIUS,
        );
        const unit = this.unit.temperatureUnitToText(tempMin.unit);

        temperature = `${tempMin.value.toFixed(0)} ${unit} - ${tempMax.value.toFixed(0)} ${unit}`;
      }

      const wind = await this.unit.convertSpeed(
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
        wind: `${wind.value.toFixed(0)} ${this.unit.speedUnitToText(wind.unit)}`,
        iconUrl: `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`,
      });

      weatherDays.set(day, weatherDay);
    }

    return [...weatherDays.values()];
  }

  private async fetchWeatherForecast() {
    const apiKey = await this.settings.getOpenWeatherMapApiKey();

    const params = new URLSearchParams({
      lat: this.latitude.toString(),
      lon: this.longitude.toString(),
      appid: apiKey,
      units: 'metric',
      lang: this.translate.getDefaultLang(),
    }).toString();

    const res = await fetch(`${FORECAST_API_URL}?${params}`, {
      method: 'GET',
    });

    const response = await res.json();

    return response as WeatherResponse;
  }

  private async isApiKeyValid() {
    const key = await this.settings.getOpenWeatherMapApiKey();

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

    return this.translate.instant(key);
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
