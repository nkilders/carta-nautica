import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonReorderGroup, IonItem, IonReorder, IonLabel, IonToggle, IonButtons, IonButton, IonIcon, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Layer } from 'src/app/models/layers';
import { add, ellipsisVertical } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { LayersService } from 'src/app/services/layers.service';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { LayersEditPage } from '../layers-edit/layers-edit.page';
import { LayersCreatePage } from '../layers-create/layers-create.page';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.page.html',
  styleUrls: ['./layers.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonIcon, IonButton, IonButtons, IonToggle, IonLabel, IonReorder, IonItem, IonReorderGroup, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TranslateModule, IonReorderGroup, IonItem],
})
export class LayersPage implements OnInit {
  protected layers: Layer[] = [];

  constructor(
    private layerSrv: LayersService,
    private translate: TranslateService,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
  ) {
    addIcons({ ellipsisVertical, add });
  }

  async ngOnInit() {
    await this.loadLayers();
  }

  protected async onReorder(event: CustomEvent) {
    const { from, to, complete } = event.detail;

    const layerId = this.layers[from].id;

    await this.layerSrv.moveLayer(layerId, to);

    complete();
  }

  protected async toggleLayerVisibility(event: CustomEvent, layer: Layer) {
    const { checked } = event.detail;

    layer.visible = checked;

    await this.layerSrv.update(layer.id, layer);
  }
  
  protected async showLayerOptions(layer: Layer) {
    const editText = this.translate.instant('layers.edit');
    const deleteText = this.translate.instant('layers.delete');

    const actionSheet = await this.actionSheetCtrl.create({
      header: layer.name,
      buttons: [
        {
          text: editText,
          handler: () => this.editLayer(layer),
        },
        {
          text: deleteText,
          handler: () => this.confirmDeleteLayer(layer),
        },
      ],
      animated: true,
    });

    await actionSheet.present();
  }

  protected async createLayer() {
    const modal = await this.modalCtrl.create({
      component: LayersCreatePage,
    });

    modal.onWillDismiss().then(async () => {
      await this.loadLayers();
    });

    await modal.present();
  }

  private async loadLayers() {
    this.layers = await this.layerSrv.getAll();
  }

  private async editLayer(layer: Layer) {
    const modal = await this.modalCtrl.create({
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
    const deleteTitleText = this.translate.instant('layers.deleteConfirmHeader');
    const cancelText = this.translate.instant('layers.deleteCancel');
    const deleteText = this.translate.instant('layers.deleteConfirm');

    const alert = await this.alertCtrl.create({
      header: deleteTitleText,
      subHeader: layer.name,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
        },
        {
          text: deleteText,
          handler: async () => {
            await this.layerSrv.delete(layer.id);
            await alert.dismiss();
            await this.loadLayers();
          },
        },
      ],
      animated: true,
    });

    await alert.present();
  }
}
