import { TestBed } from '@angular/core/testing';

import { NiyatTypeService } from './niyat-type.service';

describe('NiyatTypeService', () => {
  let service: NiyatTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NiyatTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
