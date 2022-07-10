import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Track } from 'src/app/models/track.model';
import { TrackService } from 'src/app/services/track.service';

@Component({
  selector: 'app-track-edit',
  templateUrl: './track-edit.page.html',
  styleUrls: ['./track-edit.page.scss'],
})
export class TrackEditPage implements OnInit {
  @Input() track: Track;

  name: string = '';

  constructor(
    private modalCtrl: ModalController,
    private trackSrv: TrackService,
  ) { }

  ngOnInit() {
    this.name = this.track.name;
  }

  async saveHandler() {
    if(!this.name) return;

    this.track.name = this.name;

    await this.trackSrv.updateTrack(this.track);

    await this.closeModal();
  }
  
  async closeModal() {
    const modal = await this.modalCtrl.getTop();
    await modal.dismiss();
  }
}
