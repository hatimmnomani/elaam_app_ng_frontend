import { AuthService } from './../../../auth/service/auth.service';
import { LocalStorageService } from './../../../auth/service/storage/localstorage.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { SidenavService } from 'src/app/shared/services/sidebar/sidenav.service';
import { SpinnerService } from 'src/app/shared/services/spinner/spinner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {
  public subscription: Subscription = new Subscription;
  listSpinner = false;

  @ViewChild('sidenav', { static: true }) public sidenav!: MatSidenav;

  private _mobileQueryListener!: () => void;
  mobileQuery: MediaQueryList;
  opened: boolean = false;
  isMumin: boolean;
  routerUrl: string;


  constructor(
    public spinnerServiceSr: SpinnerService,
    private sideNavService: SidenavService,
    private router: Router,
    private authService: AuthService,
    private LocalService: LocalStorageService,
    media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 768px)");
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this.subscription.unsubscribe();

  }

  ngOnInit(): void {
    this.sideNavService.sideNavToggleSubject.subscribe(() => {
      this.sidenav.toggle()
      this.routerUrl = this.router.url;

    });
    this.mobileQuery.matches ? this.opened = false : this.opened = true;
    this.configureRefreshToken();
  }

  /******************************************************************************
   *
   * @brief configureRefreshToken refresing the session every 59 min and set token in local storage
   * @param none
   * return refresing the session
   *
   ******************************************************************************/
  configureRefreshToken() {
    
    setInterval(() => {
      const refershToken =  this.LocalService.get("refreshToken");
      const itsId = this.LocalService.get("itsId");
        if(this.routerUrl.includes('admin')) {
          this.isMumin = false
        } else {
          this.isMumin = true
        }
      this.authService.refershToken(itsId, refershToken, this.isMumin).subscribe( 
        (data: any)  =>  {
          this.LocalService.set("token", data.token);
        },
        error => {
          console.log(error);
        });
    }, 3540000);
  }

  /******************************************************************************
 *
 * @brief open and close sidebar for phone.
 * @param none
 * return none
 *
 ******************************************************************************/
  open() {
    this.opened = true;
  }
  close() {
    this.opened = false;
  }

}
