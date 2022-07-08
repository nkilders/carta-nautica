import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { Map } from 'src/app/models/map.model';
import { MapService } from 'src/app/services/map.service';
import { MapCreatePage } from '../map-create/map-create.page';
import { MapEditPage } from '../map-edit/map-edit.page';

@Component({
  selector: 'app-map-layers',
  templateUrl: './map-layers.page.html',
  styleUrls: ['./map-layers.page.scss'],
})
export class MapLayersPage implements OnInit {
  maps: Map[];

  constructor(
    private mapSrv: MapService,
    private actSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.loadMaps();
  }

  async onReorder(e: CustomEvent) {
    const {from, to}: {from: number, to: number} = e.detail;

    await this.mapSrv.updateMapPosition(this.maps[from], to);

    await this.loadMaps();
    
    e.detail.complete();
  }

  async showMapOptions(map: Map) {
    const actSheet = await this.actSheetCtrl.create({
      header: map.name,
      buttons: [
        { text: 'Edit', handler: () => this.editHandler(map) },
        { text: 'Delete', handler: () => this.deleteHandler(map) },
      ],
      animated: true,
    });

    await actSheet.present();
  }

  async editHandler(map: Map) {
    const modal = await this.modalCtrl.create({
      component: MapEditPage,
      componentProps: {
        map: map,
      },
    });

    modal.onWillDismiss().then(() => this.loadMaps());

    await modal.present();
  }

  async deleteHandler(map: Map) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Map Layer',
      subHeader: map.name,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.mapSrv.deleteMap(map);
            await alert.dismiss();
            await this.loadMaps();
          },
        },
      ],
    });

    alert.present();
  }

  toggleMapStatus(e: CustomEvent, map: Map) {
    map.enabled = e.detail.checked;
    this.mapSrv.updateMap(map);
  }

  async createHandler() {
    const modal = await this.modalCtrl.create({
      component: MapCreatePage,
    });
    
    modal.onWillDismiss().then(() => this.loadMaps());

    await modal.present();
  }

  private async loadMaps() {
    const maps = await this.mapSrv.getAllMaps();

    maps.sort((a, b) => a.position - b.position);

    this.maps = maps;
  }
}
