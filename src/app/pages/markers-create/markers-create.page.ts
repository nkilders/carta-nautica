import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonInput,
} from '@ionic/angular/standalone';
import { MarkersService } from 'src/app/services/markers.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModalController, AlertController } from '@ionic/angular';
import { MarkerWithoutId } from 'src/app/models/markers';

@Component({
  selector: 'app-markers-create',
  templateUrl: './markers-create.page.html',
  styleUrls: ['./markers-create.page.scss'],
  standalone: true,
  imports: [
    IonList,
    IonLabel,
    IonItem,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonInput,
    TranslateModule,
  ],
})
export class MarkersCreatePage {
  @Input({ required: true })
  private longitude!: number;
  @Input({ required: true })
  private latitude!: number;

  protected name: string = '';

  constructor(
    private markersSrv: MarkersService,
    private translate: TranslateService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
  ) {}

  protected async createMarker() {
    if (this.name.trim().length === 0) {
      await this.errorToast('markersCreate.errorNameEmpty');
      return;
    }

    const newMarker: MarkerWithoutId = {
      name: this.name,
      longitude: this.longitude!,
      latitude: this.latitude!,
    };

    await this.markersSrv.create(newMarker);

    await this.closeModal();
  }

  protected async closeModal() {
    const modal = await this.modalCtrl.getTop();

    if (!modal) {
      return;
    }

    await modal.dismiss();
  }

  private async errorToast(textKey: string) {
    const headerText = await this.translate.instant(
      'markersCreate.errorHeader',
    );
    const messageText = await this.translate.instant(textKey);
    const okText = await this.translate.instant('markersCreate.errorOk');

    const toast = await this.alertCtrl.create({
      header: headerText,
      message: messageText,
      buttons: [
        {
          text: okText,
        },
      ],
      animated: true,
    });

    await toast.present();
  }
}
