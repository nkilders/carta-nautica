import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonNote,
  IonCol,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Track, TrackWithoutId } from 'src/app/models/tracks';
import { addIcons } from 'ionicons';
import { ellipsisVertical, trash } from 'ionicons/icons';
import { TracksService } from 'src/app/services/tracks.service';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { geoDistance } from 'src/app/coordinates';
import { UnitService } from 'src/app/services/unit.service';
import { DistanceUnit, SpeedUnit } from 'src/app/models/settings';

interface DisplayTrack extends Track {
  duration: string;
  length: string;
  averageSpeed: string;
}

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.page.html',
  styleUrls: ['./tracks.page.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonNote,
    IonButton,
    IonButtons,
    IonLabel,
    IonItem,
    IonList,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
})
export class TracksPage implements OnInit {
  tracks: DisplayTrack[] = [];

  constructor(
    private tracksSrv: TracksService,
    private translate: TranslateService,
    private unit: UnitService,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
  ) {
    addIcons({
      ellipsisVertical,
      trash,
    });
  }

  async ngOnInit() {
    await this.loadTracks();
  }

  async showTrackOptions(track: Track) {
    const deleteText = this.translate.instant('tracks.delete');

    const actionSheet = await this.actionSheetCtrl.create({
      header: track.name,
      buttons: [
        {
          text: deleteText,
          icon: 'trash',
          handler: () => this.confirmDeleteTrack(track),
        },
      ],
      animated: true,
    });

    await actionSheet.present();
  }

  private async confirmDeleteTrack(track: Track) {
    const deleteTitleText = this.translate.instant(
      'tracks.deleteConfirmHeader',
    );
    const cancelText = this.translate.instant('tracks.deleteCancel');
    const deleteText = this.translate.instant('tracks.deleteConfirm');

    const alert = await this.alertCtrl.create({
      header: deleteTitleText,
      subHeader: track.name,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
        },
        {
          text: deleteText,
          handler: async () => {
            await this.tracksSrv.delete(track.id);
            await alert.dismiss();
            await this.loadTracks();
          },
        },
      ],
      animated: true,
    });

    await alert.present();
  }

  private async loadTracks() {
    const tracks = await this.tracksSrv.getAll();

    this.tracks = [];

    for (const track of tracks) {
      const lengthKm = this.lengthKm(track);
      const durationMin = this.durationMinutes(track);
      const avgSpeedKmh = lengthKm / (durationMin / 60) || 0;

      const length = await this.unit.convertDistance(
        lengthKm,
        DistanceUnit.KILOMETERS,
      );
      const avgSpeed = await this.unit.convertSpeed(
        avgSpeedKmh,
        SpeedUnit.KILOMETERS_PER_HOUR,
      );

      this.tracks.push({
        ...track,
        length: this.translate.instant('tracks.length', {
          length: length.value.toFixed(1),
          unit: length.unitText,
        }),
        duration: this.translate.instant('tracks.duration', {
          duration: this.formatDuration(durationMin),
        }),
        averageSpeed: this.translate.instant('tracks.avgSpeed', {
          speed: avgSpeed.value.toFixed(1),
          unit: avgSpeed.unitText,
        }),
      });
    }
  }

  private formatDuration(durationMin: number) {
    const hours = Math.floor(durationMin / 60);
    const minutes = durationMin - hours * 60;

    if (hours === 0) {
      return `${minutes} min`;
    } else {
      return `${hours} h ${minutes} min`;
    }
  }

  private lengthKm(track: TrackWithoutId) {
    const { points } = track;

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

  private durationMinutes(track: TrackWithoutId) {
    const { points } = track;

    if (points.length <= 1) {
      return 0;
    }

    const startMs = points[0].timestamp;
    const endMs = points[points.length - 1].timestamp;

    const durationMs = endMs - startMs;

    return durationMs / 1000 / 60;
  }
}
