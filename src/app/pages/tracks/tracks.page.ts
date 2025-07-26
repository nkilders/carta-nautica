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
import { ellipsisVertical, pencil, trash } from 'ionicons/icons';
import { TracksService } from 'src/app/services/tracks.service';
import { geoDistance } from 'src/app/utils/coordinates';
import { UnitService } from 'src/app/services/unit.service';
import { DistanceUnit, SpeedUnit } from 'src/app/models/settings';
import { AlertWrapper } from 'src/app/wrappers/alert-wrapper';
import { ActionSheetWrapper } from 'src/app/wrappers/action-sheet-wrapper';
import { ModalWrapper } from 'src/app/wrappers/modal-wrapper';
import { TracksViewPage } from '../tracks-view/tracks-view.page';
import { TracksEditPage } from '../tracks-edit/tracks-edit.page';

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
    // Controllers
    private readonly actionSheetController: ActionSheetWrapper,
    private readonly alertController: AlertWrapper,
    private readonly modalController: ModalWrapper,
    // Services
    private readonly tracksService: TracksService,
    private readonly translateService: TranslateService,
    private readonly unitService: UnitService,
  ) {
    addIcons({
      ellipsisVertical,
      pencil,
      trash,
    });
  }

  ngOnInit() {
    this.loadTracks();
  }

  async showTrackDetails(track: Track) {
    const modal = await this.modalController.create({
      component: TracksViewPage,
      componentProps: {
        track,
      },
    });

    await modal.present();
  }

  async showTrackOptions(track: Track) {
    const editText = this.translateService.instant('general.edit');
    const deleteText = this.translateService.instant('general.delete');

    const actionSheet = await this.actionSheetController.create({
      header: track.name,
      buttons: [
        {
          text: editText,
          icon: 'pencil',
          handler: () => this.editTrack(track),
        },
        {
          text: deleteText,
          icon: 'trash',
          handler: () => this.confirmDeleteTrack(track),
        },
      ],
    });

    await actionSheet.present();
  }

  private async editTrack(track: Track) {
    const modal = await this.modalController.create({
      component: TracksEditPage,
      componentProps: {
        track,
      },
    });

    modal.onWillDismiss().then(async () => {
      await this.loadTracks();
    });

    await modal.present();
  }

  private async confirmDeleteTrack(track: Track) {
    const deleteTitleText = this.translateService.instant(
      'tracks.deleteConfirmHeader',
    );
    const deleteText = this.translateService.instant('general.delete');

    await this.alertController.confirm(
      deleteTitleText,
      track.name,
      deleteText,
      async (alert) => {
        await this.tracksService.delete(track.id);
        await alert.dismiss();
        await this.loadTracks();
      },
    );
  }

  private async loadTracks() {
    const tracks = await this.tracksService.getAll();

    this.tracks = [];

    for (const track of tracks) {
      const lengthKm = this.lengthKm(track);
      const durationMin = this.durationMinutes(track);
      const avgSpeedKmh = lengthKm / (durationMin / 60) || 0;

      const length = await this.unitService.convertDistance(
        lengthKm,
        DistanceUnit.KILOMETERS,
      );
      const avgSpeed = await this.unitService.convertSpeed(
        avgSpeedKmh,
        SpeedUnit.KILOMETERS_PER_HOUR,
      );

      this.tracks.push({
        ...track,
        length: this.translateService.instant('tracks.length', {
          length: length.value.toFixed(1),
          unit: length.unitText,
        }),
        duration: this.translateService.instant('tracks.duration', {
          duration: this.formatDuration(durationMin),
        }),
        averageSpeed: this.translateService.instant('tracks.avgSpeed', {
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
