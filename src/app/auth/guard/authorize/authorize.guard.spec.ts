
import { async, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';

import { NotAuthorizedGuard } from './authorize.guard';
import { LocalStorageService } from '../../service/storage/localstorage.service';

describe('NotAuthorizedGuard', () => {
  let guard: NotAuthorizedGuard;
  let router: Router;
  let injector: TestBed;
  let LocalService: LocalStorageService
  let routerMock: any;
  let spy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotAuthorizedGuard, { provide: Router, useValue: routerMock},],
      imports: [HttpClientTestingModule ,
        BrowserAnimationsModule,
                    RouterModule.forRoot([]),]
    });
    guard = TestBed.inject(NotAuthorizedGuard);
    LocalService = TestBed.inject(LocalStorageService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });



  it('should be created wcs_private_operator', async(inject ([Router], (router) => {

    let userRole = JSON.parse(LocalService.get('role'));
    userRole = 'wcs_private_operator';
    spyOn(LocalService, 'get').and.returnValue('wcs_private_operator');
    // spyOn(router, 'navigate').and.callThrough();
    // expect(router).toHaveBeenCalled();
    // expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(userRole).toBe('wcs_private_operator');
  })));

  it('should be created wcs_public_operator', async () => {
    let userRole = JSON.parse(LocalService.get('role'));
    userRole = 'wcs_public_operator';
    spyOn(LocalService, 'get').and.returnValue('wcs_public_operator');
    // expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(userRole).toBe('wcs_public_operator');
  });

  it('should be created admin', async () => {
    let userRole = JSON.parse(LocalService.get('role'));
    userRole = "wcs_admin";
    spyOn(LocalService, 'get').and.returnValue("wcs_admin");
    // expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(userRole).toBe("wcs_admin");
  });

});
