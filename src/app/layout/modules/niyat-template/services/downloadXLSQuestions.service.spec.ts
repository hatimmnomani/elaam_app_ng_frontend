/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DownloadXLSQuestionsService } from './downloadXLSQuestions.service';

describe('Service: DownloadXLSQuestions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DownloadXLSQuestionsService]
    });
  });

  it('should ...', inject([DownloadXLSQuestionsService], (service: DownloadXLSQuestionsService) => {
    expect(service).toBeTruthy();
  }));
});
