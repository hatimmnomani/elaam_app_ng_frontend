/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UmoorService } from './umoor.service';

describe('Service: Umoor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UmoorService]
    });
  });

  it('should ...', inject([UmoorService], (service: UmoorService) => {
    expect(service).toBeTruthy();
  }));
});
