import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonReorderGroup,
  IonItem,
  IonLabel,
  IonReorder,
  IonToggle,
  IonButtons,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Marker } from 'src/app/models/markers';
import { addIcons } from 'ionicons';
import { add, ellipsisVertical, locate, pencil, trash } from 'ionicons/icons';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { MarkersService } from 'src/app/services/markers.service';
import { MarkersEditPage } from '../markers-edit/markers-edit.page';

@Component({
  selector: 'app-markers',
  templateUrl: './markers.page.html',
  styleUrls: ['./markers.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    IonFabButton,
    IonFab,
    IonButtons,
    IonToggle,
    IonReorder,
    IonLabel,
    IonItem,
    IonReorderGroup,
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
    private markersSrv: MarkersService,
    private translate: TranslateService,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
  ) {
    addIcons({
      add,
      ellipsisVertical,
      locate,
      pencil,
      trash,
    });
  }

  async ngOnInit() {
    await this.loadMarkers();
  }

  protected async showMarkerOptions(marker: Marker) {
    const flyToText = this.translate.instant('markers.flyTo');
    const editText = this.translate.instant('markers.edit');
    const deleteText = this.translate.instant('markers.delete');

    const actionSheet = await this.actionSheetCtrl.create({
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
      animated: true,
    });

    await actionSheet.present();
  }

  private async loadMarkers() {
    this.markers = await this.markersSrv.getAll();
  }

  private async flyToMarker(marker: Marker) {
    this.markersSrv.flyTo(marker);

    await this.modalCtrl.dismiss();
  }

  private async editMarker(marker: Marker) {
    const modal = await this.modalCtrl.create({
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
    const deleteTitleText = this.translate.instant(
      'markers.deleteConfirmHeader',
    );
    const cancelText = this.translate.instant('markers.deleteCancel');
    const deleteText = this.translate.instant('markers.deleteConfirm');

    const alert = await this.alertCtrl.create({
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
            await this.markersSrv.delete(marker.id);
            await alert.dismiss();
            await this.loadMarkers();
          },
        },
      ],
      animated: true,
    });

    await alert.present();
  }
}
