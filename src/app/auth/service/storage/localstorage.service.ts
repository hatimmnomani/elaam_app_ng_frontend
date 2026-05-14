
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {


/******************************************************************************
 *
 * @brief set local storage key
 * @param key value
 * return set local storage key
 *
 ******************************************************************************/

  set(key: string, value: string) {
    localStorage.setItem(key, value);
  }


/******************************************************************************
 *
 * @brief get local storage key
 * @param key
 * return get local storage key
 *
 ******************************************************************************/
  get(key: string) {
    return localStorage.getItem(key);
  }


/******************************************************************************
 *
 * @brief remove local storage key
 * @param key
 * return remove local storage key
 *
 ******************************************************************************/

  remove(key: string) {
    localStorage.removeItem(key);
  }



/******************************************************************************
 *
 * @brief clear local storage all
 * @param none
 * return clear local storage all
 *
 ******************************************************************************/
  clear() {
    let remember: any = localStorage.getItem('remember');
    let isQrCode: any = localStorage.getItem('isQrCode');
    let templateId: any = localStorage.getItem('templateId');
    let itsId: any = localStorage.getItem('itsId');
    let password: any  = localStorage.getItem('password');
    localStorage.clear();
    localStorage.setItem('remember',remember);
    localStorage.setItem('templateId',templateId);
    localStorage.setItem('isQrCode',isQrCode);
    localStorage.setItem('itsId',itsId);
    localStorage.setItem('password',password);
    sessionStorage.clear();
  }
}
