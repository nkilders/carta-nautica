import { TestBed } from '@angular/core/testing';

import { OfflineMapService } from './offline-map.service';

describe('OfflineMapService', () => {
  let service: OfflineMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
