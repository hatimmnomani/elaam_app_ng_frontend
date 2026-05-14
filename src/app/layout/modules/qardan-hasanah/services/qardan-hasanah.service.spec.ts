import { TestBed } from '@angular/core/testing';

import { QardanHasanaService } from './qardan-hasanah.service';

describe('QardanHasanaService', () => {
  let service: QardanHasanaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QardanHasanaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
