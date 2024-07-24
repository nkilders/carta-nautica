import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonList } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { LayersService } from 'src/app/services/layers.service';
import { ModalController } from '@ionic/angular';
import { LayerWithoutId } from 'src/app/models/layers';

@Component({
  selector: 'app-layers-create',
  templateUrl: './layers-create.page.html',
  styleUrls: ['./layers-create.page.scss'],
  standalone: true,
  imports: [IonList, IonButton, IonInput, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TranslateModule],
})
export class LayersCreatePage {
  protected name: string = '';
  protected url: string = '';

  constructor(
    private modalCtrl: ModalController,
    private layers: LayersService,
  ) {}

  protected async createLayer() {
    // TODO: validate inputs

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

    if(!modal) {
      return;
    }

    await modal.dismiss();
  }
}
