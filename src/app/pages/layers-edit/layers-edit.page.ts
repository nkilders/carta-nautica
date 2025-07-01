import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonLabel,
  IonInput,
  IonItem,
  IonButton,
} from '@ionic/angular/standalone';
import { Layer } from 'src/app/models/layers';
import { LayersService } from 'src/app/services/layers.service';
import { TranslateModule } from '@ngx-translate/core';
import { ModalWrapper } from 'src/app/wrappers/modal-wrapper';
import { AlertWrapper } from 'src/app/wrappers/alert-wrapper';

@Component({
  selector: 'app-layers-edit',
  templateUrl: './layers-edit.page.html',
  styleUrls: ['./layers-edit.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonItem,
    IonInput,
    IonLabel,
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
export class LayersEditPage implements OnInit {
  @Input({ required: true })
  private readonly layer!: Layer;

  protected name: string = '';
  protected url: string = '';

  constructor(
    // Controllers
    private readonly alertController: AlertWrapper,
    private readonly modalController: ModalWrapper,
    // Services
    private readonly layersService: LayersService,
  ) {}

  ngOnInit() {
    this.name = this.layer.name;
    this.url = this.layer.source;
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
      ...this.layer,
      name: this.name,
      source: this.url,
    };

    await this.layersService.update(this.layer.id, updatedLayer);

    await this.closeModal();
  }

  protected async closeModal() {
    await this.modalController.dismissTop();
  }

  private async errorToast(textKey: string) {
    await this.alertController.show('layersEdit.errorHeader', textKey);
  }
}
