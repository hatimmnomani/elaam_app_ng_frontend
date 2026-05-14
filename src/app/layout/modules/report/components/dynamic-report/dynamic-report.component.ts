import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from 'src/app/auth/service/storage/localstorage.service';
import { ReportsService } from '../../services/reports.service';
import { debounceTime, takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { config } from 'src/app/shared/models/validation_config';
import * as moment from 'moment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DepartmentService } from '../../../department/services/department.service';
import { SendMessageService } from '../../../send-message/service/send-message.service';
import { SmartDialogDeleteComponent } from 'src/app/shared/componets/smart-dialog/smart-dialog-delete.component';
import { NiyatQuestionService } from '../../../niyat-question/services/niyat-question.service';
import { UmoorService } from '../../../umoor/services/umoor.service';

@Component({
  selector: 'app-dynamic-report',
  templateUrl: './dynamic-report.component.html',
  styleUrls: ['./dynamic-report.component.scss']
})
export class DynamicReportComponent implements OnInit {
  date_formate: any= "YYYY-MM-DD";
  startDate = moment().format(this.date_formate);
  getListData:any=[];
  private destroy$ = new Subject();
  departmentDataList:any=[];
  umoorDataList:any=[];
  jamaatDataList:any=[]
  jamiatDataList:any=[]
  questionDataList:any=[]
  searchControl = new FormControl();
  selected:any = 6;

  advSearchForm: any = FormGroup;
  showMaxError = false;
  selectedFValue: string = '';
 
  selectedDeparment:any=null
  advanceSearchKey: any = [
    { id: 5, value: "All" },
    { id: 4, value: "1 year" },
    { id: 3, value: "Last 6 Months" },
    { id: 2, value: "Last 3 Months" },
    {id:'By date', value: 'Custom date' },
  ];
  allStatus: any = [
    { id: 1, value: "Active" },
    { id: 2, value: "Approval Pending" },
    { id: 3, value: "Completed" },
  ];
  ageDto=[{id:'By age', value: 'By age' }]
  obj:any =  {
    "reportKey"  : "Mumineen",
    "search"     : "",
    "startDate"  : "",
    "endDate"    : "",
    "status"     : 1,
    "maxAge"     : 0,
    "minAge"     : 0
  }
  tabPlaceholder='department'
  constructor(
    public dialogRef: MatDialogRef<DynamicReportComponent>,
    public reportService: ReportsService,    
    private datepipe: DatePipe,
    private localService: LocalStorageService,
    private fb: FormBuilder,
    private toastrservice: ToastrService,
    private departmentService:DepartmentService,
    private sendmessageservice: SendMessageService,
    public dialog: MatDialog,
    private niyatQuestionService:NiyatQuestionService,
    private umoorService:UmoorService
  ) { 
    this.createForm();
  }

  ngOnInit(): void {
    this.getDepartmentAll();
    this.getAllJamiat();
    this.getAllJamaat();
    this.getAllQuestion();
   this.getAllUmoor();
  }
 
  get f() {
    return this.advSearchForm.controls;
  }
  getDepartmentAll(){
    this.departmentService.getDepartmentList().pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.departmentDataList = data;
     
    });
  }
  getAllJamiat(){
    this.sendmessageservice?.getDataByID("getAllJamiat",'').pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.jamiatDataList=data;
    }) 
  }

  getAllJamaat(){
    this.sendmessageservice?.getDataByID("getAllJamaat",'').pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.jamaatDataList=data
     
    }) 
  }
  getAllQuestion() {
    this.niyatQuestionService.getQuestionList().pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data && data.length > 0) {
          this.questionDataList=data;
        }
      });
  }
  getAllUmoor(){
    this.umoorService?.getUmoorList().pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.umoorDataList=data
     
    }) 
  }
  departmentData(event: any) {
    
  }
  jamiatData(event: any){
  if (event?.value && event?.value?.length > 0) {
    this.jamaatFilterData(event?.value);
  }else{
    this.getAllJamaat();
  }
  }
  jamaatFilterData(ids:any){
    this.reportService.filerJamaatByJamiat(ids).pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      if (data && data.length > 0) {
        this.jamaatDataList=data
      }
    });
  }

 

  onSelectionChange(event: any){ 
    console.log(event.value+'ds')
    this.selectedFValue = event.value;
    switch (event.value) {
      case 1:
        this.getDate(moment().subtract(1, 'months').format(this.date_formate));
        break;
      case 2:
        this.getDate(moment().subtract(3, 'months').format(this.date_formate));
        break;
      case 3:
        this.getDate(moment().subtract(6, 'months').format(this.date_formate));
        break;
      case 4:
          this.getDate(moment().subtract(1, 'years').format(this.date_formate));
          break;
      case 5:
          this.advSearchForm.controls['startDate'].setValue(null);
          this.advSearchForm.controls['endDate'].setValue(null);
          break;
      default:
        this.advSearchForm.controls['startDate'].setValue(null);
        this.advSearchForm.controls['endDate'].setValue(null);
        break;
    }
  }
  getDate(endDate:string) {
    const data = {startDate: endDate, endDate: moment().format(this.date_formate)}
    this.advSearchForm?.patchValue({startDate:data?.startDate, endDate:data?.endDate});
  }

  createForm(): void {
    this.advSearchForm = this.fb.group({
      minage: [null, [Validators.pattern(config.validation.trophies.RegExp)]],
      maxage: [null, [Validators.pattern(config.validation.trophies.RegExp)]],
      startDate: [null, [Validators.required] ],
      endDate: [null, [Validators.required] ],
      itsId:[null,[Validators.pattern(config.validation.number.regExp)]],
      departmentName:[],
      Jamiat:[],
      Jamaat:[],
      niyatQuestion:[],
      Umoor:[],
      status:[]
    });
  }
  checkAge(min: number,max: number) {
    this.showMaxError = min > max ? true : false;
   }
  validationMessages: any = {
    number: config.validationMessages.number,
    minMaxNumber: config.validationMessages.minMaxNumber,
    itsId: config.validationMessages.itsId,
    minAge: config.validationMessages.minAge,
    maxAge: config.validationMessages.maxAge,
  };


  onSubmit() {
  
    if((((this.advSearchForm?.controls?.endDate?.invalid || this.advSearchForm?.controls?.startDate?.invalid )&& this.selectedFValue==='By date') || 
    this.showMaxError || this.advSearchForm?.controls?.itsId?.invalid )) {
      this.advSearchForm.markAllAsTouched();
      return false
    } else {
  
      let filteredVal = this.advSearchForm.getRawValue();
      let sendTo:any =this.localService?.get("itsId") || null;
      let obj={
        department:filteredVal?.departmentName,
        endDate:filteredVal.endDate!==null?moment(filteredVal.endDate).format(this.date_formate):filteredVal.endDate,
        itsId: (filteredVal?.itsId!==null && filteredVal?.itsId!=="")?parseInt(filteredVal?.itsId):null,
        jamaat:filteredVal?.Jamaat,
        jamiat: filteredVal?.Jamiat,
        maxAge: filteredVal?.maxage,
        minAge: filteredVal?.minage,
        niyatQuest: filteredVal?.niyatQuestion,
        sendTo:parseInt(sendTo),
        startDate:filteredVal.startDate!==null?moment(filteredVal.startDate).format(this.date_formate):filteredVal.startDate,
        umoor: filteredVal?.Umoor,
        status: filteredVal?.status ? [filteredVal?.status] : null,
      }
      let objJSONString=JSON.stringify(obj);
      this.reportService.sendRequestData(objJSONString).pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if(data?.message==="Report Generation Process Initiated"){
          this.dialogRef.close();
          this.dialog.open(SmartDialogDeleteComponent, {
          width: '450px',
          data: { name: 'Thank you for your patience while we generate the report. Please check your email shortly for a link to the download.', heading:'', buttonSubmit:'Ok', record: "" },
        });
        }
      });
      
    }
  }

  ngAfterViewInit(): void {
    this.searchControl.valueChanges.pipe(debounceTime(1000)).subscribe(
      value => {
        this.obj.search = value;
        if(!config.validation.number.regExp.test(value)){
          this.toastrservice.error(config.validationMessages.itsId)
          return false
        }
        }
    )
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
