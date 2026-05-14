import { UmoorService } from './../services/umoor.service';
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from '../../dashboard/service/common.service';

@Component({
  selector: "app-umoor-list",
  templateUrl: "./umoor-list.component.html",
  styleUrls: ["./umoor-list.component.scss"],
})
export class UmoorListComponent implements OnInit {
  columnsHeader = [
    {
      columnDef: "umoor",
      header: "umoor",
      dataName: (row: any) => `${row.umoorName || "-"}`,
    },
    {
      columnDef: "phonenumber",
      header: "phone no.",
      dataName: (row: any) => `${row.phoneNumber || "-"}`,
    },
    {
      columnDef: "emailid",
      header: "email id",
      dataName: (row: any) => `${row.emailId || "-"}`,
    },
    {
      columnDef: "status",
      header: "Status",
      dataName: (row: any) => `${row.userStatus || '-'}`,
    },
    {
      columnDef: "action",
      header: "Action",
      dataName: (row: any) => `${row.status}`,
    },
  ];

  umoorList: any[] = [];
  private destroy$ = new Subject();
  
  constructor(
    private umoorservice: UmoorService,     
    private toastrservice: ToastrService,
    private changeDetection: ChangeDetectorRef,
    private router: Router,
    public commonservices: CommonService
  ) {}

  ngOnInit() { 
    this.getUmoorList()
  }

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

  /******************************************************************************
   *
   * @brief Get meter reading
   * @param id
   * @return none
   *
   ******************************************************************************/
  getUmoorList(): void {
    this.umoorservice.getUmoorList().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.umoorList = data;
      this.changeDetection.detectChanges();
    });
  }

  /******************************************************************************
   *
   * @brief fetch record data
   * @param string event
   * @return none
   *
   ******************************************************************************/

  fetchedRecord(event: any) {
    if (event.statusRow) {
      this.umoorservice.changeUmoorStatusByID(event.statusRow.umoorId)
        .pipe(takeUntil(this.destroy$)).subscribe(
          (res) => {
            this.toastrservice.success(this.commonservices.toTitleCase(res.message));
            this.getUmoorList();
          },
          (error) => {
            console.log(error);
          }
        );
    } 
    if (event.update) {
      let lId =  btoa(event.update.umoorId);
      this.router.navigateByUrl(`/admin/umoor/edit/${lId}`);
    }
  }
}
