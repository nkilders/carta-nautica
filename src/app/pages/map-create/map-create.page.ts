import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OnlineMap } from 'src/app/models/map.model';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map-create',
  templateUrl: './map-create.page.html',
  styleUrls: ['./map-create.page.scss'],
})
export class MapCreatePage {
  name: string = '';
  url: string = '';

  constructor(
    private modalCtrl: ModalController,
    private mapSrv: MapService,
  ) { }

  async createHandler() {
    if(!this.name) return;
    if(!this.url) return;

    await this.mapSrv.addMap(
      new OnlineMap(this.name, this.url),
    );

    await this.closeModal();
  }

  async closeModal() {
    const modal = await this.modalCtrl.getTop();
    await modal.dismiss();
  }
}