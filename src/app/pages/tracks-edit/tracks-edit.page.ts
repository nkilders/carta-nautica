import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
} from '@ionic/angular/standalone';
import { Track } from 'src/app/models/tracks';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModalWrapper } from 'src/app/wrappers/modal-wrapper';
import { TracksService } from 'src/app/services/tracks.service';
import { AlertWrapper } from 'src/app/wrappers/alert-wrapper';

@Component({
  selector: 'app-tracks-edit',
  templateUrl: './tracks-edit.page.html',
  styleUrls: ['./tracks-edit.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonLabel,
    IonInput,
    IonItem,
    IonList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
})
export class TracksEditPage implements OnInit {
  @Input({ required: true })
  readonly track!: Track;

  protected name: string = '';

  constructor(
    private readonly modalCtrl: ModalWrapper,
    private readonly alertCtrl: AlertWrapper,
    private readonly translate: TranslateService,
    private readonly tracks: TracksService,
  ) {}

  ngOnInit() {
    this.name = this.track.name;
  }

  protected async saveChanges() {
    if (this.name.trim().length === 0) {
      await this.errorToast('tracksEdit.errorNameEmpty');
      return;
    }

    const updatedTrack: Track = {
      ...this.track,
      name: this.name,
    };

    await this.tracks.update(this.track.id, updatedTrack);

    await this.closeModal();
  }

  protected async closeModal() {
    await this.modalCtrl.dismissTop();
  }

  private async errorToast(textKey: string) {
    const headerText = await this.translate.instant('tracksEdit.errorHeader');
    const messageText = await this.translate.instant(textKey);
    const okText = await this.translate.instant('general.ok');

    const toast = await this.alertCtrl.create({
      header: headerText,
      message: messageText,
      buttons: [
        {
          text: okText,
        },
      ],
    });

    await toast.present();
  }
}
