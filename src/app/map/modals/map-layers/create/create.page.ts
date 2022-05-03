import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapStorageService } from 'src/app/services/storage/map.service';
import { Map } from 'src/app/stuff/map';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage {
  type: string = "online";
  name: string = "";
  url: string = "";

  constructor(
    private modalCtrl: ModalController,
    private mapSrv: MapStorageService,
  ) { }

  async createHandler() {
    if(!this.name) return;
    if(!this.url) return;

    await this.mapSrv.saveMap(
      new Map(this.type, this.name, this.url)
    );

    await this.closeModal();
  }

  async closeModal() {
    const modal = await this.modalCtrl.getTop();
    await modal.dismiss();
  }
}
