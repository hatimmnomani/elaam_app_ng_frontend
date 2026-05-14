import { TestBed } from '@angular/core/testing';

import { NiyatQuestionService } from './niyat-question.service';

describe('NiyatQuestionService', () => {
  let service: NiyatQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NiyatQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
