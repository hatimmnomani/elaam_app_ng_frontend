
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../service/auth.service';
import { DashboardComponent } from 'src/app/layout/modules/dashboard/components/dashboard/dashboard.component';
import { AuthModule } from '../../auth.module';

describe('LoginComponent ', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let toast: ToastrService;
  let authServiceStub: Partial<AuthService>;

  beforeEach(
    waitForAsync(() => {
      authServiceStub = {
        login(itsId, password) {
          if (itsId === "12341234") {
            return Promise.resolve({
              challengeName: "NEW_PASSWORD_REQUIRED"
            });
          } else if (itsId === "12341233") {
            return Promise.resolve({
              code: "NotAuthorizedException"
            });
          } else if (itsId === "123123") {
            return Promise.resolve({
              code: "NotAuthorizedException",
              message: "User is disabled."
            });
          } else if (itsId === "12341231") {
            return Promise.resolve({
              signInUserSession: {
                accessToken: {
                  jwtToken: "eyJraWQiOiJvWldSZDNQc2RhWUVIUkhJMEZsdEVydVpLVlVUc2lhYlFVcklCMkRsWEpnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5MjE1YTVjYy00OWM2LTRiMDEtYWVkMC0yZGQxZmIzMmM2Y2MiLCJjb2duaXRvOmdyb3VwcyI6WyJ3Y3NfYWRtaW4iXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfaVdWcGI1UURvIiwiY2xpZW50X2lkIjoiMmJlMGQ1cHNsZG4zb2tidXF0MjQwa210dmgiLCJvcmlnaW5fanRpIjoiNzZjNjkxOWEtMWZlOC00NDViLWE4OWYtMDhiYWQ2NmExZjY3IiwiZXZlbnRfaWQiOiJlOGZmZGNjYS1mYzVjLTRmMTQtOTMwZi03NWUzMmI3ZTk3MTYiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjM1NzU1MjY1LCJleHAiOjE2MzU3NTg4NjUsImlhdCI6MTYzNTc1NTI2NSwianRpIjoiNmYyMjkxNjEtMGFiNy00NzQ0LWJhZmYtYTc0ODUwOTJhNzliIiwidXNlcm5hbWUiOiI5MjE1YTVjYy00OWM2LTRiMDEtYWVkMC0yZGQxZmIzMmM2Y2MifQ.dHDxaGa5xYC6WBjsqfN7hN19caUqtJUuF1qjn8v88Oyr5WnXDmaqbQFHxYDt3zCNGqiu-WNvLBfqWEEdkK-6apLRehYJDBVLQiqOrG2r2cetowlUuOulLMisAw1_817o-TWB7yYjoRF1GoAgrotwEqRWep_qtK7tVWtEZOK70tDffYi5BdZuzw9VhBGSE5YcXp8vf90nWRhPfeEP07SzdYVhJ2E502o1gdnbsy1JtItda7foGz-EYrnWYDzJWcG4Iw4-PNQvhfBLPNmkHldw0o5mLMTUHB4OonNJUiQGGAIZaCTCbrR8yt1VhyHornkdvWflX260AQ489Tz9yU8zTg"
                }
              },
              attributes: {
                name: "wcs_admin"
              }
            });
          } else if (itsId === "12341234") {
            return Promise.resolve({
              signInUserSession: {
                accessToken: {
                  jwtToken: "eyJraWQiOiJvWldSZDNQc2RhWUVIUkhJMEZsdEVydVpLVlVUc2lhYlFVcklCMkRsWEpnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhN2ZjYjBlNi1jMDkxLTQxMTgtODU5YS01YThkNzEyZDNiM2UiLCJjb2duaXRvOmdyb3VwcyI6WyJ3Y3NfcHJpdmF0ZV9vcGVyYXRvciJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9pV1ZwYjVRRG8iLCJjbGllbnRfaWQiOiIyYmUwZDVwc2xkbjNva2J1cXQyNDBrbXR2aCIsIm9yaWdpbl9qdGkiOiI5M2UxYzE3OC1mNzBmLTRjODMtYjUxMC1mYmYwNjBkNmEzOGEiLCJldmVudF9pZCI6ImIzMzM0NWIwLWMxNDAtNDUwYy1hMzMxLTQ3MTg2ZjM1NjZlNSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2MzU3NTUxNTIsImV4cCI6MTYzNTc1ODc1MiwiaWF0IjoxNjM1NzU1MTUyLCJqdGkiOiJlY2E0YmM5My0zZjkyLTRiNWEtYWMxOS05NDA0ZGQ2NzAwYWIiLCJ1c2VybmFtZSI6ImE3ZmNiMGU2LWMwOTEtNDExOC04NTlhLTVhOGQ3MTJkM2IzZSJ9.nSnOvnZz6fU-Uzv_WYThYPXjuFxJlYhNBi2UZ7dzRl6buIBE5ERFqmfQYMa7nMvlm9TVGAyX93HlujyfbSPLwnNMh6aHqjiRNsj0Ah2xnsSOVZ7ke2yO7LQK83nLf_HPh1ITvsi1btrnczfMCw4s21MALN3xEzsR1d0RC1eSLspteUYocZCi2PkOPRmegkhEkNpvdF98cSSH6xaGnK7rId5au63IZb08f8spqnWLnxgcRs7Zca02NBaMu6HSF-WWqSnJ-9ubfUoC1Rol-eahRHwym-2VPKwxXFN1PGv_dTSmQbSODFzuOrN08-ukCMLDCO0UkC-krcN9HyAADwLl-w"
                }
              },
              attributes: {
                name: "wcs_private_operator"
              }
            });
          } else if (itsId === "1234") {
            return Promise.resolve({
              signInUserSession: {
                accessToken: {
                  jwtToken: "eyJraWQiOiJvWldSZDNQc2RhWUVIUkhJMEZsdEVydVpLVlVUc2lhYlFVcklCMkRsWEpnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJkMjczMmIxNy0zYzZlLTRlY2EtYTdlMy04MzMzMjM0OTQwN2MiLCJjb2duaXRvOmdyb3VwcyI6WyJ3Y3NfcHVibGljX29wZXJhdG9yIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX2lXVnBiNVFEbyIsImNsaWVudF9pZCI6IjJiZTBkNXBzbGRuM29rYnVxdDI0MGttdHZoIiwib3JpZ2luX2p0aSI6IjY4OTY0MmJhLTBkNDEtNDUwNi1iNjY2LWJmMzg1ZjhmYzY4MiIsImV2ZW50X2lkIjoiNThkMzgwZmEtMDRiZS00Mjk1LTgyZmMtOWU1YTI1ZGM5NGNmIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTYzNTc1NTQxMSwiZXhwIjoxNjM1NzU5MDExLCJpYXQiOjE2MzU3NTU0MTEsImp0aSI6ImVhN2FkNmVlLWIxMWUtNGRmNS1hYjZhLWU5OTQ5NzIwMWFhOSIsInVzZXJuYW1lIjoiZDI3MzJiMTctM2M2ZS00ZWNhLWE3ZTMtODMzMzIzNDk0MDdjIn0.I8Mq_al0FX-Prkend7qHvthWlsu_RbVQMvrVpa1J0ESbxtZx6M5rGj7ZUKNLKgtV8hzGxDPw2g-TK7btQtWVjB64WxZz7XR9FKhjcf2-udkblMJ1uC-bh-ywQc50PBBd3YPLoBXzKPh_1UROQRMZ1kEmtrEF799c44mmIskl5N-NTTLfTMcMNsw84HjZBQ1aZfyTH10pUtgj-YSporPVbOBQLYzg1b8fT0Xzbj4wBOAD7lFyARN6yOC4OOphXpmMmtAHo_dkj7tGs7RzQW8VHoVkvNPh_kwqif0YoQD5q8j_1cJ7cHoBdFLbnyAIjtEnWwpOgd5a0wrnBOSKGJITgA"
                }
              },
              attributes: {
                name: "wcs_public_operator"
              }
            });
          } else {
            return Promise.resolve({});
          }
        }
      };

      TestBed.configureTestingModule({
        declarations: [LoginComponent],
        imports: [
          AuthModule,
          BrowserAnimationsModule,
          RouterTestingModule.withRoutes([
            { path: 'dashboard', component: DashboardComponent }
          ]),
          ToastrModule.forRoot(),
          HttpClientTestingModule
        ],
        providers: [
          { provide: AuthService, useValue: authServiceStub }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    router = TestBed.inject(Router);
    toast = TestBed.inject(ToastrService);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    var store: any;

    spyOn(localStorage, 'getItem').and.callFake(function (key) {
      return store[key];
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#redirect should redirect to login page', () => {
    spyOn(router, 'navigate');
    component.redirect();
    expect(router.navigate).toHaveBeenCalledWith(['./forgot-password']);
  });


  // Form Test

  it('should have the empty value in the email and password control', () => {
    const input = fixture.nativeElement.querySelector('input');
    component.f.email.setValue('');
    component.f.password.setValue('');
    fixture.detectChanges();
    expect(input.value).toBe('');
  });



  it('should return stored remember from localStorage and set rememberCheckbox value True',
    () => {
      expect(localStorage.getItem('remember')).toBeUndefined();
      component.rememberCheckbox = true;
    });

  function setFormValues(fromData: any) {

    component.loginForm['controls']['email'].setValue(fromData.email);
    component.loginForm['controls']['password'].setValue(fromData.password);
  }

  it('should have form valid', () => {
    component.loginFm();
    const data = { email: 'wcs_admin@dispostable.com', password: 'Password@123' };
    setFormValues(data);
    expect(component.loginForm.valid).toBeTruthy();
  })


  it('should have password', () => {
    component.loginFm();
    const data = { email: 'wcs_admin@dispostable.com', password: 'Password@123' };
    setFormValues(data);
    expect(component.loginForm.get('password').value.length).toBeGreaterThan(0);
  })

  it('should have form valid', () => {
    component.loginFm();
    const data = { email: 'wcs_admin@dispostable.com', password: 'Password@123' };
    setFormValues(data);
    expect(component.loginForm.valid).toBeTruthy();
  })

  it('should set email and password if value available in localstorage', () => {
    localStorage.setItem('email', 'wcs_admin@dispostable.com');
    localStorage.setItem('password', 'Password@123');
    // expect(localStorage.getItem('email')).toEqual('wcs_admin@dispostable.com');
    // expect(localStorage.getItem('password')).toEqual('Password@123');
    component.loginForm.controls['email'].setValue('wcs_admin@dispostable.com');
    component.loginForm.controls['password'].setValue('Password@123');

    // expect(component.listSpinner).toBeFalse();
    // fixture.detectChanges();
  });





  it('should send true when selected', fakeAsync(() => {
    component.rememberCheckbox = false;
    fixture.detectChanges();
    // expect(inEl.nativeElement.checked).toBe(true);

  }));


  it('onSubmit() login form', () => {
    component.loginForm.controls['email'].setValue('wcs_admin@dispostable.com');
    component.loginForm.controls['password'].setValue('Password@123');
    expect(component.loginForm.valid).toBeTruthy();
    // spyOn(siteService, 'addSiteAsset')
    //     .and.returnValue(Observable.of(objAddSiteAssetResponse));
    // component.saveAsset();
  });

  it('should call get f()', () => {
    component.f;
  });

  it('#showOptions should update the variable rememberCheckbox', () => {
    component.showOptions({ checked: true });
    expect(component.rememberCheckbox).toBeTrue();
  });

  it('#onSubmit should return by doing nothing when form values are invalid', () => {
    component.onSubmit();
    expect(component.listSpinner).toBeFalse();
  });

  it('#onSubmit should navigate to reset password page if cognito returns challenge parameters', fakeAsync(() => {
    component.loginForm.patchValue({
      email: "newuser@tekmindz.com",
      password: "Admin@123"
    });
    spyOn(router, 'navigate');
    component.onSubmit();
    tick();
    flush();
    expect(router.navigate).toHaveBeenCalledWith(['/reset-password']);
  }));

  it('#onSubmit should display appropriate toast messages if credentials are not authorised', fakeAsync(() => {
    component.loginForm.patchValue({
      email: "fakeuser@tekmindz.com",
      password: "Admin@123"
    });
    spyOn(toast, 'error');
    component.onSubmit();
    tick();
    flush();
    expect(toast.error).toHaveBeenCalledWith("Please enter valid email and password");

    component.loginForm.patchValue({
      email: "disableduser@tekmindz.com",
    });
    component.onSubmit();
    tick();
    flush();
    expect(toast.error).toHaveBeenCalledWith("Operator is Inactive");
  }));

  it("onSubmit should redirect to /admin when logged in user's role is wcs_admin", fakeAsync(() => {
    component.loginForm.patchValue({
      email: "wcs_admin@dispostable.com",
      password: "Password@1234"
    });
    spyOn(router, 'navigate');
    component.onSubmit();
    tick();
    flush();
    expect(router.navigate).toHaveBeenCalledWith(["/admin"]);
  }));

  it("onSubmit should redirect to /dashboard when logged in user's role is wcs_private_operator", fakeAsync(() => {
    component.rememberCheckbox = true;
    component.loginForm.patchValue({
      email: "wcs_private@dispostable.com",
      password: "Password@1234"
    });
    spyOn(router, 'navigate');
    component.onSubmit();
    tick();
    flush();
    expect(router.navigate).toHaveBeenCalledWith(["admin/dashboard"]);
  }));

  it("onSubmit should redirect to /dashboard when logged in user's role is wcs_public_operator", fakeAsync(() => {
    component.loginForm.patchValue({
      email: "wcs_public@dispostable.com",
      password: "Password@1234"
    });
    spyOn(router, 'navigate');
    component.onSubmit();
    tick();
    flush();
    expect(router.navigate).toHaveBeenCalledWith(["admin/dashboard"]);

    component.loginForm.patchValue({
      email: "random@dispostable.com",
      password: "Password@1234"
    });
    component.onSubmit();
    tick();
    flush();
    expect(component.listSpinner).toBeFalse();
  }));

  it('#redirect should navigate to forgot password page', () => {
    spyOn(router, 'navigate');
    component.redirect();
    expect(router.navigate).toHaveBeenCalledWith(["./forgot-password"])
  });

});
