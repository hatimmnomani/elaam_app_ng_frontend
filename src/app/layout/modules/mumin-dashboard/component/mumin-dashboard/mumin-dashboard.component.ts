import { LocalStorageService } from './../../../../../auth/service/storage/localstorage.service';
import { MuminDashboardService } from './../../service/mumin-dashboard.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { SmartDialogDeleteComponent } from 'src/app/shared/componets/smart-dialog/smart-dialog-delete.component';
import { takeUntil } from 'rxjs/operators';
import { SmartSearchComponent } from 'src/app/shared/componets/smart-search/smart-search.component';
import { DatePipe } from '@angular/common';
import { NiyatDataService } from '../../../niyat-data/services/niyat-data.service';
import { SharedataService } from 'src/app/shared/services/sharedata.service';

@Component({
  selector: 'app-mumin-dashboard',
  templateUrl: './mumin-dashboard.component.html',
  styleUrls: ['./mumin-dashboard.component.scss']
})
export class MuminDashboardComponent implements OnInit {
  niyatStatusList$: Subject<any> = new Subject<any>();

  private destroy$ = new Subject();

  redeemTrophiesData = new BehaviorSubject<any>("");
  redeemTrophiesData$ = this.redeemTrophiesData.asObservable();


  @ViewChild(SmartSearchComponent) searchclear!: SmartSearchComponent;
  search: string = '';

  getListData: any[] = [];
  searchList: any[] = [];
  niyatStatus: number = 4;
  dateDetails: any;
  labelTab: string;
  querymeter: string = "";
  query: string = "";

  obj:any =  {
    "startDate"  : "",
    "endDate"    : "",
    "itsId":"",
    "status":"",
    "search":""
  }

  objJSONString: any;
  columnsHeader: any[] = [];
  niyatStatusName: string = 'Total';
  idtsId: any;
  userrole: any;
  lastLoginDate: any;
  lastLogintime: any;
  daysDiff: number;
  toatlNiyatsCount: number = 0;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private changeDetection: ChangeDetectorRef,
    private muminDashboardSr: MuminDashboardService,
    private localService: LocalStorageService,
    private datepipe: DatePipe,
    public niyatDataService: NiyatDataService,
    private sharedataService: SharedataService,
  ) { }

  ngOnInit(): void {
    window.scroll(0,0)
    window.onbeforeunload = function() {window.scrollTo(0,0);}
    const data: any = this.localService.get("role");
    this.userrole = JSON.parse(data);
    this.idtsId = this.localService.get('itsId');
    this.dynamicColoumnsAction();
    this.niyatStatus;
    this.getRedeemStatusTrophies();   
    // this.getDataList(this.dateDetails, this.idtsId, this.niyatStatus, this.search);
  }

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
    this.sharedataService.selectedMonthValueSource.next(null)
    
  }

  /******************************************************************************
   *
   * @brief Redeem Status Tropies
   * @param none
   * @return none
   *
   ******************************************************************************/

  muminLoginDetails(){
    this.muminDashboardSr
    .getMuminLoginDetails(this.idtsId)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.localService.set("MuminLoginCount", '1');
      if(data.duration != null) {
        if(data.duration > 1){
          this.daysDiff = data.duration;
          this.lastLoginDate = this.datepipe.transform(data.lastLogin.split('T')[0], "dd-MM-yyyy");
          this.lastLogintime = data.lastLogin.split('T')[1];
          this.popUp(this.dialog);
        }else{
          return;
        }
      }else{
        this.popUp2(this.dialog);
      }
    });
  }


  /******************************************************************************
   *
   * @brief show popup
   * @param string event
   * @return none
   *
   ******************************************************************************/
  popUp(event:any){
    // name3: 'Time : '+ this.lastLogintime,
    const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
      data: { heading: 'Welcome Back', name: 'We are excited to see you again after '+this.daysDiff+' days', name1:'Last Login',
      name2: 'Date : '+ this.lastLoginDate, buttonCancel:'Cancel', record: event },
    });
  }

  popUp2(event:any){
    const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
      data: { heading: 'Welcome', name: 'We are excited to see you.', buttonCancel:'Cancel', record: event },
    });
  }
  
  /******************************************************************************
   *
   * @brief Redeem Status Tropies
   * @param none
   * @return none
   *
   ******************************************************************************/
  getRedeemStatusTrophies() {
    this.muminDashboardSr
      .getRedeemStatusTrophies(this.idtsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.redeemTrophiesData.next(data);
      });
  }

  
  /******************************************************************************
   *
   * @brief get Date from Month Dropdown
   * @param start date and end date
   * @return none
   *
   ******************************************************************************/
  getDate(event: any) {
    this.dateDetails = event;
    this.getNiyatStatus(event);
    this.getTotalNiyatsCount(event);
    this.obj.startDate = this.dateDetails['startDate'];
    this.obj.endDate = this.dateDetails['endDate'];
    this.obj.itsId =this.localService.get('itsId');
    this.objJSONString=JSON.stringify(this.obj); 
    this.getDataList(this.dateDetails, this.idtsId, this.niyatStatus, this.search);
  }  

  /******************************************************************************
   *
   * @brief Get Niyat Status from api
   * @param start and end date
   * @return none
   *
   ******************************************************************************/
  getNiyatStatus(event: any): void {
    this.muminDashboardSr.getNiyatStatus(event, this.idtsId)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.niyatStatusList$.next(data);
      let obj = data.find((o: { name: string; }) => o.name === 'total niyats');

      if(obj.value == 0){
        const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
          width: '450px',
          data: { name: 'You have not done any niyat or the niyat form has not been uploaded on the application. Feel free to connect on our helpline numbers (+918830355613,+919324625416,+919326173664) for further queries.',
          buttonSubmit: 'Ok', 
          record: event}
        });

        dialogRef.afterClosed().subscribe((result) => {
          if(result != undefined){
            if(this.userrole === "Mumin") {
              this.router.navigate(["/login"]);
            } else {
              this.router.navigate(["/admin/login"]);
            }
            this.localService.clear();
          } 
        });
      }else{
        if(this.localService.get('MuminLoginCount') !== '1'){
          this.muminLoginDetails();
        }
      }

      
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
    this.search = event[0].umoorName || event[0];
    this.obj.startDate = this.dateDetails['startDate'];
    this.obj.endDate = this.dateDetails['endDate'];
    this.obj.itsId =this.localService.get('itsId');
    this.obj.search =this.search;
    this.objJSONString=JSON.stringify(this.obj); 
    this.getDataList(this.dateDetails, this.idtsId, this.niyatStatus, this.search);
    this.changeDetection.detectChanges();
  }
  /******************************************************************************
   *
   * @brief get niyat card details
   * @param string event
   * @return none
   *
   ******************************************************************************/
  getniyatDataBx(data: any) {
    this.niyatStatus = data.id;
    this.niyatStatusName = data.name === 'total niyats' ? 'Total' : data.name;
    this.obj.startDate = this.dateDetails['startDate'];
    this.obj.endDate = this.dateDetails['endDate'];
    this.obj.itsId =this.localService.get('itsId');
    if(this.niyatStatus != 4){
    this.obj.status =this.niyatStatus;
    }else{
      this.obj.status=""
    }
    this.objJSONString=JSON.stringify(this.obj); 
    this.getDataList(this.dateDetails, this.idtsId, this.niyatStatus, this.search);
    //this.searchclear.emptySearch();
    this.changeDetection.detectChanges();
  }

  /******************************************************************************
   *
   * @brief Get Niyat Status from api
   * @param start and end date
   * @return none
   *
   ******************************************************************************/
  getDataList(dateDetails: any,idtsId: any, status: number, search: string): void {
    this.getListData = []
    const idtsIdData = idtsId
    this.muminDashboardSr.getListData('getAllNiyatListV2', dateDetails, idtsIdData, status, search)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.getListData = data.niyatData;
      this.searchList  = this.getListData.filter((value:any, index:any, self:any) => index === self.findIndex((t:any) => (t.umoorName === value.umoorName)))
     
    });
    this.changeDetection.detectChanges();
  }

  
  /******************************************************************************
   *
   * @brief on action popup and navigate
   * @param string event
   * @return none
   *
   ******************************************************************************/
  fetchedRecord(event: any){
    if (event.scan) {
      const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
        data: { buttonClose:true, imageScanPath: event.scan.scannedNiyatUrl || 'assets/images/niyatform.png', imageScanPath2: event?.scan?.scannedNiyatUrl2 },
      });
    }
    if (event.centerFocusinfo) {
      let lId =  btoa(event.centerFocusinfo.niyatId);
      this.router.navigateByUrl(`/niyat-information/${lId}`);
    }
  }

  /******************************************************************************
   *
   * @brief change coloumns of table based on action button.
   * @param none
   * @return none
   *
   ******************************************************************************/

  dynamicColoumnsAction() {
    this.columnsHeader = [
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
        columnDef: "itsid",
        header: "ITS ID",
        dataName: (row: any) => `${row.itsId || "-"}`,
      },
      {
        columnDef: "jamiat",
        header: "Jamiat",
        dataName: (row: any) => `${row.jamiat || "-"}`,
      },
      {
        columnDef: "jamaat",
        header: "Jamaat",
        dataName: (row: any) => `${row.jamaat || "-"}`,
      },
      {
        columnDef: "departmentName",
        header: "Department",
        dataName: (row: any) => `${row.departmentName || "-"}`,
      },
      {
        columnDef: "umoorName",
        header: "Umoor",
        dataName: (row: any) => `${row.umoorName || "-"}`,
      },
      {
        columnDef: "action",
        header: "Action",
        dataName: (row: any) => `${'-'}`,
      },
    ];
  }


   /******************************************************************************
   *
   * @brief Get Total Niyats from api
   * @param none
   * @return none
   *
   ******************************************************************************/
  getTotalNiyatsCount(event: any): void {
    this.muminDashboardSr.getTotalNiyats(event)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.toatlNiyatsCount = data;
    });
  }
 
}
