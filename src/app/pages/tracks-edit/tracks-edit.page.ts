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
} from '@ionic/angular';
import { Track } from '../../models/tracks';
import { TranslateModule } from '@ngx-translate/core';
import { ModalWrapper } from '../../wrappers/modal-wrapper';
import { TracksService } from '../../services/tracks.service';
import { AlertWrapper } from '../../wrappers/alert-wrapper';

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
    // Controllers
    private readonly alertController: AlertWrapper,
    private readonly modalController: ModalWrapper,
    // Services
    private readonly tracksService: TracksService,
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

    await this.tracksService.update(this.track.id, updatedTrack);

    await this.closeModal();
  }

  protected async closeModal() {
    await this.modalController.dismissTop();
  }

  private async errorToast(textKey: string) {
    await this.alertController.info('tracksEdit.errorHeader', textKey);
  }
}
