
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { LocalStorageService } from './storage/localstorage.service';
import { SharedataService } from 'src/app/shared/services/sharedata.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedInUser: any;

  constructor(private LocalService: LocalStorageService, private http: HttpClient, private sharedataService: SharedataService) { }



/******************************************************************************
 *
 * @brief isLoggedIn check user login bases of token
 * @param none
 * return true and false value
 *
 ******************************************************************************/

  isLoggedIn(): boolean {
    ///TODO: Check for out of date.
    if (this.token()) {
      return true;
    }
    return false;
  }


/******************************************************************************
 *
 * @brief login we set here local storage token and accountname after user login
 * @param itsId
 * @param password
 * return loggedInUser all data of user
 *
 ******************************************************************************/

  login(body:any): Observable<any> {
    return this.http
      .post<any>(`${environment.serverUrl}/authenticate`, body)
      .pipe(
        map((data: any) => {
          if (data != null) {
            this.LocalService.set("token", data.token);
            this.LocalService.set("refreshToken", data.refreshToken);
            // const decodedToken = jwt_decode(data.token);
            return data;
          }
          return null;
        }),
      )
  }



/******************************************************************************
 *
 * @brief logout login user
 * @param none
 * return logout login user
 *
 ******************************************************************************/
  logout() {
    // Clear shared selections/state first to prevent stale propagation after redirect
    try {
      this.sharedataService.clearSelectedMonthValue();
      this.sharedataService.clearDashboardState();
    } catch { /* noop */ }
    this.LocalService.clear();
  }

/******************************************************************************
 *
 * @brief get login user token
 * @param none
 * return get login user token
 *
 ******************************************************************************/
  token(): string {
    let token: any = this.LocalService.get('token');
    return token;
  }


  /******************************************************************************
   *
   * @brief refersh token
   * @param idts id
   * @param token
   * return none
   *
  ******************************************************************************/

  refershToken(itsId: any, refershtoken:any, isMumin: boolean): Observable<any> {
    const body = {itsId: itsId, refreshToken: refershtoken, isMumin: isMumin}

    return this.http
      .post<any>(`${environment.serverUrl}/useRefreshToken`, body)
      .pipe(
        map((data: any) => {
          if (data) {
            return data;
          }
          return null;
        }),
      )
  }
}
