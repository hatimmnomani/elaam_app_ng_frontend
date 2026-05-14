import { TestBed } from '@angular/core/testing';

import { RoleAuthorizeGuard } from './role-authorize.guard';

describe('RoleAuthorizeGuard', () => {
  let guard: RoleAuthorizeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleAuthorizeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
