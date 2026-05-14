/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SendMessageService } from './send-message.service';

describe('Service: SendMessage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SendMessageService]
    });
  });

  it('should ...', inject([SendMessageService], (service: SendMessageService) => {
    expect(service).toBeTruthy();
  }));
});
