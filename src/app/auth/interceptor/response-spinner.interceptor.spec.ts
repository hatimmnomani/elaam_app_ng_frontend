
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SpinnerService } from 'src/app/shared/services/spinner/spinner.service';
import { environment } from 'src/environments/environment';
import { ResponseSpinnerInterceptor } from './response-spinner.interceptor';

describe('ResponseSpinnerInterceptor', () => {

  let interceptor: ResponseSpinnerInterceptor;
  let spinner: SpinnerService;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      ResponseSpinnerInterceptor,
      { provide: HTTP_INTERCEPTORS, useClass: ResponseSpinnerInterceptor, multi: true },
    ]
  }));

  beforeEach(() => {
    interceptor = TestBed.inject(ResponseSpinnerInterceptor);
    spinner = TestBed.inject(SpinnerService);
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('spinner show/hide should be called for success response and success block should be executed', () => {
    spyOn(spinner, 'show');
    spyOn(spinner, 'hide');
    http.get(`${environment.serverUrl}/countries`).subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const req = httpTestingController.expectOne(`${environment.serverUrl}/countries`);
    expect(req.request.method).toEqual('GET');
    expect(spinner.show).toHaveBeenCalled();
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
    spyOn(spinner, 'show');
    spyOn(spinner, 'hide');
    http.get(`${environment.serverUrl}/countries`).subscribe((res) => {}, err => expect(err).toBeTruthy());
    const req = httpTestingController.expectOne(`${environment.serverUrl}/countries`);
    expect(req.request.method).toEqual('GET');
    expect(spinner.show).toHaveBeenCalled();
    req.error(new ErrorEvent("error"));
  });
});