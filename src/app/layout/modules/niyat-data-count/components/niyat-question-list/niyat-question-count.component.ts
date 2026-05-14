import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NiyatDataService } from '../../../niyat-data/services/niyat-data.service';
import { Router } from '@angular/router';
import { TemplateService } from '../../../niyat-template/services/template.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-niyat-question-count',
  templateUrl: './niyat-question-count.component.html',
  styleUrls: ['./niyat-question-count.component.scss']
})
export class NiyatQuestionCountComponent implements OnInit {
  advSearchForm: any = FormGroup;
  date_formate: any = "YYYY-MM-DD HH:mm:ss";
  startDate = moment().format(this.date_formate);
  query: string = "";
  niyatList: any = "";
  searchControl = new FormControl();
  selected = 1;
  selectedTemplate:any=0;
  niyatCount:any=""
  private destroy$ = new Subject();
  niyatTemplate:any=[]
  advanceSearchKey: any = [
    { id: 1, value: "Today" },
    { id: 2, value: "Last 1 Day" },
    { id: 3, value: "Last 2 Days" },
  ];
  constructor(private fb: FormBuilder, private datepipe: DatePipe, public niyatDataService: NiyatDataService,  public niyatTemplateService: TemplateService,
    private router: Router
  ) {
    this.createForm();
    this.getDate(moment().format(this.date_formate));
  }

  ngOnInit(): void {
   
  }
  createForm(): void {
    this.advSearchForm = this.fb.group({
      templateId: [0],
      startDate: [null],
      endDate: [null]
    });
  }
niyatCountDat(){
  // niyatDataService?.
}
  get f() {
    return this.advSearchForm.controls;
  }

  onSelectionChange(event: any) {
    switch (event.value) {
      case 1:
        this.getDate(moment().subtract(0, 'days').format(this.date_formate));
        break;
      case 2:
        this.getDate(moment().subtract(1, 'days').format(this.date_formate));
        break;
      case 3:
        this.getDate(moment().subtract(2, 'days').format(this.date_formate));
        break;
      default:
        this.advSearchForm.controls['startDate'].setValue(null);
        this.advSearchForm.controls['endDate'].setValue(null);
        break;
    }
  }
  getDate(endDate: string) {
    const data = { startDate: moment(endDate).format('YYYY-MM-DD'), endDate: moment().format(this.date_formate) }
    this.advSearchForm?.patchValue({startDate:data?.startDate+' 00:00:00', endDate:data?.endDate});
    this.advSearchForm.controls['templateId'].setValue(0);
    this.getNiyatTemplateList()
  }
  templateIdData(event: any) {
    let obj = {
      templateId:event,
      startDate:this.advSearchForm?.value?.startDate,
      endDate:this.advSearchForm?.value?.endDate,
      scanned:false
    }
    if(event){
      this.niyatList=obj
    }
    
  }

  niyatcolumnsHeader = [
    {
      columnDef: "question",
      header: "Niyat Question",
      dataName: (row: any) => `${row.question || "-"}`,
    },
    {
      columnDef: "attempted",
      header: "Attempted",
      dataName: (row: any) => `${row.attempted || 0} `,

    },
    {
      columnDef: "notAttempted",
      header: "Not Attempted",
      dataName: (row: any) => `${row.notAttempted || 0}`,
    },
  ]
  columnsHeader = [
    {
      columnDef: "itsID",
      header: "Its Id",
      dataName: (row: any) => `${row.itsId || "-"}`,
    },
    {
      columnDef: "userName",
      header: "Name",
      dataName: (row: any) =>  `${row.userName || "-"}`,

    },
    {
      columnDef: "phoneNumber",
      header: "Phone Number",
      dataName: (row: any) =>  `${row.phoneNumber || "-"}`,

    },
    {
      columnDef: "templateName",
      header: "Template Name",
      dataName: (row: any) =>  `${row.templateName || "-"}`,

    },
    {
      columnDef: "niyatDate",
      header: "Niyat Date",
      dataName: (row: any) => `${this.datepipe.transform(row.niyatDate, "dd-MM-yyyy") || "-"}`,

    },
    {
      columnDef: "jamiatName",
      header: "Jamiat",
      dataName: (row: any) => `${row.jamiatName || "-"}`,
    },
    {
      columnDef: "jamaatName",
      header: "Jamaat",
      dataName: (row: any) => `${row.jamaatName}`,
    },
    {
      columnDef: "action",
      header: "Action",
      dataName: (row: any) => `${row.status}`,
    },
  ];


  fetchedRecord(event: any) {
    this.niyatCount=event?.data?.niyatTotalCount;
    if (event.statusRow) { }
    if (event.update) {
      let lId = btoa(event.update.templateId + '-' + event.update.itsId + '-' + 'true');
      this.router.navigateByUrl(`/admin/niyat-data-form/edit/${lId}`);
    }
  }
  searchByIts(event: any) {
    let obj = {
      templateId:"",
      startDate:this.advSearchForm?.value?.startDate,
      endDate:this.advSearchForm?.value?.endDate,
      scanned:true,
      itsId:event.target.value
    }
    if (event.target.value.length == 0){
      this.niyatList = obj;
    } 
   
    if (event.target.value.length == 8) {
      this.niyatList = obj;
    }
   
    
  }

  emptySearch() {
    this.searchControl = new FormControl();
    this.query = "";
    let obj = {
      templateId:this.advSearchForm?.value?.templateId,
      startDate:this.advSearchForm?.value?.startDate,
      endDate:this.advSearchForm?.value?.endDate,
      scanned:true,
      itsId:""
    }
   
      this.niyatList = obj;
    
  }
  againCall(evn: any) {
    let obj = {
      templateId:this.advSearchForm?.value?.templateId,
      startDate:this.advSearchForm?.value?.startDate,
      endDate:this.advSearchForm?.value?.endDate,
      scanned:evn?.index===1?true:false,
      itsId:""
    }
    this.searchControl = new FormControl();
      this.niyatList = obj;
  }
  getNiyatTemplateList(): void {
    this.niyatDataService.getScanedNiyatTemplates(this.advSearchForm?.value?.startDate,this.advSearchForm?.value?.endDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.niyatTemplate = data;
        this.refreshTable();
      });

  }
  refreshTable() {
    let obj = {
      templateId:0,
      startDate:this.advSearchForm?.value?.startDate,
      endDate:this.advSearchForm?.value?.endDate,
      scanned:false,
      itsId:""
    }
      this.niyatList = obj;
  }

}
