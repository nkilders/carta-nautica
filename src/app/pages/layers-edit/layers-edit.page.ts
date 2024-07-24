import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonLabel, IonInput, IonItem, IonButton } from '@ionic/angular/standalone';
import { Layer } from 'src/app/models/layers';
import { LayersService } from 'src/app/services/layers.service';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

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
  ) {}

  ngOnInit() {
    this.name = this.layer!.name;
    this.url = this.layer!.source;
  }

  protected async saveChanges() {
    // TODO: validate inputs

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
}
