import { LocalStorageService } from "./../../../../../auth/service/storage/localstorage.service";
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SmartDialogDeleteComponent } from "src/app/shared/componets/smart-dialog/smart-dialog-delete.component";
import { ApproverCatalogueService } from "../../service/approver-catalogue.service";
import { CommonService } from "../../../dashboard/service/common.service";

@Component({
  selector: 'app-reward-list',
  templateUrl: './reward-list.component.html',
  styleUrls: ['./reward-list.component.scss']
})
export class RewardListComponent implements OnInit {

  querymeter: string = "";
  
  columnsHeader = [
    {
      columnDef: "Its Number",
      header: "Its Number",
      dataName: (row: any) => `${row.itsNumber || "-"}`,
    },
    {
      columnDef: "name",
      header: "name",
      dataName: (row: any) => `${row.name || "-"}`,
    },
    {
      columnDef: "niyat",
      header: "niyat",
      dataName: (row: any) => `${row.niyatQuestion || "-"}`,
    },
    {
      columnDef: "trophy rewarded",
      header: "trophy rewarded",
      dataName: (row: any) => `${row.trophyRewards || "-"}`,
    },
  ];
  private destroy$ = new Subject();
  filteredList : any = [];
  searchList: any = [];
  search: string = '';


  constructor(
    private approverCatalogueService: ApproverCatalogueService,
    private localstorage: LocalStorageService,
    private changeDetection: ChangeDetectorRef,
    private toastrservice: ToastrService,
    public dialog: MatDialog,
    public commonservices: CommonService
  ) {}

  ngOnInit(): void {
    this.getRewardsList();
  }


  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

/******************************************************************************
   *
   * @brief Reward list
   * @param string event
   * @return none
   *
   ******************************************************************************/
 getRewardsList() {
  const itsId: any = this.localstorage.get("itsId");
  const searchQ:any = this.search;
 this.approverCatalogueService.approveRewardList(itsId,searchQ).pipe(takeUntil(this.destroy$)).subscribe((data) => {
    this.filteredList = data; 
    this.searchList  = data.filter((value:any, index:any, self:any) => index === self.findIndex((t:any) => (t.name === value.name)))
    this.changeDetection.detectChanges();
  });
}


  /******************************************************************************
   *
   * @brief Get Search List
   * @param null
   * @return none
   *
   ******************************************************************************/

   searchData(event: any) {
      this.search =event[0].name
      this.getRewardsList();
  }
}
