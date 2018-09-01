import { TestBed, inject } from '@angular/core/testing';

import { RgpdService } from './rgpd.service';

describe('RgpdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RgpdService]
    });
  });

  it('should be created', inject([RgpdService], (service: RgpdService) => {
    expect(service).toBeTruthy();
  }));
});
