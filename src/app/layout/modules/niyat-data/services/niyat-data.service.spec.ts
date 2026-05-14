import { TestBed } from '@angular/core/testing';

import { NiyatDataService } from './niyat-data.service';

describe('NiyatDataService', () => {
  let service: NiyatDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NiyatDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
