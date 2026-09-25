import { TestBed } from '@angular/core/testing';

import { LovePosterService } from './love-poster.service';

describe('LovePosterService', () => {
  let service: LovePosterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LovePosterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
