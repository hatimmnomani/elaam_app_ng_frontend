import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ReportsService } from '../../services/reports.service';
import { Subject, forkJoin } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from 'src/app/auth/service/storage/localstorage.service';
import * as moment from 'moment';
import { config } from 'src/app/shared/models/validation_config';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DynamicReportComponent } from '../dynamic-report/dynamic-report.component'
import { SharedataService } from 'src/app/shared/services/sharedata.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, AfterViewInit {
  @ViewChild('autoSearch') autoSearch:any;
  selected = 'selectOne';
  jamiatId = 'selectJamiat';
  roleId = 'selectroleId';
  jamaatId = 'selectJamaat';
  advSearchForm: any = FormGroup;
  approverSearchForm: any = FormGroup;
  showMaxError = false;
  dateDetails: any;
  
  // labelTab: string = "Mumineen";
  activeTab: string = 'Mumineen';
  tabPlaceholder: any = "Enter 8 digits itsId";
  selectedIndex = 0;
  getListData: any[] = [];
  searchList: any[] = [];
  jamiatList: any[] = [];
  jamaatList: any[] = [];
  showTable = true;
  questionList: any[] = [];
  searchValue: any = "";
  searchControl = new FormControl();
  private destroy$ = new Subject();
  reportData$: Subject<any> = new Subject<any>();
  sendFileName = 'Report-data';
  sendTitle = 'Reprt Data';
  sendTableId = 'smartTableData';
  downloadButtonTitle = "Download Reprt";
  sendHeader: any[] = [];
  status: any = [
    { id: 1, value: 'ACTIVE' },
    { id: 2, value: 'PENDING' },
    { id: 3, value: 'COMPLETED' },
    { id: -1, value: 'ALL' }
  ];
  approverRoles: any = [
    { id: 3, value: 'Aamil Saheb' },
    { id: 9, value: 'Muawin Aamil Saheb' },
    { id: 6, value: 'Umoor' },
  ];
  notFoundExcelHeader: any = ['niyatId', 'niyatDate','niyatQuestion', 'itsId', 'jamaat', 'jamiat', 'department', 'umoor', 'status', 'niyatQuestion'];
  notFoundExcelHeader1: any = ['itsId', 'name','UmoorName', 'jamaatName', 'jamiatName'];

  obj:any =  {
    "reportKey"  : "Mumineen",
    "search"     : "",
    "startDate"  : "",
    "endDate"    : "",
    "status"     : 1,
    "maxAge"     : 0,
    "minAge"     : 0
  }

  tabs:any = [];

  isLimitedAccess = true;

  columnsHeader1 = [
    {
      columnDef: "NIYAT ID",
      header: "NIYAT ID",
      dataName: (row: any) => `${row.niyatId || "-"}`,
    },
    {
      columnDef: "NIYAT Date",
      header: "NIYAT DATE",
      dataName: (row: any) => `${this.datepipe.transform(row.niyatDate, "dd-MM-yyyy") || "-"}`,
    },
    {
      columnDef: "ITS ID",
      header: "ITS ID",
      dataName: (row: any) => `${row.itsId || "-"}`,
    },
    {
      columnDef: "niyatQuestion",
      header: "Niyat Question",
      dataName: (row: any) => `${row.niyatQuestion || "-"}`,
    },
    {
      columnDef: "niyatAnswer",
      header: "Committed Value",
      dataName: (row: any) => `${row.niyatAnswer || "-"}`,
    },
    {
      columnDef: "JAMIAT",
      header: "JAMIAT",
      dataName: (row: any) => `${row.jamiat || "-"}`,
    },
    {
      columnDef: "JAMAAT",
      header: "JAMAAT",
      dataName: (row: any) => `${row.jamaat || "-"}`,
    },
    {
      columnDef: "DEPARTMENT",
      header: "DEPARTMENT",
      dataName: (row: any) => `${row.department || "-"}`,
    },
    {
      columnDef: "UMOOR",
      header: "UMOOR",
      dataName: (row: any) => `${row.umoor || "-"}`,
    },
    {
      columnDef: "status",
      header: "Status",
      dataName: (row: any) => `${this.getStatusString(row.status)}`,
    },
    // {
    //   columnDef: "action",
    //   header: "Action",
    //   dataName: (row: any) => `${this.getStatusString(row.status)}`,
    // },
    
  ];
  columnsHeader2 = [
    {
      columnDef: "itsId",
      header: "ITS",
      dataName: (row: any) => `${row.itsId || "-"}`,
    },
    {
      columnDef: "name",
      header: "Name",
      dataName: (row: any) => `${row.name || "-"}`,
    },
    {
      columnDef: "phoneNumber",
      header: "Phone number",
      dataName: (row: any) => `${row.phoneNumber || "-"}`,
    },
    {
      columnDef: "jamiatName",
      header: "JAMIAT",
      dataName: (row: any) => `${row.jamiatName || "-"}`,
    },
    {
      columnDef: "jamaatName",
      header: "JAMAAT",
      dataName: (row: any) => `${row.jamaatName || "-"}`,
    },
    {
      columnDef: "totalNiyatsApprovalsPending",
      header: "APPROVALS PENDING",
      dataName: (row: any) => `${row.totalNiyatsApprovalsPending || "-"}`,
    },
    {
      columnDef: "totalNiyalApproved",
      header: "NIYAT APPROVED",
      dataName: (row: any) => `${row.totalNiyalApproved || "-"}`,
     
    },
    
  ];
  columnsHeader3 = [
    {
      columnDef: "itsId",
      header: "ITS",
      dataName: (row: any) => `${row.itsId || "-"}`,
    },
    {
      columnDef: "name",
      header: "Name",
      dataName: (row: any) => `${row.name || "-"}`,
    },
    {
      columnDef: "umoorName",
      header: "UMOOR",
      dataName: (row: any) => `${row.umoorName || "-"}`,
    },
    {
      columnDef: "phoneNumber",
      header: "Phone Number",
      dataName: (row: any) => `${row.phoneNumber || "-"}`,
    },
    {
      columnDef: "jamiatName",
      header: "JAMIAT",
      dataName: (row: any) => `${row.jamiatName || "-"}`,
    },
    {
      columnDef: "jamaatName",
      header: "JAMAAT",
      dataName: (row: any) => `${row.jamaatName || "-"}`,
    },
    {
      columnDef: "totalNiyatsApprovalsPending",
      header: "APPROVALS PENDING",
      dataName: (row: any) => `${row.totalNiyatsApprovalsPending || "-"}`,
    },
    {
      columnDef: "totalNiyalApproved",
      header: "NIYAT APPROVED",
      dataName: (row: any) => `${row.totalNiyalApproved || "-"}`,
     
    },
  ];

  columnsHeader = this.columnsHeader1;
  userRole: any;
  selectedFValue: string = 'none';
  selectedJamiatValue: number = 0;
  selectedRoleIdValue: number = 0;
  date_formate: any= "YYYY-MM-DD";
  advanceSearchKey: any = [
    { value: 'By age' },
    { value: 'By date' }
  ];
  objJSONString: any;

  constructor(
    public reportService: ReportsService,    
    private datepipe: DatePipe,
    private localService: LocalStorageService,
    private fb: FormBuilder,
    private toastrservice: ToastrService,
    public dialog: MatDialog,
    private sharedataService: SharedataService,
  ) { }

  ngOnInit(): void {
    let role:any = this.localService.get("role");
    this.userRole = JSON.parse(role);
    const allowedRoles = ['Aamil', 'Umoor Coordinator', 'Khidmat Ramadaniyah'];
    this.isLimitedAccess = allowedRoles.includes(this.userRole);
    this.setTabsRolewise(this.userRole);
    this.getQuestionList();
    if (this.userRole === 'Khidmat Ramadaniyah') {
      this.approverRoles = this.approverRoles.filter((role: any) => role.id !== 9);
    }
    console.log(this.isLimitedAccess,"isLimitedAccess");
    
  }

  ngAfterViewInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(1000),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      if (this.activeTab === 'Mumineen') {
        if (value && !config.validation.number.regExp.test(value)) {
          this.toastrservice.error(config.validationMessages.itsId);
          // Clear the search if the ITS ID is invalid to avoid sending a bad request
          this.obj.searchValue = '';
        } else {
          this.obj.searchValue = value;
        }
        this.obj.search = this.activeTab;
        this.objJSONString = JSON.stringify(this.obj);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
    this.sharedataService.selectedMonthValueSource.next(null)
  }

  /******************************************************************************
  *
  * @brief Creating data for file download
  * @param none
  * @return download 
  *
  ******************************************************************************/
  downloadFileData(): void {
    let jsonObject = JSON.parse(this.objJSONString);
    if(jsonObject.reportKey == 'Niyat Question') {
    jsonObject.reportKey = 'QUESTION'
    }
    this.sendHeader = [];
    if(jsonObject?.reportKey == 'Approver Details') {
      const { paginationFlag, ...rest } = jsonObject; // Remove 'jamaatId'
      rest.paginationFlag = false;
      this.reportService.fetchApproverDetailsReport(rest).pipe(takeUntil(this.destroy$)).subscribe((data) =>{
        if(data && data?.reportData?.length > 0){
          this.getListData = data?.reportData;
          if(jsonObject?.roleId !== 6){
            delete this.getListData[0]?.umoorName;
          }
          this.sendHeader.push(Object.keys(this.getListData[0]));
          this.getPlaceholder(jsonObject?.reportKey)
          delete jsonObject['pageNo']; 
          delete jsonObject['pageSize']; 
          const result = this.getListData.map((item)=>{            
            if(jsonObject?.roleId !== 6){
              delete item?.umoorName;
            }
            return item;
          });
          this.reportData$.next(result);
        }else{
          this.sendHeader.push(this.notFoundExcelHeader1);
          this.getPlaceholder(jsonObject?.reportKey)
          this.reportData$.next([]);
        }
      });
    }else{
      this.reportService.getAllReport(jsonObject).pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
    if(data && data.length > 0){
    this.getListData = data;
    this.getListData[0]['CommittedValue'] = this.getListData[0]['niyatAnswer'];
    delete this.getListData[0]['niyatAnswer'];
    // if(jsonObject.reportKey != 'QUESTION'){
    // delete this.getListData[0].niyatQuestion;
    // }
    this.sendHeader.push(Object.keys(this.getListData[0]));
    this.getPlaceholder(jsonObject.reportKey)
    delete jsonObject['pageNo']; 
    delete jsonObject['pageSize']; 
    const result = this.getListData.map((item)=>{
    item.status = this.getStatusString(item.status);
    // delete item.niyatQuestion;
    return item;
    });
    this.reportData$.next(result);
    }else{
    if(jsonObject.reportKey != 'QUESTION'){
    let popped = this.notFoundExcelHeader.slice(0,-1);
    this.sendHeader.push(popped);
    }else{
    this.sendHeader.push(this.notFoundExcelHeader);
    }
    this.getPlaceholder(jsonObject.reportKey)
    this.reportData$.next([]);
    }
    });
  }
    }

  /********************************************************************************
   * 
   * @brief get Status String
   * @param status status id
   * @returns Status ACTIVE,  PENDING or COMPLETED based on id
   * 
   *******************************************************************************/
  getStatusString(status: any) {
    let str ;
    if (status == 1 || status == 'ACTIVE') {
      str = 'ACTIVE';
    } else if (status == 2 || status == 'PENDING') {
      str = 'PENDING';
    } else if (status == 3 || status == 'COMPLETED') {
      str = 'COMPLETED';
    } else {
      str = '-';
    }
    return str;
  }
  /********************************************************************************
   * 
   * @brief get reports
    * @param reportKey report name for which report needs to fetch
    * @param search search term
    * @param startDate start date range
    * @param endDate end date range
    * @param status for which status report need to fetch
    * @returns none
   * 
   *******************************************************************************/
  getReport() {
    if(this.obj.reportKey == 'Niyat Question') {
      this.obj.reportKey = 'QUESTION'
    }

    this.reportService.getAllDropDown(this.obj).pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data && data.length > 0) {
          this.getListData = data;
          if(this.obj.reportKey != 'QUESTION'){
            delete this.getListData[0].niyatQuestion;
          }
          this.sendHeader = [];
          this.sendHeader.push(Object.keys(this.getListData[0]));
          this.getPlaceholder(this.obj.reportKey)
          delete this.obj['pageNo']; 
          delete this.obj['pageSize']; 
        }else{
          this.getListData=[];
        }
      });
  }

  /******************************************************************************
  *
  * @brief Get Question List
  * @param null
  * @return none
  *
  ******************************************************************************/
  getQuestionList(): void {
    this.reportService.getQuestionList().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.questionList = this.searchList = data;
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
    this.obj.startDate = this.dateDetails['startDate'];
    this.obj.endDate = this.dateDetails['endDate'];
    this.objJSONString=JSON.stringify(this.obj); 
    this.getReport();
  }

  /******************************************************************************
  *
  * @brief Get Tabs Details
  * @param event tab details
  * @return none
  *
  ******************************************************************************/
  tabDetails(eventtab: MatTabChangeEvent): void {
    this.obj.reportKey = eventtab.tab.textLabel;
    this.getPlaceholder(eventtab.tab.textLabel)
    this.selectedIndex = eventtab.index;
    this.obj.search = "";
    this.obj.searchValue = "";
    delete this.obj.jamaatId;
    delete this.obj.jamiatId;
    if(this.autoSearch){
      this.autoSearch.resetSearch();
    }
    this.searchControl.setValue('');
    this.activeTab = eventtab.tab.textLabel;
    if(eventtab.tab.textLabel === 'Approver Details'){
      this.createApproverForm();
      this.showTable = false;
      this.getAllJamiat();
      this.obj.search = "Approver Details";
    }else{
      this.objJSONString=JSON.stringify(this.obj);
      this.showTable = true;
      this.columnsHeader = this.columnsHeader1;
      this.getReport();
    }
    this.tabPlaceholder = "";

  }

  getAllJamiat() {
    if (this.userRole === 'Khidmat Ramadaniyah') {
      let assignedJamaatIds: any[] = [];
      const multi = this.localService.get("MultipleJamaatIds");
      const single = this.localService.get("JamaatId");
      if (multi) {
        assignedJamaatIds = JSON.parse(multi);
      } else if (single) {
        assignedJamaatIds = [JSON.parse(single)];
      }

      forkJoin({
        jamiats: this.reportService.getAllJamiatList(),
        jamaats: this.reportService.getAllJamaatList()
      }).pipe(takeUntil(this.destroy$)).subscribe(({ jamiats, jamaats }) => {
        // Filter jamaats to find which jamiats are relevant
        const relevantJamaats = jamaats.filter((j: any) => assignedJamaatIds.includes(j.id));
        const relevantJamiatIds = [...new Set(relevantJamaats.map((j: any) => j.jamiatId))];
        this.jamiatList = jamiats.filter((j: any) => relevantJamiatIds.includes(j.id));
      });
    } else {
      this.reportService?.getAllJamiatList().pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.jamiatList = data
        })
    }
  }

  getRecord(event: any) {

  }

  getAllJamaat(id: any) {
    if (id === "selectJamiat") {
      this.jamaatList = [];
    } else {
      this.reportService.filerJamaatByJamiat([id]).pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          if (this.userRole === 'Khidmat Ramadaniyah') {
            let assignedJamaatIds: any[] = [];
            const multi = this.localService.get("MultipleJamaatIds");
            const single = this.localService.get("JamaatId");
            if (multi) {
              assignedJamaatIds = JSON.parse(multi);
            } else if (single) {
              assignedJamaatIds = [JSON.parse(single)];
            }
            this.jamaatList = data.filter((j: any) => assignedJamaatIds.includes(j.id));
          } else {
            this.jamaatList = data
          }
        })
    }
  }
  /******************************************************************************
  *
  * @brief set placeholder according to selected tabs
  * @param label
  * @return none
  *
  ******************************************************************************/
    getPlaceholder(label: string): void {
    switch (label) {
      case 'Mumineen':
        this.tabPlaceholder = "Enter ITS ID";
        this.sendFileName = "mumineen-wise-report-" + new Date().toDateString();
        break;

      case 'Department':
        this.tabPlaceholder = "Select Department"
        this.sendFileName = "department-wise-report-" + new Date().toDateString();
        this.searchList = [...new Map(this.getListData.filter(item => item?.department && item?.department?.length > 0 ).map(item => {
          let obj = {
            name: item.department
          }
          return [item['department'], obj]
        })).values()];
        break;

      case 'Umoor':
        this.tabPlaceholder = "Select Umoor";
        this.sendFileName = "umoor-wise-report-" + new Date().toDateString();
        this.searchList = [...new Map(this.getListData.filter(item => item?.umoor && item?.umoor?.length > 0 ).map(item => {
          let obj = {
            name: item.umoor
          }
          return [item['umoor'], obj]
        })).values()];
        break;

      case 'Jamiat': 
        this.tabPlaceholder = "Select Jamiat"      
        this.sendFileName = "jamiat-wise-report-" + new Date().toDateString();
        this.searchList = [...new Map(this.getListData.filter(item => item?.jamiat && item?.jamiat?.length > 0 ).map(item => {
          let obj = {
            name: item.jamiat
          }
          return [item['jamiat'], obj]
        })).values()];
        break;
      
      case 'Jamaat':
        this.tabPlaceholder = "Select Jamaat"
        this.sendFileName = "jamaat-wise-report-" + new Date().toDateString();
        this.searchList = [...new Map(this.getListData.filter(item => item?.jamaat && item?.jamaat?.length > 0 ).map(item => {
          let obj = {
            name: item.jamaat
          }
          return [item['jamaat'], obj]
        })).values()];
        break;

        case 'QUESTION': 
        this.tabPlaceholder = "Select Niyat Question"      
        this.sendFileName = "niyat-question-wise-report-" + new Date().toDateString();
        this.searchList = [...new Map(this.getListData.filter(item => item?.niyatQuestion && item?.niyatQuestion?.length > 0 ).map(item => {
          let obj = {
            name: item.niyatQuestion
          }
          return [item['niyatQuestion'], obj]
        })).values()];
        break;

        case 'Niyat Question': 
        this.tabPlaceholder = "Select Niyat Question"      
        this.sendFileName = "niyat-question-wise-report-" + new Date().toDateString();
        this.searchList = [...new Map(this.getListData.filter(item => item?.niyatQuestion && item?.niyatQuestion?.length > 0 ).map(item => {
          let obj = {
            name: item.niyatQuestion
          }
            return [item['niyatQuestion'], obj]
        })).values()];
        break;
        case 'Approver Details': 
        this.tabPlaceholder = "Select Niyat Question"      
        this.sendFileName = "Approver-Details-" + new Date().toDateString();
        break;
    
      default:
        this.searchList = [];
        break;
    }
  }

  /******************************************************************************
   *
   * @brief Get Search List
   * @param event 
   * @return none
   *
   ******************************************************************************/
  searchData(event: any): void {
    this.obj.search = this.activeTab;
    if (event && event.length > 0 && event[0].name) {
      this.obj.searchValue = event[0].name;
    } else {
      this.obj.searchValue = '';
    }
    this.objJSONString = JSON.stringify(this.obj);
    // Refresh dropdown data when search changes or is cleared
    // This will call getAllDropDown via getReport(), repopulating searchList
    if(this.obj.searchValue === ''){
      this.getReport();
    }
  }

  /******************************************************************************
   *
   * @brief fetch record data
   * @param string event
   * @return none
   *
  ******************************************************************************/
  onChangeStatus(event: any) {
    this.obj.status = event.value;
    this.objJSONString=JSON.stringify(this.obj); 
  }

  /******************************************************************************
   *
   * @brief set tabs according to login user role
   * @param role
   * @return none
   *
  ******************************************************************************/
  setTabsRolewise(role:any){
    switch (role) {
      case 'Super Admin':
        this.tabs = ['Mumineen','Department','Umoor', 'Jamiat','Jamaat','Niyat Question', 'Approver Details'];
        break;
      case 'Umoor Head':
        this.tabs = ['Mumineen', 'Jamiat', 'Jamaat', 'Niyat Question'];
        break;
      
      case 'Dept Head':
        this.tabs = ['Mumineen', 'Jamiat', 'Niyat Question'];
        break;
       case 'Khidmat Ramadaniyah':
        this.tabs = ['Mumineen', 'Umoor', 'Niyat Question','Approver Details'];
        break;
        case 'Aamil':
        case 'Muavin Aamil':
        this.tabs = ['Mumineen', 'Umoor', 'Niyat Question'];
        break;

      case 'Jamiat Masool':
        this.tabs = ['Mumineen', 'Umoor', 'Jamaat', 'Niyat Question'];
        break;
      
      case 'Umoor Coordinator':
        this.tabs = ['Mumineen' ,'Niyat Question'];     
        break;
    
      default:
        this.tabs = ['Mumineen','Department','Umoor', 'Jamiat','Jamaat','Niyat Question'];
        break;
    }
  }

  advanceFilter(event: any){
    this.selectedFValue = event.value;
    this.createForm();
  }

  filerJamaatByJamiatID(event: any){
    this.selectedJamiatValue = event.value;
    this.getAllJamaat(event.value);
  }

  selectJamiatList(event: any){
    this.approverSearchForm.get('jamiatId')?.setValue("selectJamiat");
    this.approverSearchForm.get('jamaatId')?.setValue("selectJamaat");
  }

  /******************************************************************************
   *
   * @brief filter values
   * @param none
   * @return none
   *
  ******************************************************************************/
  createForm(): void {
    this.advSearchForm = this.fb.group({
      minage: [null, this.selectedFValue == 'By age' ? [Validators.required,Validators.pattern(config.validation.trophies.RegExp)] : [] ],
      maxage: [null, this.selectedFValue == 'By age' ? [Validators.required,Validators.pattern(config.validation.trophies.RegExp)] : [] ],
      startDate: [null, this.selectedFValue != 'By age' ? [Validators.required] : [] ],
      endDate: [null, this.selectedFValue != 'By age' ? [Validators.required] : [] ]
    });
  }

  createApproverForm(): void {
    this.approverSearchForm = this.fb.group({
      roleId: [this.roleId],
      jamiatId:[this.jamiatId],
      jamaatId:[this.jamaatId],
    });
  }
  validationMessages: any = {
    number: config.validationMessages.number,
    minMaxNumber: config.validationMessages.minMaxNumber,
    minAge: config.validationMessages.minAge,
    maxAge: config.validationMessages.maxAge,
  };

  // this.lowerThan('minage')
   
  lowerThan(field_name:any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null  => {
      const input = control.value;
      const isLower = control.root.value[field_name] >= input;

      return isLower ? {'minage': {isLower}} : null;
    }
  }

  /******************************************************************************
   *
   * @brief f() is used to get the form controls
   * @param none
   * @return controls of form
   *
   ******************************************************************************/
  get f() {
    return this.advSearchForm.controls;
  }

  /******************************************************************************
   *
   * @brief Submit update template form data
   * @param none
   * @return none
   *
   ******************************************************************************/
  onSubmit() {
    console.log('------------------------- onsubmit')
    // console.log(this.getDiffDays('07/01/2021', '07/10/2021'));
    if(this.advSearchForm.invalid || this.showMaxError) {
      this.advSearchForm.markAllAsTouched();
      return;
    } else {
      let filteredVal = this.advSearchForm.getRawValue();
      if(this.selectedFValue == 'By age'){
        this.obj.minAge = filteredVal.minage;
        this.obj.maxAge = filteredVal.maxage;
      }else{
        this.obj.startDate = moment(filteredVal.startDate).format(this.date_formate);
        this.obj.endDate = moment(filteredVal.endDate).format(this.date_formate); 
        if(this.getDiffDays(this.obj.startDate, this.obj.endDate) > 90){
          return this.toastrservice.error('Date difference should not greater than 90 days')
        }
      // console.log(this.obj.startDate - this.obj.endDate)
        // console.log(Math.floor((this.obj.startDate - this.obj.endDate)/(1000 * 60 * 60 * 24)))
      }
      this.objJSONString=JSON.stringify(this.obj); 
      this.reset();
    }
  }
  

  onSearch(): void {
    if (this.approverSearchForm.valid) {
      const formValues = this.approverSearchForm.value;

      this.obj.reportKey = 'Approver Details';
      this.obj.roleId = formValues.roleId;
      this.obj.jamiatId = formValues.jamiatId;
      this.obj.jamaatId = formValues.jamaatId;

      if (this.obj.jamaatId === 'selectJamaat') {
        delete this.obj.jamaatId;
      }

      if (this.obj.jamiatId === 'selectJamiat') {
        delete this.obj.jamiatId;
      }

      if (formValues?.roleId === 6) {
        this.columnsHeader = this.columnsHeader3;
      } else {
        this.columnsHeader = this.columnsHeader2;
      }

      this.objJSONString = JSON.stringify({ ...this.obj, paginationFlag: true });
      this.showTable = true;
    } else {
      console.error('Form is invalid');
    }
  }
  getDiffDays(sDate:any, eDate:any) {
    var startDate = new Date(sDate);
    var endDate = new Date(eDate);
    var Time = endDate.getTime() - startDate.getTime();
    return Time / (1000 * 3600 * 24);
  }

  reset(){
    this.obj.maxAge = 0;
    this.obj.minAge = 0;
    this.obj.startDate = moment().subtract(3, 'months').format(this.date_formate)
    this.obj.endDate = moment().format(this.date_formate)
  }

  checkAge(min: number,max: number) {
   this.showMaxError = min > max ? true : false;
  }
  dynamicReport(){
    this.dialog.open(DynamicReportComponent, {
      data: {'catalogue': true, 'title': 'title', 'description': 'description', record: event, buttonClose:true},
      });
  }
}