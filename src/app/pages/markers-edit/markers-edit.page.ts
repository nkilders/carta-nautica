import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton,
  IonList,
  IonInput,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Marker } from 'src/app/models/markers';
import { MarkersService } from 'src/app/services/markers.service';
import { ModalWrapper } from 'src/app/wrappers/modal-wrapper';
import { AlertWrapper } from 'src/app/wrappers/alert-wrapper';

@Component({
  selector: 'app-markers-edit',
  templateUrl: './markers-edit.page.html',
  styleUrls: ['./markers-edit.page.scss'],
  standalone: true,
  imports: [
    IonList,
    IonButton,
    IonLabel,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TranslateModule,
    IonInput,
  ],
})
export class MarkersEditPage implements OnInit {
  @Input({ required: true })
  private readonly marker!: Marker;

  protected name: string = '';

  constructor(
    // Controllers
    private readonly alertController: AlertWrapper,
    private readonly modalController: ModalWrapper,
    // Services
    private readonly markersService: MarkersService,
  ) {}

  ngOnInit() {
    this.name = this.marker.name;
  }

  protected async saveChanges() {
    if (this.name.trim().length === 0) {
      await this.errorToast('markersEdit.errorNameEmpty');
      return;
    }

    const updatedMarker: Marker = {
      ...this.marker,
      name: this.name,
    };

    await this.markersService.update(this.marker.id, updatedMarker);

    await this.closeModal();
  }

  protected async closeModal() {
    await this.modalController.dismissTop();
  }

  private async errorToast(textKey: string) {
    await this.alertController.show('markersEdit.errorHeader', textKey);
  }
}
