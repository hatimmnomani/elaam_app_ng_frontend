import { Router } from "@angular/router";
import { LocalStorageService } from "./../../../auth/service/storage/localstorage.service";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { SidenavService } from "../../services/sidebar/sidenav.service";
import { NotificationService } from "src/app/layout/modules/notification/services/notification.service";
import { takeUntil } from "rxjs/operators";
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { SharedataService } from "../../services/sharedata.service";
import * as moment from "moment";
import { SendMessageService } from "src/app/layout/modules/send-message/service/send-message.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})

export class HeaderComponent implements OnInit {
  private _mobileQueryListener!: () => void;
  mobileQuery: MediaQueryList;
  userrole: string | null;
  private destroy$ = new Subject();
  notification = new BehaviorSubject<any>("");
  notification$ = this.notification.asObservable();

  badge = new BehaviorSubject<any>("");
  badge$ = this.badge.asObservable();
  username: string | null;
  toReplace = /[<>]/g;
  subscription: Subscription;
  switchedtoUser: any = null;
  multipleIds: any = [];
  selectedVal: any ;
  label: string;
  displayData: any = [];
  showSwitchUser: boolean = false;
 isQrCode:any="false"
  constructor(
    private sideNavService: SidenavService,
    media: MediaMatcher,
    private localService: LocalStorageService,
    private router: Router,
    private localstorage: LocalStorageService,
    private changeDetectorRef: ChangeDetectorRef,
    private sharedata: SharedataService,
    public notificationservice: NotificationService,
    public sendmessageservice: SendMessageService,
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 768px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.isQrCode=this.localstorage.get("isQrCode");
  }
 
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.showSwitchUser = (this.router.url.indexOf("dashboard") >= 0) ? true : false;

    this.router.events.subscribe(value => {
      this.showSwitchUser = (this.router.url.indexOf("dashboard") >= 0) ? true : false;
    });

    this.username = this.localService.get("name");
    const data: any = this.localService.get("role");
    this.userrole = JSON.parse(data);
    if(this.localService.get("multipleRoles") != null){
      const roles:any = this.localService.get("multipleRoles");
      this.switchedtoUser = JSON.parse(roles).filter((val: any) => {
        return val.authority !== this.userrole
      });
    }

    if(this.localService.get('MultipleJamaatIds') != undefined && (this.userrole === 'Aamil' || this.userrole==='Muavin Aamil' || this.userrole === 'Khidmat Ramadaniyah')){
      const ids:any = this.localService.get("MultipleJamaatIds");
      this.multipleIds = JSON.parse(ids);
      this.selectedVal = parseInt(this.localService.get('JamaatId') || '{}');
      this.label = 'JamaatId';

      this.sendmessageservice.getDataByID("getAllJamaat",'')
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          data.filter((val: any) => {
            if(this.multipleIds.indexOf(val.id) > -1){
              this.displayData.push({'name' : val.jamaatName, 'id' : val.id})
              if(this.selectedVal == val.id){
                this.localService.set('activeJamaatName', val.jamaatName);
              }
            }
          });
          this.changeDetectorRef.detectChanges();
        })  
    }
    if(this.localService.get('MultipleJamiatIds') != undefined && this.userrole === 'Jamiat Masool' ){
      const ids:any = this.localService.get("MultipleJamiatIds");
      this.multipleIds = JSON.parse(ids);
      this.selectedVal = parseInt(this.localService.get('JamiatId') || '{}');
      this.label = 'JamiatId';
      this.sendmessageservice.getDataByID("getAllJamiat",'')
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          data.filter((val: any) => {
            if(this.multipleIds.indexOf(val.id) > -1){
              this.displayData.push({'name' : val.jamiatName, 'id' : val.id})
              if(this.selectedVal == val.id){
                this.localService.set('activeJamiatName', val.jamiatName);
              }
            }
          });
          this.changeDetectorRef.detectChanges();
        })  
    }
    if(this.localService.get('MultipleUmoorIds') != undefined && this.userrole === 'Umoor Coordinator'){
      const ids:any = this.localService.get("MultipleUmoorIds");
      this.multipleIds = JSON.parse(ids);
      this.selectedVal = parseInt(this.localService.get('UmoorId') || '{}');
      this.label = 'UmoorId';

      this.sendmessageservice.getDataByID("getAllUmoor",'')
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          data.filter((val: any) => {
            if(this.multipleIds.indexOf(val.umoorId) > -1){
              this.displayData.push({'name' : val.umoorName, 'id' : val.umoorId})
            }
            if(this.selectedVal == val.umoorId){
              this.localService.set('activeUmoorName', val.umoorName);
            }
          });
          this.changeDetectorRef.detectChanges();
        }) 
    }

    this.subscription = this.sharedata.currentMessage.subscribe(message => {
      if(message === 'reload-notification') {
        this.getNotification()
      }
    })

    //emit value in sequence every 30 seconds
    // this.subscription = interval(30000).subscribe(
    //   (val:any) => { this.getNotification()});

    this.getNotification();
  }



  /******************************************************************************
   *
   * @brief Get Time Format
   * @param time
   * @return none
   *
   ******************************************************************************/
  getTime(seconds: any) {
      seconds = Number(seconds);
      var d = Math.floor(seconds / (3600*24));
      var h = Math.floor(seconds % (3600*24) / 3600);
      var m = Math.floor(seconds % 3600 / 60);
      var s = Math.floor(seconds % 60);
      
      var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ago ") : "";
      var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ago ") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ago ") : "";
      var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds ago") : "";

      // return dDisplay + hDisplay + mDisplay + sDisplay;
      return (d > 0) ? dDisplay : (h > 0) ? hDisplay : (m > 0) ? mDisplay : sDisplay; 
  }

  /******************************************************************************
   *
   * @brief Get Notification
   * @param none
   * @return none
   *
   ******************************************************************************/
  getNotification(): void {
    const data: any = this.localstorage.get("itsId");
    const itsId: any = JSON.parse(data);
    const getNotification = 'UNREADMESSAGE'
    this.notificationservice.getNotificationPaginated(itsId, getNotification).pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.notification.next(data?.notificationData);
        this.badge.next(data?.pagination?.totalRecords);

      });
  }

  /******************************************************************************
   *
   * @brief Read Notification
   * @param none
   * @return none
   *
   ******************************************************************************/
  getReadNotification(notificationId: any) {
    this.notificationservice
      .getReadNotification(notificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.getNotification();
      });
  }

  /******************************************************************************
   *
   * @brief logout clear the local storage value of current user
   * @param none
   * return redirect to clear local data
   *
   ******************************************************************************/
  logout() {
    // Clear shared selections/state first to prevent stale propagation
    try {
      this.sharedata.clearSelectedMonthValue();
      this.sharedata.clearDashboardState();
    } catch { /* noop */ }
    if (this.userrole === "Mumin") {
      this.router.navigate(["/login"]);
    } else {
      this.router.navigate(["/admin/login"]);
    }
    this.localstorage.clear();
  }

  /******************************************************************************
   *
   * @brief navigate to default route.
   * @param none
   * return none
   *
   ******************************************************************************/

  navigatetoDefault() {
    if (this.userrole === "Mumin") {
      this.router.navigate(["/mumin-dashboard"]);
    } else {
      this.router.navigate(["admin/dashboard"]);
    }
  }

  /******************************************************************************
   *
   * @brief sidenav service called to toggle the sidebar for mobile device.
   * @param none
   * return none
   *
   ******************************************************************************/

  toggleSidenav() {
    this.sideNavService.toggle();
  }

  switchUser(){
    let switchTo:any = this.localService.get("switchLocation");
    window.location.href = switchTo;
  }

  setNewVal(event:any){
    this.localService.set(this.label, event);
    window.location.reload();
  }
}
