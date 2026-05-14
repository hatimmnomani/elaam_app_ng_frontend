import { TestBed } from '@angular/core/testing';

import { ApproverCatalogueService } from './approver-catalogue.service';

describe('ApproverCatalogueService', () => {
  let service: ApproverCatalogueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApproverCatalogueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
