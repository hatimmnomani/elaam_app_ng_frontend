
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { TokenInterceptor } from './token.interceptor';
import { LoginComponent } from '../components/login/login.component';
import { SpinnerService } from 'src/app/shared/services/spinner/spinner.service';
import { environment } from 'src/environments/environment';

describe('TokenInterceptor', () => {
  let interceptor: TokenInterceptor;
  let spinner: SpinnerService;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;
  let toast: ToastrService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule.withRoutes([
        { path: 'login', component: LoginComponent }
      ]),
      ToastrModule.forRoot()
    ],
    providers: [
      TokenInterceptor,
      { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    ]
  }));

  beforeEach(() => {
    interceptor = TestBed.inject(TokenInterceptor);
    spinner = TestBed.inject(SpinnerService);
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    toast = TestBed.inject(ToastrService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('Authorisation header should be added to the request', () => {
    localStorage.setItem("token", "token");
    http.get(`${environment.serverUrl}/countries`).subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const req = httpTestingController.expectOne(r => r.headers.has('Authorization') && r.url === `${environment.serverUrl}/countries`);
    expect(req.request.method).toEqual('GET');
    req.flush({
      "data": [
        {
          "id": 1,
          "countryName": "United States",
          "shortName": "US",
          "phoneCode": "1"
        }
      ],
      "error": false
    });
  });

  it('spinner show/hide should be called for error response and error block should be executed', () => {
    spyOn(toast, 'info');
    spyOn(toast, 'error');
    http.get(`${environment.serverUrl}/countries`).subscribe((res) => { }, (err) => {
      expect(err).toBeTruthy();
    });
    http.get(`${environment.serverUrl}/countries`).subscribe((res) => { }, (err) => {
      expect(err).toBeTruthy();
    });
    http.get(`${environment.serverUrl}/countries`).subscribe((res) => { }, (err) => {
      expect(err).toBeTruthy();
    });
    http.get(`${environment.serverUrl}/countries`).subscribe((res) => { }, (err) => {
      expect(err).toBeTruthy();
    });
    const req = httpTestingController.match(`${environment.serverUrl}/countries`);
    expect(req[0].request.method).toEqual('GET');
    req[0].flush("deliberate 401 error", { status: 501, statusText: 'Access denied' });
    expect(toast.info).toHaveBeenCalledWith("Session Expired, please login again to continue.");

    req[1].flush("deliberate 500 error", { status: 500, statusText: 'Internal server error' });
    expect(toast.error).toHaveBeenCalledWith("The server found an unexpected error. Try again later!");

    req[2].flush("deliberate 400 error", { status: 400, statusText: 'Some Error' });
    req[3].flush("deliberate 404 error", { status: 404, statusText: 'Not found' });
  });
});
