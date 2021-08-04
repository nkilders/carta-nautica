import { TestBed } from '@angular/core/testing';

import { MapStorageService } from './map.service';

describe('MapStorageService', () => {
  let service: MapStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
