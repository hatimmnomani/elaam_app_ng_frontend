import { TestBed } from '@angular/core/testing';

import { QuranHifzService } from './quran-hifz.service';

describe('QuranHifzService', () => {
  let service: QuranHifzService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuranHifzService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
