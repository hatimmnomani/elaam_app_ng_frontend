
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LocalStorageService } from '../../service/storage/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {

  constructor(private router: Router, private LocalService: LocalStorageService) {}


  /******************************************************************************
 *
 * @brief canActivate used to call the checklogin which consumes the route url.
 * @param none
 * return the boolean value by which it autheticates the user.
 *
 ******************************************************************************/

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;

  return this.checkLogin(url);

}


/******************************************************************************
 *
 * @brief checkLogin check is user login or not bases of token
 * @param url
 * return true and false bases of user login
 *
 ******************************************************************************/
checkLogin(url: string): boolean {
  const token = this.LocalService.get('token')
  if (!token) {
    let mumin: any = this.LocalService.get('role')
    if(mumin === 'Mumin') {
      this.router.navigate(['/login'])
    } else {
      this.router.navigate(['/admin/login'])
    }   
    return false;
} else {
  return true
 }





}

}
