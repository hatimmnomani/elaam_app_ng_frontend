import { TestBed } from '@angular/core/testing';

import { FMBService } from './fmb.service';

describe('FMBService', () => {
  let service: FMBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FMBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
