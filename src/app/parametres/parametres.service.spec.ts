import { TestBed } from '@angular/core/testing';

import { ParametresService } from './parametres.service';

describe('ParametresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParametresService = TestBed.get(ParametresService);
    expect(service).toBeTruthy();
  });
});
