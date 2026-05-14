import { AppRoutingModule } from './app-routing.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToastrModule } from 'ngx-toastr';
import { NotAuthorizedGuard } from './auth/guard/authorize/authorize.guard';
import { AuthorizeGuard } from './auth/guard/not-authorize/not-authorize.guard';
import { ResponseSpinnerInterceptor } from './auth/interceptor/response-spinner.interceptor';
import { TokenInterceptor } from './auth/interceptor/token.interceptor';
import { RoleAuthorizeGuard } from './auth/guard/role-authorize/role-authorize.guard';

import { PrivacyPolicyComponent } from './privacuPolicy/privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [
    AppComponent,
  
    PrivacyPolicyComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(
      {
        timeOut: 2000,
        resetTimeoutOnDuplicate: true,
        preventDuplicates: true,
        positionClass: 'toast-top-right',
      }
    ),
  ],
  providers: [
    NotAuthorizedGuard,
    AuthorizeGuard,
    RoleAuthorizeGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseSpinnerInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
