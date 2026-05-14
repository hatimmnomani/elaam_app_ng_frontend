import { LocalStorageService } from "./../../../../../auth/service/storage/localstorage.service";
import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SmartDialogDeleteComponent } from "src/app/shared/componets/smart-dialog/smart-dialog-delete.component";
import { ApproverCatalogueService } from "../../service/approver-catalogue.service";
import { CommonService } from "../../../dashboard/service/common.service";


@Component({
  selector: 'app-catalogue-reward',
  templateUrl: './catalogue-reward.component.html',
  styleUrls: ['./catalogue-reward.component.scss']
})
export class CatalogueRewardComponent implements OnInit {

  imgPath = "../assets/images/catelogue.png";
  catalogueRedeemLoading = new BehaviorSubject<any>("");
  catalogueList$ = this.catalogueRedeemLoading.asObservable();
  private destroy$ = new Subject();

  redeemTrophiesData = new BehaviorSubject<any>("");
  redeemTrophiesData$ = this.redeemTrophiesData.asObservable();
  dialogRef: any;
  userRole:any;
  myAchievements:any=[];
  redeemYourTrophy:any=[];
  constructor(
    private approverCatalogueService: ApproverCatalogueService,
    private localstorage: LocalStorageService,
    private toastrservice: ToastrService,
    public dialog: MatDialog,
    public commonservices: CommonService
  ) {
    this.catalogueList$.subscribe(item =>{
      this.myAchievements = item?.APPROVERS?.filter((item:any) =>item?.ack>0);
      this.redeemYourTrophy= item?.APPROVERS?.filter((item:any) =>item?.status==="ACTIVE");
     
     })
  }

  ngOnInit() {
    let role:any = this.localstorage.get("role");
    this.userRole = JSON.parse(role);
    this.getCatalogueReedemList();
    this.getRedeemStatusTrophies();
  }

/******************************************************************************
   *
   * @brief catalogue Redeem list
   * @param string event
   * @return none
   *
   ******************************************************************************/
 getCatalogueReedemList() {
  this.approverCatalogueService
    .getAllActiveCatalogues()
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (data) => {
        this.catalogueRedeemLoading.next(data);
      },
      (error) => {
        console.log(error);
      }
    );
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
        this.redeemBlueTrophies(result.id);
      }
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
   * @brief Redeem Tropies
   * @param catalogueId
   * @return none
   *
   ******************************************************************************/
   redeemBlueTrophies(catalogueId: number) {
    const itsId: any = this.localstorage.get("itsId");
    this.approverCatalogueService
      .redeemBlueTrophies(itsId, catalogueId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.toastrservice.success(this.commonservices.toTitleCase(data.message));
        this.getRedeemStatusTrophies();
      });
  }


/******************************************************************************
   *
   * @brief Redeem Status Trophies
   * @param none
   * @return none
   *
   ******************************************************************************/
 getRedeemStatusTrophies() {
  const itsId: any = this.localstorage.get("itsId");
  this.approverCatalogueService
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
