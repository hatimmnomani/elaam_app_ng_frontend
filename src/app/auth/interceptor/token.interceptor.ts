import { LocalStorageService } from './../service/storage/localstorage.service';

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthService,
    private router: Router,
    private LocalService: LocalStorageService,
    private toastservice: ToastrService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const isLoggedIn = this.authenticationService.isLoggedIn();
    const isApiUrl = request.url.startsWith(environment.serverUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authenticationService.token()}`,
        },
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status === 401 || error && error.status === 501) {
          let mumin: any = this.LocalService.get('role')
          if(JSON.parse(mumin)  === "Mumin") {
            this.router.navigate(['/login'])
          } else {
            this.router.navigate(['/admin/login'])
          }        
          this.toastservice.info('Session Expired, please login again to continue.');
          this.authenticationService.logout();
        } else if (error && error.status === 500) {
          if (error.error) {
            this.toastservice.error('The server found an unexpected error. Try again later!');
          }
        } else if (error && error.status === 400) {
          if (error.error.errorMessage) {
            this.toastservice.error(error.error.errorMessage);
          }
        }else if (error && error.status === 404) {
          if (error.error.errorMessage) {
            this.toastservice.error(error.error.errorMessage);
          }
        }
        return throwError(error);
      })
    );
  }
}
