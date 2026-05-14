import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { KhidmatRamadaniyahService } from '../../services/khidmat-ramadaniyah.service';
import { CommonService } from '../../../dashboard/service/common.service';
import { LocalStorageService } from '../../../../../auth/service/storage/localstorage.service';
import { ServerSideSmartTableComponent } from '../../../../../shared/componets/server-side-smart-table/server-side-smart-table.component';

@Component({
  selector: 'app-khidmat-ramadaniyah-list',
  templateUrl: './khidmat-ramadaniyah-list.component.html',
  styleUrls: ['./khidmat-ramadaniyah-list.component.scss']
})
export class KhidmatRamadaniyahListComponent implements OnInit, OnDestroy {
  columnsdata = [
    {
      columnDef: "itsId",
      header: "ITS ID",
      dataName: (row: any) => `${row.itsId || "-"}`,
    },
    {
      columnDef: "name",
      header: "Name",
      dataName: (row: any) => `${row.name || "-"}`,
    },
    {
      columnDef: "jamaatName",
      header: "Jamaat Assigned",
      dataName: (row: any) => `${row.rolesDetails && row.rolesDetails.length > 0 ? row.rolesDetails.map((r: any) => r.jamaat).join(', ') : "-"}`,
    },
    {
      columnDef: "jamiatName",
      header: "Jamiat",
      dataName: (row: any) => `${row.rolesDetails && row.rolesDetails.length > 0 ? [...new Set(row.rolesDetails.map((r: any) => r.jamiat))].join(', ') : "-"}`,
    },
    {
      columnDef: "status",
      header: "Status",
      dataName: (row: any) => `${row.status || 'ACTIVE'}`,
    },
    {
      columnDef: "action",
      header: "Action",
      dataName: (row: any) => `${row.status}`,
    },
  ];

  roleList: any[] = [];
  allRoleList: any[] = [];
  searchList: any[] = [];
  userRole: any;
  query: string = "";
  private destroy$ = new Subject();
  @ViewChild(ServerSideSmartTableComponent) smartTable!: ServerSideSmartTableComponent;

  constructor(
    public khidmatService: KhidmatRamadaniyahService,
    private toastrservice: ToastrService,
    private changeDetection: ChangeDetectorRef,
    private router: Router,
    public commonservices: CommonService,
    private localService: LocalStorageService
  ) { }

  ngOnInit(): void {
    const data: any = this.localService.get("role");
    this.userRole = JSON.parse(data);
  }




  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchData(event: any) {
    let value = "";
    if (Array.isArray(event)) {
      if (event.length !== 0) {
        value = event[0].itsId || event[0];
      } else {
        value = "";
      }
    } else {
      value = event;
    }

    if (value === "" || value.length === 8) {
      this.query = value;
      this.changeDetection.detectChanges();
    }
  }

  fetchedRecord(event: any) {
    if (event.statusRow) {
      const currentStatus = event.statusRow.status;
      const isActive = currentStatus === 'ACTIVE' ? true : false;
      
      const payload = {
        active: isActive,
        itsId: event.statusRow.itsId,
        newJamaatId: (event.statusRow.rolesDetails || []).map((role: any) => role.jamaatId)
      };

      this.khidmatService.activateDeactivateAssignment(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            if (res && (res.status === 'success' || !res.error)) {
              this.toastrservice.success(this.commonservices.toTitleCase(res.message || 'Status updated successfully'));
              this.smartTable.loadData();
            } else {
              this.toastrservice.error(this.commonservices.toTitleCase(res?.message || 'Failed to update status'));
            }
          },
          (error) => {
            console.error(error);
          }
        );
    }
    if (event.update) {
      let id = btoa(event.update.itsId);
      this.router.navigateByUrl(`/admin/khidmat-ramadaniyah/edit/${id}`);
    }
  }
}
