import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Map } from 'src/app/models/map.model';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map-edit',
  templateUrl: './map-edit.page.html',
  styleUrls: ['./map-edit.page.scss'],
})
export class MapEditPage implements OnInit {
  @Input() map: Map;

  name: string = '';
  url: string = '';
  
  constructor(
    private modalCtrl: ModalController,
    private mapSrv: MapService,
  ) { }

  ngOnInit() {
    this.name = this.map.name;
    this.url = this.map.src;
  }

  async saveHandler() {
    if(!this.name) return;
    if(!this.url) return;

    this.map.name = this.name;
    this.map.src = this.url;

    await this.mapSrv.updateMap(this.map);

    await this.closeModal();
  }
  
  async closeModal() {
    const modal = await this.modalCtrl.getTop();
    await modal.dismiss();
  }
}