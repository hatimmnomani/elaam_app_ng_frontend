import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { Router, RoutesRecognized } from "@angular/router";
import { Subject } from "rxjs";
import { filter, pairwise, takeUntil } from "rxjs/operators";
import { SpinnerService } from "src/app/shared/services/spinner/spinner.service";
import { SmartSearchComponent } from './../../../../../shared/componets/smart-search/smart-search.component';
import { MatDialog } from "@angular/material/dialog";
import { SmartDialogDeleteComponent } from "src/app/shared/componets/smart-dialog/smart-dialog-delete.component";
import { FMBService } from "../../../fmb/services/fmb.service";
import { DatePipe } from "@angular/common";
import { LocalStorageService } from "src/app/auth/service/storage/localstorage.service";
import { SharedataService } from "src/app/shared/services/sharedata.service";


@Component({
  selector: 'app-quran-hifz',
  templateUrl: './quran-hifz.component.html',
  styleUrls: ['./quran-hifz.component.scss']
})
export class QuranHifzComponent implements OnInit {
  
  departmentId = 2;
  @ViewChild(SmartSearchComponent) searchclear!: SmartSearchComponent;
  niyatStatusList$: Subject<any> = new Subject<any>();
  getChartData$: any;
  search: string = '';
  selectedIndex = 0;

  getListData: any[] = [];
  searchList: any[] = [];
  niyatStatus: number = 4;
  dateDetails: any;
  labelTab: string = "Jamiat";
  querymeter: string = "";
  jamiatId:any = "";
  showInfoIcons: boolean = false;

  columnsHeader: any[] = [];
  niyatStatusName: string = 'Total';
  private destroy$ = new Subject();
  id: any = null;


  constructor(
    public spinner: SpinnerService,    
    private fmbervice: FMBService,
    private changeDetection: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    private datepipe: DatePipe,
    private localService: LocalStorageService,
    private sharedataService: SharedataService,
  ) {}


  ngOnInit(): void {
    this.router.events
    .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
    .subscribe((events: RoutesRecognized[]) => {
      if(events[0].urlAfterRedirects.includes('niyat-information')){
        this.localService.set('previousUrl', events[0].urlAfterRedirects )
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
    this.sharedataService.selectedMonthValueSource.next(null)
  }

  dynamicColoumns(keyname: string) {
    this.columnsHeader = [
      {
        columnDef: keyname,
        header: keyname,
        dataName: (row: any) => `${row.name || "-"}`,
      },
      {
        columnDef: "totalniyats",
        header: "total niyats",
        dataName: (row: any) => `${row.statusCountDto.totalNiyat || "-"}`,
      },
      {
        columnDef: "activeniyats",
        header: "active niyats",
        dataName: (row: any) => `${row.statusCountDto.active || "-"}`,
      },
      {
        columnDef: "completedniyats",
        header: "completed niyats",
        dataName: (row: any) => `${row.statusCountDto.completed || "-"}`,
      },
      {
        columnDef: "approvalpending",
        header: "approval pending",
        dataName: (row: any) => `${row.statusCountDto.approvalPending || "-"}`,
      },
      {
        columnDef: "deactivated",
        header: "Deactivated",
        dataName: (row: any) => `${row.statusCountDto.deactivated || "-"}`,
      },
      {
        columnDef: "action",
        header: "Action",
        dataName: (row: any) => `${row.status}`,
      },
    ];
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
          columnDef: "status",
          header: "Status",
          dataName: (row: any) => `${this.checkStatus(row.status) || "-"}`,
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
   * @brief checkStatus 
   * @param status
   * @return string
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

      /******************************************************************************
   *
   * @brief Get Search List
   * @param null
   * @return none
   *
   ******************************************************************************/

       searchData(event: any) {
        this.search = event[0].name || event[0]
        if(this.labelTab=='Jamiat')
        {
        this.getDataList(this.labelTab,this.dateDetails,this.departmentId, this.niyatStatus, event[0].name || event[0], this.id);
        }else{
        this.getListCall(event[0].itsId);
        }
        }

  /******************************************************************************
   *
   * @brief fetch record data
   * @param string event
   * @return none
   *
   ******************************************************************************/
   fetchedRecord(event: any) {

    if(event.centerFocusinfo) {
      let lId =  btoa(event.centerFocusinfo.niyatId);
      this.router.navigateByUrl(`/niyat-information/${lId}`);
      }

    if (event.centerFocus) {
      this.labelTab = "Department";
      this.jamiatId = event.centerFocus.id;
      this.getListCall('');
      this.searchclear.emptySearch();
    }

    if (event.scan) { 
      const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
        data: { buttonClose:true, imageScanPath: event.scan.scannedNiyatUrl || 'assets/images/niyatform.png',imageScanPath2: event?.scan?.scannedNiyatUrl2 },
      });
    }

  }

    /******************************************************************************
   *
   * @brief fetch record data
   * @param text string
   * @return none
   *
   ******************************************************************************/
  getListCall(text:string){
    this.fmbervice.postActiveChangeList(this.dateDetails, this.labelTab === 'Niyat' ? "niyatQuestion" : this.labelTab , this.departmentId, 'getNiyatListV2',this.niyatStatus,text,this.jamiatId)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.dynamicColoumnsAction();
      this.getListData = data === null ? [] : data;
      this.searchList  = data.filter((value:any, index:any, self:any) => index === self.findIndex((t:any) => (t.itsId === value.itsId)))
      this.showInfoIcons = true;
    }); 
  }

    /******************************************************************************
   *
   * @brief to show default table.
   * @param none
   * @return none
   *
   ******************************************************************************/
     backbutton() {
      this.showInfoIcons = false;
      this.labelTab = "Jamiat";
      this.searchclear.emptySearch();
      this.getDataList(this.labelTab,this.dateDetails,this.departmentId, this.niyatStatus, this.search,this.id);
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
      if(this.localService.get('previousUrl') != null){
        this.getListCall('');
        this.localService.remove('previousUrl')
      }else{
        this.getDataList(this.labelTab,event,this.departmentId, this.niyatStatus, this.search, this.id);
      }
      this.getChartData(this.labelTab,event, this.niyatStatus, this.id);
    }

      /******************************************************************************
   *
   * @brief Get Niyat Status from api
   * @param start and end date
   * @return none
   *
   ******************************************************************************/
  getDataList(label: string,event: any,departmentId: number, status: number, search: string, id:any): void {
    if(label) {
      this.fmbervice.getListData('getDepartmentActiveJamiatNiyatList', event,departmentId,status, search, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.dynamicColoumns('jamiat')
        this.getListData = this.searchList = data === null ? [] : data;
      });
    }
  }


      /******************************************************************************
   *
   * @brief get niyat card details
   * @param string event
   * @return none
   *
   ******************************************************************************/
    getniyatDataBx(data: any) {
      this.showInfoIcons = false;
      this.niyatStatus = data.id;
      this.searchclear.emptySearch();
      this.search = '';
      this.niyatStatusName = data.name === 'total niyats' ? 'Total' : data.name;
      this.getDataList(this.labelTab,this.dateDetails,this.departmentId, this.niyatStatus, this.search, this.id);
      this.getChartData(this.labelTab,this.dateDetails, this.niyatStatus, this.id);
      this.changeDetection.detectChanges();
    }

    /******************************************************************************
     *
     * @brief Get Niyat Status from api
     * @param start and end date
     * @return none
     *
     ******************************************************************************/
    getNiyatStatus(event: any): void {
      this.fmbervice.getNiyatStatus(event,'getDepartmentNiyatStatusData',this.departmentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.niyatStatusList$.next(data);
      });
    }
    
    /******************************************************************************
   *
   * @brief map
   * @param label and date detail and niyat status
   * @return none
   *
   ******************************************************************************/
  getChartData(label: string, event: any, status: number, id:any): void {
    this.getChartData$ = [];
    this.fmbervice.getDataChart('getDepartmentDataInMap', event, status, this.departmentId,this.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.getChartData$ = data;
    });  
  }

}
