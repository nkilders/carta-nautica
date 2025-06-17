import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Track } from 'src/app/models/tracks';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tracks-edit',
  templateUrl: './tracks-edit.page.html',
  styleUrls: ['./tracks-edit.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
})
export class TracksEditPage implements OnInit {
  @Input({ required: true })
  readonly track!: Track;

  constructor() {}

  ngOnInit() {}
}
