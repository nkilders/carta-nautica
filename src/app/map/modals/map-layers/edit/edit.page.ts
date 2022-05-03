import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapStorageService } from 'src/app/services/storage/map.service';
import { Map } from 'src/app/stuff/map';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage {
  @Input() map: Map;

  type: string;
  name: string;
  url: string;

  constructor(
    private modalCtrl: ModalController,
    private mapSrv: MapStorageService,
  ) { }

  ionViewWillEnter() {
    this.type = this.map.type;
    this.name = this.map.name;
    this.url = this.map.url;
  }

  async saveHandler() {
    if(!this.name) return;
    if(!this.url) return;

    this.map.type = this.type;
    this.map.name = this.name;
    this.map.url = this.url;

    await this.mapSrv.updateMap(this.map);

    await this.closeModal();
  }
  
  async closeModal() {
    const modal = await this.modalCtrl.getTop();
    await modal.dismiss();
  }
}
