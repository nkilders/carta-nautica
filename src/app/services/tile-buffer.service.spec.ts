import { TestBed } from '@angular/core/testing';

import { TileBufferService } from './tile-buffer.service';

describe('TileBufferService', () => {
  let service: TileBufferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TileBufferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
