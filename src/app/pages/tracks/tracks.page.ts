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
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Track } from 'src/app/models/tracks';
import { addIcons } from 'ionicons';
import { ellipsisVertical } from 'ionicons/icons';
import { TracksService } from 'src/app/services/tracks.service';
import { ActionSheetController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.page.html',
  styleUrls: ['./tracks.page.scss'],
  standalone: true,
  imports: [
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
  tracks: Track[] = [
    {
      id: 'asd',
      name: 'My Track',
      points: [],
    },
  ];

  constructor(
    private tracksSrv: TracksService,
    private translate: TranslateService,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
  ) {
    addIcons({
      ellipsisVertical,
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
    this.tracks = await this.tracksSrv.getAll();
  }
}
