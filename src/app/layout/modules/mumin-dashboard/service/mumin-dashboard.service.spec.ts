import { TestBed } from '@angular/core/testing';

import { MuminDashboardService } from './mumin-dashboard.service';

describe('MuminDashboardService', () => {
  let service: MuminDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MuminDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
