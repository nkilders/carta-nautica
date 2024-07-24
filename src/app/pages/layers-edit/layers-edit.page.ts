import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonLabel, IonInput, IonItem, IonButton } from '@ionic/angular/standalone';
import { Layer } from 'src/app/models/layers';
import { LayersService } from 'src/app/services/layers.service';
import { ModalController, AlertController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-layers-edit',
  templateUrl: './layers-edit.page.html',
  styleUrls: ['./layers-edit.page.scss'],
  standalone: true,
  imports: [IonButton, IonItem, IonInput, IonLabel, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TranslateModule],
})
export class LayersEditPage implements OnInit {
  @Input({ required: true })
  private layer?: Layer;

  protected name: string = '';
  protected url: string = '';

  constructor(
    private layers: LayersService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.name = this.layer!.name;
    this.url = this.layer!.source;
  }

  protected async saveChanges() {
    if (this.name.trim().length === 0) {
      await this.errorToast('layersEdit.errorNameEmpty');
      return;
    }

    if (this.url.trim().length === 0) {
      await this.errorToast('layersEdit.errorUrlEmpty');
      return;
    }

    const updatedLayer: Layer = {
      ...this.layer!,
      name: this.name,
      source: this.url,
    };

    await this.layers.update(this.layer!.id, updatedLayer);

    await this.closeModal();
  }

  protected async closeModal() {
    const modal = await this.modalCtrl.getTop();

    if(!modal) {
      return;
    }

    await modal.dismiss();
  }

  private async errorToast(textKey: string) {
    const headerText = await this.translate.instant('layersEdit.errorHeader');
    const messageText = await this.translate.instant(textKey);
    const okText = await this.translate.instant('layersEdit.errorOk');

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
