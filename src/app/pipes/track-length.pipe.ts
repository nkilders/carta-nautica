import { Pipe, PipeTransform } from '@angular/core';
import { getTrackLength, Track } from '../models/track.model';

@Pipe({
  name: 'trackLength'
})
export class TrackLengthPipe implements PipeTransform {

  transform(value: Track): unknown {
    return getTrackLength(value).toFixed(2) + ' km';
  }

}