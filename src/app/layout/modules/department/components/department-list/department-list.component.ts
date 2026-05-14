import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { DepartmentService } from "../../services/department.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CommonService } from "../../../dashboard/service/common.service";

@Component({
  selector: "app-department-list",
  templateUrl: "./department-list.component.html",
  styleUrls: ["./department-list.component.scss"],
})
export class DepartmentListComponent implements OnInit {
  columnsHeader = [
    {
      columnDef: "departmentName",
      header: "department name",
      dataName: (row: any) => `${row.departmentName || "-"}`,
    },
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
      dataName: (row: any) => `${row.userStatus}`,
    },
    {
      columnDef: "action",
      header: "Action",
      dataName: (row: any) => `${row.status}`,
    },
  ];

  departmentList: any[] = [];
  private destroy$ = new Subject();

  constructor(
    private toastrservice: ToastrService,
    private departmentservice: DepartmentService,
    private changeDetection: ChangeDetectorRef,
    private router: Router,
    public commonservices: CommonService
  ) {}

  ngOnInit() {
    this.getDepartmentList();
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
  getDepartmentList(): void {
    this.departmentservice.getDepartmentList()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.departmentList = data;
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
      this.departmentservice
        .getStatusDepartment(event.statusRow.departmentId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            this.toastrservice.success(this.commonservices.toTitleCase(res.message));
            this.getDepartmentList();
          },
          (error) => {
            console.log(error);
          }
        );
    } 
    if (event.update) {
      let lId =  btoa(event.update.departmentId);
      this.router.navigateByUrl(`/admin/department/edit/${lId}`);
    }
  }
}
