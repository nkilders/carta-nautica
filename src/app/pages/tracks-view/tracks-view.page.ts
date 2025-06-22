import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonLabel,
  IonItem,
} from '@ionic/angular/standalone';
import { Track } from 'src/app/models/tracks';
import { Map as OLMap } from 'ol';
import { createLayerManager } from 'src/app/layer-managers/layer-manager';
import { LayersService } from 'src/app/services/layers.service';
import { SettingsService } from 'src/app/services/settings.service';
import { useGeographic } from 'ol/proj';
import { createTrackViewLayerManager } from 'src/app/layer-managers/track-view-layer-manager';
import { geoDistance } from 'src/app/utils/coordinates';
import { DistanceUnit, SpeedUnit } from 'src/app/models/settings';
import { UnitService } from 'src/app/services/unit.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EChartsCoreOption } from 'echarts/core';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
  selector: 'app-tracks-view',
  templateUrl: './tracks-view.page.html',
  styleUrls: ['./tracks-view.page.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    IonList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TranslateModule,
    NgxEchartsDirective,
  ],
})
export class TracksViewPage implements OnInit {
  @Input({ required: true })
  readonly track!: Track;

  trackDetails?: TrackDetails;

  private readonly map: OLMap;

  speedChartOptions: EChartsCoreOption = {};

  constructor(
    private readonly layers: LayersService,
    private readonly settings: SettingsService,
    private readonly translate: TranslateService,
    private readonly unit: UnitService,
  ) {
    this.map = new OLMap({});
    this.setSpeedChartData();
  }

  ngOnInit() {
    this.map.setTarget('tracks-view-map');

    useGeographic();

    createLayerManager(this.map, this.layers, this.settings);
    createTrackViewLayerManager(this.map, this.track);

    this.calculateTrackDetails();
  }

  private async calculateTrackDetails() {
    this.trackDetails = {
      startTime: await this.startTimeText(),
      endTime: await this.endTimeText(),
      duration: await this.durationText(),
      length: await this.lengthText(),
      averageSpeed: await this.averageSpeedText(),
      maxSpeed: await this.maximumSpeedText(),
    };

    const { timestamps, speedValues } = await this.calculateSpeedChartData();
    this.setSpeedChartData(timestamps, speedValues);
  }

  private async calculateSpeedChartData() {
    const { points } = this.track;

    const lang = await this.settings.getLanguage();

    const timestamps: string[] = [];
    const speedValues: number[] = [];

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      timestamps.push(new Date(p1.timestamp).toLocaleTimeString(lang));

      const distanceKm = geoDistance(
        p1.latitude,
        p1.longitude,
        p2.latitude,
        p2.longitude,
      );
      const timeHr = (p2.timestamp - p1.timestamp) / 1000 / 60 / 60;
      const speedKmh = distanceKm / timeHr;

      const speed = await this.unit.convertSpeed(
        speedKmh,
        SpeedUnit.KILOMETERS_PER_HOUR,
      );
      speedValues.push(Math.round(speed.value));
    }

    return { timestamps, speedValues };
  }

  private setSpeedChartData(timestamps: string[] = [], speeds: number[] = []) {
    this.speedChartOptions = {
      grid: {
        top: '10%',
        bottom: '15%',
        right: '1%',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timestamps,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          type: 'line',
          smooth: true,
          data: speeds,
          markArea: {
            itemStyle: {
              color: 'rgba(255, 173, 177, 0.4)',
            },
          },
        },
      ],
    };
  }

  private async startTimeText() {
    const lang = await this.settings.getLanguage();
    return new Date(this.track.points[0].timestamp).toLocaleString(lang);
  }

  private async endTimeText() {
    const lang = await this.settings.getLanguage();
    return new Date(this.track.points.slice(-1)[0].timestamp).toLocaleString(
      lang,
    );
  }

  private async lengthText() {
    const length = await this.unit.convertDistance(
      this.lengthKm(),
      DistanceUnit.KILOMETERS,
    );

    return this.translate.instant('tracksView.lengthValue', {
      length: length.value.toFixed(1),
      unit: length.unitText,
    });
  }

  private lengthKm() {
    const { points } = this.track;

    if (points.length <= 1) {
      return 0;
    }

    let lengthKm = 0;

    for (let i = 1; i < points.length; i++) {
      const p1 = points[i - 1];
      const p2 = points[i];

      lengthKm += geoDistance(
        p1.latitude,
        p1.longitude,
        p2.latitude,
        p2.longitude,
      );
    }

    return lengthKm;
  }

  private async durationText() {
    const durationMin = this.durationMinutes();

    const hours = Math.floor(durationMin / 60);
    const minutes = durationMin - hours * 60;
    const seconds = Math.round((durationMin - Math.floor(durationMin)) * 60);

    if (hours === 0) {
      return await this.translate.instant('tracksView.durationValueMinSec', {
        minutes: minutes.toFixed(0),
        seconds: seconds.toFixed(0),
      });
    } else {
      return await this.translate.instant('tracksView.durationValueHrMin', {
        hours: hours.toFixed(0),
        minutes: minutes.toFixed(0),
      });
    }
  }

  private durationMinutes() {
    const { points } = this.track;

    if (points.length <= 1) {
      return 0;
    }

    const startMs = points[0].timestamp;
    const endMs = points[points.length - 1].timestamp;

    const durationMs = endMs - startMs;

    return durationMs / 1000 / 60;
  }

  private async maximumSpeedText() {
    const maxSpeed = await this.unit.convertSpeed(
      this.maxSpeedKmh(),
      SpeedUnit.KILOMETERS_PER_HOUR,
    );

    return this.translate.instant('tracksView.maxSpeedValue', {
      speed: maxSpeed.value.toFixed(1),
      unit: maxSpeed.unitText,
    });
  }

  private maxSpeedKmh() {
    const { points } = this.track;

    let maxSpeed = 0;

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const distanceKm = geoDistance(
        p1.latitude,
        p1.longitude,
        p2.latitude,
        p2.longitude,
      );
      const timeHr = (p2.timestamp - p1.timestamp) / 1000 / 60 / 60;
      const speedKmh = distanceKm / timeHr;

      if (speedKmh > maxSpeed) {
        maxSpeed = speedKmh;
      }
    }

    return maxSpeed;
  }

  private async averageSpeedText() {
    const avgSpeed = await this.unit.convertSpeed(
      this.averageSpeedKmh(),
      SpeedUnit.KILOMETERS_PER_HOUR,
    );

    return this.translate.instant('tracksView.avgSpeedValue', {
      speed: avgSpeed.value.toFixed(1),
      unit: avgSpeed.unitText,
    });
  }

  private averageSpeedKmh() {
    const lengthKm = this.lengthKm();
    const durationMin = this.durationMinutes();
    return lengthKm / (durationMin / 60) || 0;
  }
}

interface TrackDetails {
  startTime: string;
  endTime: string;
  duration: string;
  length: string;
  averageSpeed: string;
  maxSpeed: string;
}
