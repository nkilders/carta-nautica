import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonReorderGroup,
  IonItem,
  IonReorder,
  IonLabel,
  IonToggle,
  IonButtons,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Layer } from 'src/app/models/layers';
import { add, ellipsisVertical, pencil, trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { LayersService } from 'src/app/services/layers.service';
import { LayersEditPage } from '../layers-edit/layers-edit.page';
import { LayersCreatePage } from '../layers-create/layers-create.page';
import { ModalWrapper } from 'src/app/wrappers/modal-wrapper';
import { AlertWrapper } from 'src/app/wrappers/alert-wrapper';
import { ActionSheetWrapper } from 'src/app/wrappers/action-sheet-wrapper';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.page.html',
  styleUrls: ['./layers.page.scss'],
  standalone: true,
  imports: [
    IonFabButton,
    IonFab,
    IonIcon,
    IonButton,
    IonButtons,
    IonToggle,
    IonLabel,
    IonReorder,
    IonItem,
    IonReorderGroup,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TranslateModule,
    IonReorderGroup,
    IonItem,
  ],
})
export class LayersPage implements OnInit {
  protected layers: Layer[] = [];

  constructor(
    // Controllers
    private readonly actionSheetController: ActionSheetWrapper,
    private readonly alertController: AlertWrapper,
    private readonly modalController: ModalWrapper,
    // Services
    private readonly layerService: LayersService,
    private readonly translateService: TranslateService,
  ) {
    addIcons({ ellipsisVertical, add, pencil, trash });
  }

  ngOnInit() {
    this.loadLayers();
  }

  protected async onReorder(event: CustomEvent) {
    const { from, to, complete } = event.detail;

    const layerId = this.layers[from].id;

    await this.layerService.moveLayer(layerId, to);

    complete();
  }

  protected async toggleLayerVisibility(event: CustomEvent, layer: Layer) {
    const { checked } = event.detail;

    layer.visible = checked;

    await this.layerService.update(layer.id, layer);
  }

  protected async showLayerOptions(layer: Layer) {
    const editText = this.translateService.instant('general.edit');
    const deleteText = this.translateService.instant('general.delete');

    const actionSheet = await this.actionSheetController.create({
      header: layer.name,
      buttons: [
        {
          text: editText,
          icon: 'pencil',
          handler: () => this.editLayer(layer),
        },
        {
          text: deleteText,
          icon: 'trash',
          handler: () => this.confirmDeleteLayer(layer),
        },
      ],
    });

    await actionSheet.present();
  }

  protected async createLayer() {
    const modal = await this.modalController.create({
      component: LayersCreatePage,
    });

    modal.onWillDismiss().then(async () => {
      await this.loadLayers();
    });

    await modal.present();
  }

  private async loadLayers() {
    this.layers = await this.layerService.getAll();
  }

  private async editLayer(layer: Layer) {
    const modal = await this.modalController.create({
      component: LayersEditPage,
      componentProps: {
        layer,
      },
    });

    modal.onWillDismiss().then(async () => {
      await this.loadLayers();
    });

    await modal.present();
  }

  private async confirmDeleteLayer(layer: Layer) {
    const deleteTitleText = this.translateService.instant(
      'layers.deleteConfirmHeader',
    );
    const deleteText = this.translateService.instant('general.delete');

    await this.alertController.confirm(
      deleteTitleText,
      layer.name,
      deleteText,
      async (alert) => {
        await this.layerService.delete(layer.id);
        await alert.dismiss();
        await this.loadLayers();
      },
    );
  }
}
