import { SmartSearchComponent } from './../../../../../shared/componets/smart-search/smart-search.component';
import { LocalStorageService } from './../../../../../auth/service/storage/localstorage.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { Router, RoutesRecognized } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { filter, pairwise, takeUntil } from "rxjs/operators";
import { DashboardService } from "../../service/dashboard.service";
import { SmartDialogDeleteComponent } from 'src/app/shared/componets/smart-dialog/smart-dialog-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  @ViewChild(SmartSearchComponent) searchclear: SmartSearchComponent;

  niyatStatusList$: Subject<any> = new Subject<any>();
  selectedIndex$: Subject<any> = new Subject<any>();
  rolename$: Subject<any> = new Subject<any>();

  getChartData$: Subject<any> = new Subject<any>();
  departmentId = 0
  search: string = '';
  private destroy$ = new Subject();

  getListData: any[] = [];
  searchList: any[] = [];
  niyatStatus: number = 4;
  dateDetails: any;
  labelTab: string;
  querymeter: string = "";
  id:any = null;

  columnsHeader: any[] = [];
  niyatStatusName: string = 'Total';

  showInfoIcons: boolean = false;
  rolename: any;
  centerFocusLabel: string = 'jamiat';
  jamaatEventData: any;
  niyatIdIcon: any;
  tableType: string = 'all';
  jamaatId: any;
  jamiatId: any;
  fetchJaamat: boolean = false;
  tabStatus: boolean = false;

  constructor(
    private localService: LocalStorageService,
    private dashboardservice: DashboardService,
    private changeDetection: ChangeDetectorRef,
    public dialog: MatDialog,
    private router: Router,
    private datepipe: DatePipe,
  ) {}

  ngOnInit() {
    this.router.events
    .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
    .subscribe((events: RoutesRecognized[]) => {
      if(events[0].urlAfterRedirects.includes('niyat-information')){
        this.localService.set('previousUrl', events[0].urlAfterRedirects )
      }
    });
  }
  
  ngAfterViewInit() {
    this.rolesHideTabs(this.localService.get("role"));
  }

    /******************************************************************************
   *
   * @brief based on roles hide tabs
   * @param role name
   * @return none
   *
   ******************************************************************************/

   rolesHideTabs(userRole: any) {  
    this.rolename = JSON.parse(userRole)
    setTimeout(() => this.rolename$.next(this.rolename), 0)

    switch (this.rolename) {
      case 'Aamil || Muavin Aamil':
        this.labelTab = 'Jamaat'; // to pass in api and show in default case of tab.
        setTimeout(() => this.selectedIndex$.next(1), 0)
        break;

      case 'Dept Head':
        this.labelTab = 'Department'; // to pass in api and show in default case of tab.
        setTimeout(() => this.selectedIndex$.next(1), 0)
        break;
      
      case 'Umoor Head':
        setTimeout(() => this.selectedIndex$.next(0), 0)
        this.labelTab = 'Umoor'; // to pass in api and show in default case of tab.
        this.getChartData(this.labelTab,this.dateDetails, this.niyatStatus, this.id);
        this.getDataList(this.labelTab,this.dateDetails,this.departmentId, this.niyatStatus, this.search, this.id);
        break;

      case 'Umoor Coordinator':
        this.labelTab = 'Niyat'; // to pass in api and show in default case of tab.
        setTimeout(() => this.selectedIndex$.next(1), 0)
        break;
    
      default:
        this.labelTab = 'Jamiat';
        setTimeout(() => this.selectedIndex$.next(1), 0)
        break;
    }
    this.changeDetection.detectChanges();
  }


  /******************************************************************************
   *
   * @brief change coloumns of table based on tabs.
   * @param keyname of tab
   * @return none
   *
   ******************************************************************************/

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
        columnDef: "action",
        header: "Action",
        dataName: (row: any) => `${row.status}`,
      },
    ];
  }

  /******************************************************************************
   *
   * @brief fetch record data
   * @param string event
   * @return none
   *
   ******************************************************************************/
  fetchedRecord(event: any) {
    if(event && this.labelTab === 'Jamiat') {
      this.loadJamiaatInsideJamiatList(this.labelTab, event);
    }else {
      this.defaultDataList(event);
    }
  }



   /******************************************************************************
   *
   * @brief Load Jamiaat Inside Jamiat List table.
   * @param none
   * @return none
   *
   ******************************************************************************/
    defaultDataList(event: any) {
      if (event.scan) {
        const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
          data: { buttonClose:true, imageScanPath: event.scan.scannedNiyatUrl || 'assets/images/niyatform.png',imageScanPath2: event.scan.scannedNiyatUrl2 },
        });
      }
  
      if(event.centerFocusinfo) {
        let lId =  btoa(event.centerFocusinfo.niyatId);
        this.router.navigateByUrl(`/niyat-information/${lId}`);
      }
  
      if(event.centerFocus) {
        this.jamaatId = event.centerFocus.id;
        this.niyatIdIcon = event.centerFocus.id;
        this.search="";
        this.getActiveNiyatDefaultList();
      }
    }


   /******************************************************************************
   *
   * @brief Active Niyat List for Default Tab except jamiat.
   * @param none
   * @return none
   *
   ******************************************************************************/
    getActiveNiyatDefaultList() {
      this.tableType= 'niyatDefault';
      this.dashboardservice.getActiveChangeList(this.dateDetails, this.labelTab === 'Niyat' ? "niyatQuestion" : this.labelTab , 'getAllActiveNiyatList',this.niyatStatus, this.search, this.jamaatId , this.jamiatId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.dynamicColoumnsAction()
        this.getListData = this.searchList = data === null ? [] : data;
        this.centerFocusLabel = "niyat"
        this.searchclear.emptySearch();
      }); 
    }

   /******************************************************************************
   *
   * @brief Load Jamiaat Inside Jamiat List table.
   * @param none
   * @return none
   *
   ******************************************************************************/
    loadJamiaatInsideJamiatList(labelTab: string, event: any) {
      this.jamaatEventData = event;
      if(event.scan) {
        const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
          data: { buttonClose:true, imageScanPath: event.scan.scannedNiyatUrl || 'assets/images/niyatform.png', imageScanPath2: event?.scan?.scannedNiyatUrl2 },
        });
      }

      if(event.centerFocusinfo) {
        let lId =  btoa(event.centerFocusinfo.niyatId);
        this.router.navigateByUrl(`/niyat-information/${lId}`);
      }

      if(this.centerFocusLabel === 'jamiat') {
        this.tableType= 'JamaatList';
        this.niyatIdIcon = event.centerFocus.id
        this.jamaatId = event.centerFocus.id
        this.jamiatId = event.centerFocus.id
        this.getJaamatList();
      }else if(this.centerFocusLabel === 'jamaat'){
        this.jamaatId = event.centerFocus.id;
        this.niyatIdIcon = event.centerFocus.id;
        this.search="";
        this.getActiveNiyatJamiatList();
      }
    }

  /******************************************************************************
   *
   * @brief  Jaamt list
   * @param none
   * @return none
   *
   ******************************************************************************/

  getJaamatList() {
    this.centerFocusLabel = 'jamaat';
    this.dashboardservice.getActiveChangeList(this.dateDetails, 'nolabel' , 'getJamaatActiveNiyatList', this.niyatStatus, this.search, this.jamaatId, this.jamiatId)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.dynamicColoumns(this.centerFocusLabel)
      this.getListData = data;
      this.searchList  = data.filter((value:any, index:any, self:any) => index === self.findIndex((t:any) => (t.name === value.name)))
      this.centerFocusLabel = 'jamaat';
      this.fetchJaamat = true;
    }); 
  }


        
   /******************************************************************************
   *
   * @brief Active Niyat List for Jamiat Tab.
   * @param none
   * @return none
   *
   ******************************************************************************/
  getActiveNiyatJamiatList() {
    this.tableType = 'niyatJamitList';
    this.dashboardservice.getActiveChangeList(this.dateDetails, 'Jamaat' , 'getAllActiveNiyatList', this.niyatStatus, this.search, this.jamaatId , this.jamiatId)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.dynamicColoumnsAction()
      this.getListData = data;
      this.searchList  = data.filter((value:any, index:any, self:any) => index === self.findIndex((t:any) => (t.itsId === value.itsId)))
      this.centerFocusLabel = 'niyat';
      // this.searchclear.emptySearch();
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
    if(this.fetchJaamat && this.centerFocusLabel === "niyat") {
      this.tableType = 'JamaatList';
      this.getJaamatList();
      // this.searchclear.emptySearch();
    }else if (this.centerFocusLabel === "niyat") {
      this.tableType = 'all'
      this.getDataList(this.labelTab,this.dateDetails,this.departmentId, this.niyatStatus, this.search, this.id); 
      this.searchclear.emptySearch();
    }else if(this.centerFocusLabel === "jamaat") {
      this.getDataList(this.labelTab,this.dateDetails,this.departmentId, this.niyatStatus, this.search, this.id); 
      this.searchclear.emptySearch(); 
      this.centerFocusLabel = "jamiat"
      this.fetchJaamat = false;
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
    if(this.tableType === 'niyatDefault'){
      this.search = event[0].itsId || event[0];
      this.getActiveNiyatDefaultList();
    }else if(this.tableType === 'niyatJamitList'){
      // this.tableType = 'all';
      this.search = event[0].itsId || event[0];
      this.getActiveNiyatJamiatList();
      this.searchclear.emptySearch();
    }else if(this.tableType === 'JamaatList') {
      this.search = event[0].name || event[0];
      this.getJaamatList();
    }else{
      // this.searchclear.emptySearch();
      if(this.localService.get('previousUrl') != null){
        this.getActiveNiyatJamiatList();
        this.localService.remove('previousUrl')
        this.fetchJaamat = true;
      }else{
        this.getDataList(this.labelTab,this.dateDetails,this.departmentId, this.niyatStatus, event[0].name || event[0], this.id);
      }
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
    this.tableType = 'all'
    this.centerFocusLabel = "jamiat"
    this.fetchJaamat = false;
    this.showInfoIcons = false;

    this.tabStatus = true;
    this.niyatStatus = data.id;
    this.niyatStatusName = data.name === 'total niyatsssss' ? 'Total' : data.name;
    this.callListandChart();
    this.searchclear.emptySearch();
    this.changeDetection.detectChanges();
  }

  /******************************************************************************
   *
   * @brief get Date from Month Dropdown
   * @param start date and end date
   * @return none
   *
   ******************************************************************************/
  getDate(event: any) {
    this.tableType = 'all'
    this.centerFocusLabel = "jamiat"
    this.fetchJaamat = false;
    this.showInfoIcons = false;

    this.dateDetails = event;
    this.getNiyatStatus(event);
    this.getChartData(this.labelTab,event, this.niyatStatus, this.id);
    this.getDataList(this.labelTab,event,this.departmentId, this.niyatStatus, this.search, this.id);
  }


/******************************************************************************
 *
 * @brief Get Niyat Status from api
 * @param start and end date
   * @return none
   *
   ******************************************************************************/
  getNiyatStatus(event: any): void {
    this.dashboardservice.getNiyatStatus(event)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.niyatStatusList$.next(data);
    });
  }
  
  
  
  /******************************************************************************
  *
  * @brief call data list and chart data function in paralle
  * @param none
  * @return none
  *
  ******************************************************************************/
  callListandChart() {
    if(this.localService.get('JamaatId') != undefined){
      this.id = this.localService.get('JamaatId'); 
    } else if(this.localService.get('JamiatId') != undefined) {
      this.id = this.localService.get('JamiatId'); 
    } else if(this.localService.get('DepartmentId') != undefined) {
      this.id = this.localService.get('DepartmentId'); 
    }

    this.getChartData(this.labelTab,this.dateDetails, this.niyatStatus, this.id);
    // this.getDataList(this.labelTab,this.dateDetails,this.departmentId, this.niyatStatus, this.search, this.id);
  }
  /******************************************************************************
   *
   * @brief Get Niyat Status from api
   * @param start and end date
   * @return none
   *
   ******************************************************************************/
  getDataList(label: string,dateDetails: any,departmentId: number, status: number, search: string, id:any): void {
    this.getListData = []
    switch (label) {
      case 'Umoor':
        this.dashboardservice.getListData('getUmoorActiveNiyatList', dateDetails, departmentId ,status, search, id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.dynamicColoumns(this.centerFocusLabel = 'umoor')
          this.getListData = this.searchList = data;
        });        
        break;

      case 'Jamiat':
        this.dashboardservice.getListData('getJamiatActiveNiyatList', dateDetails, departmentId ,status, search, id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.dynamicColoumns(this.centerFocusLabel = 'jamiat')
          this.getListData = this.searchList = data;
        });        
        break;

      case 'Department':
        this.dashboardservice.getListData('getDepartmentActiveNiyatList', dateDetails, departmentId ,status, search, id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.dynamicColoumns(this.centerFocusLabel = 'department')
          this.getListData = this.searchList = data;
        });        
        break;

      case 'Niyat':
        this.dashboardservice.getListData('getNiyatListData', dateDetails, departmentId ,status, search, id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.dynamicColoumns(this.centerFocusLabel = 'Niyat')
          this.getListData = this.searchList = data;
        });        
        break;

      case 'Jamaat':
        this.dashboardservice.getListData('getJamaatActiveNiyatList', dateDetails, departmentId, status, search, id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.dynamicColoumns(this.centerFocusLabel = 'jamaat')
          this.getListData = this.searchList = data;
        });        
        break;
    
      default:
        break;
    }
    this.changeDetection.detectChanges();

  }

  /******************************************************************************
   *
   * @brief Get Niyat Status from api
   * @param start and end date
   * @return none
   *
   ******************************************************************************/
  getChartData(label: string, event: any, status: number, id:any): void {
    this.getChartData$.next([])
    switch (label) {
      case 'Umoor':
        this.dashboardservice.getDataChart('getUmoorData', event, status,this.departmentId ,id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          const chartdata = this.setBarChart(data)
          this.getChartData$.next(chartdata)

        });        
        break;

      case 'Jamiat':
        this.dashboardservice.getDataChart('getJamiatData', event, status,this.departmentId , id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.getChartData$.next(data)

        });
        break;

      case 'Jamaat':
        this.dashboardservice.getDataChart('getJamiatData', event, status,this.departmentId, id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.getChartData$.next(data)

        });
        break;

      case 'Department':
        this.dashboardservice.getDataChart('getDepartmentData', event, status,this.departmentId, id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          const chartdata = this.setBarChart(data)
          this.getChartData$.next(chartdata)
        });        
      break;

      case 'Niyat':
        this.dashboardservice.getDataChart('getNiyatData', event, status,this.departmentId, id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.getChartData$.next(data)        
        });        
        break;
    
      default:
        break;
    }
    this.changeDetection.detectChanges();

  }

  /******************************************************************************
   *
   * @brief Get Tabs Details
   * @param event tab details
   * @return none
   *
   ******************************************************************************/
  tabDetails(eventtab: MatTabChangeEvent) {
    this.tableType = 'all'
    this.centerFocusLabel = "jamiat"
    this.fetchJaamat = false;
    this.showInfoIcons = false;
    this.labelTab = eventtab.tab.textLabel;
    this.callListandChart(); 
    this.searchclear.emptySearch(); 
  }

  /******************************************************************************
   *
   * @brief Set Chart Data
   * @param any res
   * @return any
   *
   ******************************************************************************/
  setBarChart(res: any): any {
    const resultactive: any[] = [];
    const resultapprovalPending: any[] = [];
    const resultcompleted: any[] = [];
    const resulttotal: any[] = [];
    const resultxaxis: any[] = [];

    res.forEach((response: any) => {
      if(response.name.length>0){
        resultxaxis.push(response.name.substring(0, 20));
      }else{
        resultxaxis.push(response.name);
      }
      
      for (const [key, value] of Object.entries(response.statusCountDto)) {
        switch (key) {
          case "active":
            resultactive.push(value);
            break;
          case "approvalPending":
            resultapprovalPending.push(value);
            break;
          case "completed":
            resultcompleted.push(value);
            break;
          case "totalNiyat":
            resulttotal.push(value);
            break;

          default:
            break;
        }
      }
    });

    const data = {
        activebar: resultactive.length === 0 ? null : resultactive,
        pendingbar:
          resultapprovalPending.length === 0 ? null : resultapprovalPending,
        completedbar: resultcompleted.length === 0 ? null : resultcompleted,
        totalbar: resulttotal.length === 0 ? null : resulttotal,
        xaxis: resultxaxis,
      }

    return data;
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

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }
}


