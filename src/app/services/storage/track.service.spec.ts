import { TestBed } from '@angular/core/testing';

import { TrackStorageService as TrackStorageService } from './track.service';

describe('TrackStorageService', () => {
  let service: TrackStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
