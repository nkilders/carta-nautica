import { Injectable } from '@angular/core';
import { Geoposition, PositionError } from '@ionic-native/geolocation';
import * as EventEmitter from 'events';
import { Subscription } from 'rxjs';
import { Track } from '../models/track.model';
import { GeolocationService } from './geolocation.service';
import { TrackService } from './track.service';

@Injectable({
  providedIn: 'root'
})
export class TrackRecorderService {
  private eventEmitter: EventEmitter;

  private recording: boolean = false;
  private paused: boolean = false;

  private posSubscription: Subscription;
  private track: Track;

  constructor(
    private geolocationSrv: GeolocationService,
    private trackSrv: TrackService,
  ) {
    this.eventEmitter = new EventEmitter();
  }

  async startRecording() {
    this.recording = true;
    this.paused = false;

    this.track = new Track('New Track', []);

    const obs = await this.geolocationSrv.watchPosition();
    this.posSubscription = obs.subscribe(pos => this.geoHandle(pos));
  }

  async stopRecording() {
    this.recording = false;
    this.paused = false;

    this.posSubscription.unsubscribe();
    this.posSubscription = null;

    await this.trackSrv.addTrack(this.track);

    return this.track;
  }

  isRecording() {
    return this.recording;
  }

  isPaused() {
    return this.paused;
  }

  setPaused(paused: boolean) {
    this.paused = paused;
  }

  getTrack() {
    return this.track;
  }

  on(event: 'newPoint', listener: (track: Track) => void): void;

  on(event: string, listener: (...args: any) => void) {
    this.eventEmitter.on(event, listener);
  }

  private geoHandle(pos: Geoposition | PositionError) {
    if(!this.recording) return;
    if(this.paused) return;
    if(!GeolocationService.isPosition(pos)) return;
    
    this.track.points.push([pos.timestamp, [pos.coords.longitude, pos.coords.latitude]]);

    this.eventEmitter.emit('newPoint', this.track);
    console.log(pos.coords.latitude, pos.coords.longitude);
    
  }
}
