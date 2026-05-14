import { LocalStorageService } from "./../../../../../auth/service/storage/localstorage.service";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SmartDialogDeleteComponent } from "src/app/shared/componets/smart-dialog/smart-dialog-delete.component";
import { CatalogueService } from "../../../catalogue/service/catalogue.service";
import { MuminDashboardService } from "../../service/mumin-dashboard.service";
import { CommonService } from "../../../dashboard/service/common.service";

@Component({
  selector: "app-catalogue-redeem",
  templateUrl: "./catalogue-redeem.component.html",
  styleUrls: ["./catalogue-redeem.component.scss"],
})
export class CatalogueRedeemComponent implements OnInit {
  imgPath = "../assets/images/catelogue.png";
  customerProfileLoading = new BehaviorSubject<any>("");
  catalogueList$ = this.customerProfileLoading.asObservable();
  private destroy$ = new Subject();
  myAchievements:any=[];
  redeemYourTrophy:any=[];

  redeemTrophiesData = new BehaviorSubject<any>("");
  redeemTrophiesData$ = this.redeemTrophiesData.asObservable();
  dialogRef: any;

  constructor(
    private muminDashboardSr: MuminDashboardService,
    private localstorage: LocalStorageService,
    private toastrservice: ToastrService,
    private catalogueService: CatalogueService,
    public dialog: MatDialog,
    public commonservices: CommonService
  ) {
    this.catalogueList$.subscribe(item =>{
      this.myAchievements = item?.MUMIN?.filter((item:any) =>item?.ack>0);
      this.redeemYourTrophy= item?.MUMIN?.filter((item:any) =>item?.status==="ACTIVE");
     })
  }

  ngOnInit() {
    this.getCatalogueReedemList();
    this.getRedeemStatusTrophies();
  
  }
  /******************************************************************************
   *
   * @brief catalogue Reedem list
   * @param string event
   * @return none
   *
   ******************************************************************************/
  getCatalogueReedemList() {
    this.catalogueService
      .getCatalogueList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.customerProfileLoading.next(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

  /******************************************************************************
   *
   * @brief Confirm Reedem form popup
   * @param string event
   * @return none
   *
   ******************************************************************************/
  redeemConfirm(event: any) {
    const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
      data: {
        mumin: true,
        heading: "REDEEM NOW",
        subtext: "Trophies will be consumed from your trophy balance.",
        record: event,
        buttonSubmit:'Confirm',buttonCancel:'Cancel'
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.redeemTrophies(result.id);
      }
    });
  }

  /******************************************************************************
   *
   * @brief Redeem Tropies
   * @param catalogueId
   * @return none
   *
   ******************************************************************************/
  redeemTrophies(catalogueId: number) {
    const itsId: any = this.localstorage.get("itsId");
    this.muminDashboardSr
      .redeemTrophies(itsId, catalogueId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.toastrservice.success(this.commonservices.toTitleCase(data.message));
        this.getRedeemStatusTrophies();
      });
  }

  // ********* Image view
viewImage(imgPath:any){
  {
    if(imgPath!==null && imgPath!==""){
    const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
      data: { buttonClose:true, imageScanPath: imgPath},
    });
  }
  }
}

  /******************************************************************************
   *
   * @brief Redeem Status Tropies
   * @param none
   * @return none
   *
   ******************************************************************************/
  getRedeemStatusTrophies() {
    const itsId: any = this.localstorage.get("itsId");
    this.muminDashboardSr
      .getRedeemStatusTrophies(itsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.redeemTrophiesData.next(data);
      });
  }

  catalogueInfo(title:any, description:any){
    const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
      data: {'catalogue': true, 'title': title, 'description': description, record: event, buttonClose:true},
    });
  }

  againCall(){
    this.getCatalogueReedemList();
    this.getRedeemStatusTrophies(); 
  }

}
