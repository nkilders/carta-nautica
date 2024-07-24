import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonReorderGroup, IonItem, IonReorder, IonLabel, IonToggle, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Layer } from 'src/app/models/layers';
import { ellipsisVertical } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { LayersService } from 'src/app/services/layers.service';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.page.html',
  styleUrls: ['./layers.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonButtons, IonToggle, IonLabel, IonReorder, IonItem, IonReorderGroup, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TranslateModule, IonReorderGroup, IonItem],
})
export class LayersPage implements OnInit {
  protected layers: Layer[] = [];

  constructor(private layerSrv: LayersService) {
    addIcons({ ellipsisVertical });
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
  
  protected async showLayerOptions(layer: Layer) {}

  private async loadLayers() {
    this.layers = await this.layerSrv.getAll();
  }
}
