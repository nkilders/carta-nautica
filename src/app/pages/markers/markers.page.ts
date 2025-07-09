import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Marker } from 'src/app/models/markers';
import { addIcons } from 'ionicons';
import { add, ellipsisVertical, locate, pencil, trash } from 'ionicons/icons';
import { MarkersService } from 'src/app/services/markers.service';
import { MarkersEditPage } from '../markers-edit/markers-edit.page';
import { ModalWrapper } from 'src/app/wrappers/modal-wrapper';
import { AlertWrapper } from 'src/app/wrappers/alert-wrapper';
import { ActionSheetWrapper } from 'src/app/wrappers/action-sheet-wrapper';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-markers',
  templateUrl: './markers.page.html',
  styleUrls: ['./markers.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    IonButtons,
    IonLabel,
    IonItem,
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
export class MarkersPage implements OnInit {
  protected markers: Marker[] = [];

  constructor(
    // Controllers
    private readonly actionSheetController: ActionSheetWrapper,
    private readonly alertController: AlertWrapper,
    private readonly modalController: ModalWrapper,
    // Services
    private readonly mapService: MapService,
    private readonly markersService: MarkersService,
    private readonly translateService: TranslateService,
  ) {
    addIcons({
      add,
      ellipsisVertical,
      locate,
      pencil,
      trash,
    });
  }

  ngOnInit() {
    this.loadMarkers();
  }

  protected async showMarkerOptions(marker: Marker) {
    const flyToText = this.translateService.instant('markers.flyTo');
    const editText = this.translateService.instant('general.edit');
    const deleteText = this.translateService.instant('general.delete');

    const actionSheet = await this.actionSheetController.create({
      header: marker.name,
      buttons: [
        {
          text: flyToText,
          icon: 'locate',
          handler: () => this.flyToMarker(marker),
        },
        {
          text: editText,
          icon: 'pencil',
          handler: () => this.editMarker(marker),
        },
        {
          text: deleteText,
          icon: 'trash',
          handler: () => this.confirmDeleteMarker(marker),
        },
      ],
    });

    await actionSheet.present();
  }

  private async loadMarkers() {
    this.markers = await this.markersService.getAll();
  }

  private async flyToMarker(marker: Marker) {
    const { longitude, latitude } = marker;
    this.mapService.flyTo(longitude, latitude, 15, 1000);

    await this.modalController.dismiss();
  }

  private async editMarker(marker: Marker) {
    const modal = await this.modalController.create({
      component: MarkersEditPage,
      componentProps: {
        marker,
      },
    });

    modal.onWillDismiss().then(async () => {
      await this.loadMarkers();
    });

    await modal.present();
  }

  private async confirmDeleteMarker(marker: Marker) {
    const deleteTitleText = this.translateService.instant(
      'markers.deleteConfirmHeader',
    );
    const cancelText = this.translateService.instant('general.cancel');
    const deleteText = this.translateService.instant('general.delete');

    const alert = await this.alertController.create({
      header: deleteTitleText,
      subHeader: marker.name,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
        },
        {
          text: deleteText,
          handler: async () => {
            await this.markersService.delete(marker.id);
            await alert.dismiss();
            await this.loadMarkers();
          },
        },
      ],
    });

    await alert.present();
  }
}
