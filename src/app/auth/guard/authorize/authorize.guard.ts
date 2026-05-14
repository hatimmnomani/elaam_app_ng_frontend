
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LocalStorageService } from '../../service/storage/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class NotAuthorizedGuard implements CanActivate {

  constructor(private router: Router, private LocalService: LocalStorageService) { }



/******************************************************************************
 *
 * @brief canActivate check which user active in application now
 * @param none
 * return check active user and redirect bases of role in module
 *
 ******************************************************************************/

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    const token: any = this.LocalService.get('token')
    let userRole: any = this.LocalService.get("role");
    let userRolePermission = JSON.parse(userRole)
    if (token && userRolePermission) {
      switch (userRolePermission[0]) {
        case "Super Admin":
          this.router.navigate(["/admin/dashboard"]);
          break;

        case "Template Creator":
          this.router.navigate(["/admin/niyat-template"]);
          break;

          case "Data Entry Operator":
          this.router.navigate(["/admin/niyat-data"]);
          break;

          case "Mumin":
            this.router.navigate(["/mumin-dashboard"]);
            break;


        default:
          this.router.navigate(["/admin/dashboard"]);
          break;      
      }
      return false
    } else {
      return true
    }
  }

}
