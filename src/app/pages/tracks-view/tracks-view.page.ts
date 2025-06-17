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

@Component({
  selector: 'app-tracks-view',
  templateUrl: './tracks-view.page.html',
  styleUrls: ['./tracks-view.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class TracksViewPage implements OnInit {
  @Input({ required: true })
  readonly track!: Track;

  constructor() {}

  ngOnInit() {}
}
