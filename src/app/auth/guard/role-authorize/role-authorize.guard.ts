import  jwt_decode  from 'jwt-decode';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../../service/storage/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class RoleAuthorizeGuard implements CanActivate {
  private token: any = this.LocalService.get('token');

  private allowedRoles: any[] = [];
  currentRoles: any[] = [];
  constructor( private route : Router, private LocalService: LocalStorageService){}



/******************************************************************************
 *
 * @brief canActivate check is user login or not bases of token and set some local storage of roles
 * @param route
 * @param state
 * return true and false bases of user login
 *
 ******************************************************************************/

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const decodedToken = jwt_decode(this.token);


      const userRole: any = this.LocalService.get('role');

      if(userRole){ this.currentRoles.push(JSON.parse(userRole));}
  
      if (this.token) {

        this.allowedRoles = route.data["roles"];
        if(this.allowedRoles === undefined) {
          this.navigate(userRole);
          return false
        }
        const allowed:boolean = this.currentRoles.filter((role: any)=>this.allowedRoles.includes(role)).length > 0;
        if(!allowed) {
          this.navigate(userRole);
        }
        return allowed;
    } else {
      this.navigate(userRole);
      return false
    }
  
  }


/******************************************************************************
 *
 * @brief navigate to default route.
 * @param none
 * return none
 *
 ******************************************************************************/

  navigate(userRole: any) {
    if(userRole  === 'Mumin') {
      this.route.navigate(['/login'])
    } else {
      this.route.navigate(['/admin/login'])
    }  
  }
  
}
