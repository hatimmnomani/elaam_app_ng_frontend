import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NiyatApproverService } from '../service/niyatApprover.service';
import { LocalStorageService } from '../../../../auth/service/storage/localstorage.service';
import { MatDialog } from '@angular/material/dialog';
import { SmartDialogDeleteComponent } from 'src/app/shared/componets/smart-dialog/smart-dialog-delete.component';
import { NiyatDataService } from '../../niyat-data/services/niyat-data.service';


@Component({
  selector: 'app-niyat-approve-list',
  templateUrl: './niyat-approve-list.component.html',
  styleUrls: ['./niyat-approve-list.component.scss']
})

export class NiyatApproveListComponent implements OnInit {
  query: string = "";
  niyatList: any[] = [];

  columnsHeader = [
    {
      columnDef: "niyatId",
      header: "Niyat Id",
      dataName: (row: any) => `${row.niyatId || "-"}`,
    },
    {
      columnDef: "niyatDate",
      header: "Niyat Date",
      dataName: (row: any) => `${this.datepipe.transform(row.niyatDate, "dd-MM-yyyy") || "-"}`,
    },
    {
      columnDef: "niyatQuestion",
      header: "Niyat Question",
      dataName: (row: any) => `${row.niyatQuestionEnglish || "-"}`,
    },
    {
      columnDef: "itsId",
      header: "ITS ID",
      dataName: (row: any) => `${row.itsId || "-"}`,
    },
    {
      columnDef: "jamiat",
      header: "JAMIAT",
      dataName: (row: any) => `${row.jamiat || "-"}`,
    },
    {
      columnDef: "jamaat",
      header: "JAMAAT",
      dataName: (row: any) => `${row.jamaat || "-"}`,
    },
    {
      columnDef: "department",
      header: "DEPARTMENT",
      dataName: (row: any) => `${row.departmentName || "-"}`,
    },
    {
      columnDef: "umoor",
      header: "UMOOR",
      dataName: (row: any) => `${row.umoorName || "-"}`,
    },
    {
      columnDef: "status",
      header: "Status",
      dataName: (row: any) => `${this.checkStatus(row.status)}`,
    },
    {
      columnDef: "action",
      header: "Action",
      dataName: (row: any) => `${row.status}`,
    },
  ];

  private destroy$ = new Subject();
  userrole: string;

  constructor(
    private toastrservice: ToastrService,
    private niyatApproverservice: NiyatApproverService,
    public niyatDataService: NiyatDataService,
    private changeDetection: ChangeDetectorRef,
    private router: Router,
    private datepipe: DatePipe,
    private localService: LocalStorageService,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    const data: any = this.localService.get("role");
    this.userrole = JSON.parse(data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

  /******************************************************************************
   *
   * @brief Get all template
   * @param none
   * @return none
   *
   ******************************************************************************/
  getUnApprovedNiyat(): void {
    let itsID = this.localService.get('itsId');  
    this.niyatApproverservice.getUnApprovedNiyat(itsID).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if(this.localService.get('MultipleJamaatIds') != undefined && (this.userrole === 'Aamil'|| this.userrole==='Muavin Aamil')){
        this.niyatList = data.filter((res:any)=>{
          return (res.jamaat == this.localService.get('activeJamaatName'))
        });
      }else if(this.localService.get('MultipleUmoorIds') != undefined && this.userrole === 'Umoor Coordinator'){
        this.niyatList = data.filter((res:any)=>{
          return (res.umoorName == this.localService.get('activeUmoorName'))
        });
      }else if(this.localService.get('MultipleJamiatIds') != undefined && this.userrole === 'Jamiat Masool'){
        this.niyatList = data.filter((res:any)=>{
          return (res.jamiatName == this.localService.get('activeJamiatName'))
        });
      }
      else{
        this.niyatList = data;
      }
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
      if (event.scan) {
        const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
          data: { buttonClose:true, imageScanPath: event.scan.scannedNiyatUrl || 'assets/images/niyatform.png',imageScanPath2: event?.scan?.scannedNiyatUrl2  },
        });
      }
  
      if(event.centerFocusinfo) {
        let lId =  btoa(event.centerFocusinfo.niyatId);
        this.router.navigateByUrl(`/niyat-information/${lId}`);
      }
    }


  /******************************************************************************
   *
   * @brief Call checkStatus 
   * @param string statusCode
   * @return  Status
   *
   ******************************************************************************/
    checkStatus(status: string) {
      switch (status) {
        case "1":
          return 'ACTIVE'
        break;
      
        case "2":
          return 'PENDING'
        break;
      
        case "3":
          return 'COMPLETED'
        break;
      
        default:
          return '-'
        break;
      }
    }

}
