import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { Track } from 'src/app/models/track.model';
import { TrackService } from 'src/app/services/track.service';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.page.html',
  styleUrls: ['./tracks.page.scss'],
})
export class TracksPage implements OnInit {
  tracks: Track[];

  constructor(
    private trackSrv: TrackService,
    private actSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.loadTracks();
  }

  async showTrackOptions(track: Track) {
    const actSheet = await this.actSheetCtrl.create({
      header: track.name,
      buttons: [
        { text: 'Edit', handler: () => this.editHandler(track) },
        { text: 'Delete', handler: () => this.deleteHandler(track) },
      ],
      animated: true,
    });

    await actSheet.present();
  }

  async editHandler(track: Track) {
    // const modal = await this.modalCtrl.create({
    //   component: TrackEditPage,
    //   componentProps: {
    //     track: track,
    //   },
    // });

    // modal.onWillDismiss().then(() => this.loadTracks());

    // await modal.present();
  }

  async deleteHandler(track: Track) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Track',
      subHeader: track.name,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.trackSrv.deleteTrack(track);
            await alert.dismiss();
            await this.loadTracks();
          },
        },
      ],
    });

    alert.present();
  }

  private async loadTracks() {
    const tracks = await this.trackSrv.getAllTracks();

    this.tracks = tracks;
  }

}
