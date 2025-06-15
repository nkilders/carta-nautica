import { Injectable } from '@angular/core';
import { Point, Track, TrackWithoutId } from '../models/tracks';
import { GeolocationService } from './geolocation.service';
import { TracksService } from './tracks.service';
import { Position } from '@capacitor/geolocation';
import { EventEmitter } from 'events';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class TrackRecorderService {
  private readonly eventEmitter;

  private recording = false;
  private positionWatchId = '';
  private track?: TrackWithoutId;

  constructor(
    private readonly geolocation: GeolocationService,
    private readonly settings: SettingsService,
    private readonly tracks: TracksService,
  ) {
    this.eventEmitter = new EventEmitter();
  }

  public async startRecording() {
    this.recording = true;

    const language = await this.settings.getLanguage();

    this.track = {
      name: new Date().toLocaleString(language),
      points: [],
    };

    this.eventEmitter.emit('startRecording');

    this.positionWatchId = await this.geolocation.watchPosition((position) =>
      this.positionHandler(position),
    );
  }

  public async stopRecording() {
    this.recording = false;
    this.geolocation.cleanPositionWatch(this.positionWatchId);

    const track = await this.tracks.create(this.track!);

    this.eventEmitter.emit('stopRecording', track);

    return track;
  }

  public isRecording() {
    return this.recording;
  }

  on(
    event: 'newPoint',
    listener: (track: TrackWithoutId, point: Point) => void,
  ): void;
  on(event: 'startRecording', listener: () => void): void;
  on(event: 'stopRecording', listener: (track: Track) => void): void;

  on(event: string, listener: (...args: any) => void) {
    this.eventEmitter.on(event, listener);
  }

  private positionHandler(position: Position) {
    const { latitude, longitude } = position.coords;

    const point: Point = {
      latitude,
      longitude,
      timestamp: position.timestamp,
    };

    this.track!.points.push(point);
    this.eventEmitter.emit('newPoint', this.track!, point);
  }
}
