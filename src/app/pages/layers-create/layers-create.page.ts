import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayersService } from 'src/app/services/layers.service';
import { AlertController } from '@ionic/angular';
import { LayerWithoutId } from 'src/app/models/layers';
import { ModalWrapper } from 'src/app/wrappers/modal-wrapper';

@Component({
  selector: 'app-layers-create',
  templateUrl: './layers-create.page.html',
  styleUrls: ['./layers-create.page.scss'],
  standalone: true,
  imports: [
    IonList,
    IonButton,
    IonInput,
    IonLabel,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
})
export class LayersCreatePage {
  protected name: string = '';
  protected url: string = '';

  constructor(
    private modalCtrl: ModalWrapper,
    private layers: LayersService,
    private alertCtrl: AlertController,
    private translate: TranslateService,
  ) {}

  protected async createLayer() {
    if (this.name.trim().length === 0) {
      await this.errorToast('layersCreate.errorNameEmpty');
      return;
    }

    if (this.url.trim().length === 0) {
      await this.errorToast('layersCreate.errorUrlEmpty');
      return;
    }

    const newLayer: LayerWithoutId = {
      name: this.name,
      source: this.url,
      visible: true,
    };

    await this.layers.create(newLayer);

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
    const headerText = await this.translate.instant('layersCreate.errorHeader');
    const messageText = await this.translate.instant(textKey);
    const okText = await this.translate.instant('layersCreate.errorOk');

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
