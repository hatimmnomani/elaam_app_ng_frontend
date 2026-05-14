
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SpinnerService } from 'src/app/shared/services/spinner/spinner.service';

@Injectable()
export class ResponseSpinnerInterceptor implements HttpInterceptor {

  constructor(private spinnerSr: SpinnerService) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.spinnerSr.show();

    return next
      .handle(req)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // this.spinnerSr.hide();
            setTimeout(() => { this.spinnerSr.hide(); }, 0);
          }
        }, (error) => {
          setTimeout(() => { this.spinnerSr.hide(); }, 0);
        })
      );
  }
}
