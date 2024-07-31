import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton,
  IonList,
  IonInput,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Marker } from 'src/app/models/markers';
import { ModalController, AlertController } from '@ionic/angular';
import { MarkersService } from 'src/app/services/markers.service';

@Component({
  selector: 'app-markers-edit',
  templateUrl: './markers-edit.page.html',
  styleUrls: ['./markers-edit.page.scss'],
  standalone: true,
  imports: [
    IonList,
    IonButton,
    IonLabel,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TranslateModule,
    IonInput,
  ],
})
export class MarkersEditPage implements OnInit {
  @Input({ required: true })
  private marker?: Marker;

  protected name: string = '';

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private markers: MarkersService,
  ) {}

  ngOnInit() {
    this.name = this.marker!.name;
  }

  protected async saveChanges() {
    if (this.name.trim().length === 0) {
      await this.errorToast('markersEdit.errorNameEmpty');
      return;
    }

    const updatedMarker: Marker = {
      ...this.marker!,
      name: this.name,
    };

    await this.markers.update(this.marker!.id, updatedMarker);

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
    const headerText = await this.translate.instant('markersEdit.errorHeader');
    const messageText = await this.translate.instant(textKey);
    const okText = await this.translate.instant('markersEdit.errorOk');

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
