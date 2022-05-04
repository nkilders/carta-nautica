import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonReorderGroup, ModalController } from '@ionic/angular';
import { MapStorageService } from 'src/app/services/storage/map.service';
import { Map } from 'src/app/stuff/map';

// Modals
import { CreatePage } from './create/create.page';
import { EditPage } from './edit/edit.page';

@Component({
  selector: 'app-map-layers',
  templateUrl: './map-layers.page.html',
  styleUrls: ['./map-layers.page.scss'],
})
export class MapLayersPage implements OnInit {
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  private maps: Map[] = [];
  
  constructor(
    private mapSrv: MapStorageService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.loadMaps();
  }

  async onReorder(e: CustomEvent) {
    const from = e.detail.from;
    const to = e.detail.to;

    this.maps.sort((a, b) => a.position - b.position);

    this.arrayMove(this.maps, from, to);

    let i = 0;
    for(const m of this.maps) {
      m.position = i++;
      await this.mapSrv.updateMap(m);
    }

    e.detail.complete();
  }

  private arrayMove(arr: any[], indexFrom: number, indexTo: number) {
    if (indexTo >= arr.length) {
      var k = indexTo - arr.length + 1;

      while (k--) {
        arr.push(undefined);
      }
    }

    arr.splice(indexTo, 0, arr.splice(indexFrom, 1)[0]);

    return arr;
  }

  toggleMapStatus(e: CustomEvent, index: number) {
    const map = this.maps[index];

    map.enabled = e.detail.checked;
    this.mapSrv.updateMap(map);
  }

  private loadMaps() {
    this.mapSrv.getMaps().then(maps => {
      this.maps = maps.sort((m1, m2) => m1.position - m2.position);

      // Replace initial position "99999" with real position
      this.maps.forEach((map, index) => {
        map.position = index;
        this.mapSrv.updateMap(map);
      });
    });
  }

  async showMapOptions(map: Map) {
    const actSheet = await this.actionSheetCtrl.create({
      header: map.name,
      buttons: [
        { text: 'Edit', handler: () => this.editHandler(map) },
        { text: 'Delete', handler: () => this.deleteHandler(map) },
      ],
    });

    await actSheet.present();
  }

  async editHandler(map: Map) {
    const modal = await this.modalCtrl.create({
      component: EditPage,
      componentProps: {
        map: map
      }
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
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.mapSrv.deleteMap(map);
            await alert.dismiss();
            this.loadMaps();
          }
        }
      ]
    });

    alert.present();
  }

  async createHandler() {
    const modal = await this.modalCtrl.create({
      component: CreatePage
    });
    
    modal.onWillDismiss().then(() => this.loadMaps());

    await modal.present();
  }
}