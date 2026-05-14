/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NiyatApproverService } from './niyatApprover.service';

describe('Service: NiyatApprover', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NiyatApproverService]
    });
  });

  it('should ...', inject([NiyatApproverService], (service: NiyatApproverService) => {
    expect(service).toBeTruthy();
  }));
});
