import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/auth/service/storage/localstorage.service';
import { CatalogueService } from 'src/app/layout/modules/catalogue/service/catalogue.service';
import { MuminDashboardService } from 'src/app/layout/modules/mumin-dashboard/service/mumin-dashboard.service';
import { NiyatDataService } from 'src/app/layout/modules/niyat-data/services/niyat-data.service';

import { config } from 'src/app/shared/models/validation_config';
import { SharedataService } from '../../services/sharedata.service';
import { Subject } from 'rxjs';
import { Workbook } from 'exceljs';
import * as fs from "file-saver";
import { DatePipe } from '@angular/common';

export interface DialogData {
  record: any;
  name: any;
}

@Component({
  selector: 'app-smart-dialog-delete',
  templateUrl: './smart-dialog-delete.component.html',
  styleUrls: ['./smart-dialog-delete.component.scss'],
})

export class SmartDialogDeleteComponent implements OnInit {
  
  sendMsgForm:any = FormGroup;
  sendApproveal:any=FormGroup
  formtdata:any;
  revertNiyatForm:any=FormGroup;
  catalogueType:any;
  itemId:any
  muminList$: Subject<any> = new Subject<any>();
  downloadButtonTitle="Download Mumin";
  sendHeader: any[] = [];
  sendTableId = 'smartTableData';
  sendTitle = 'Mumin Data';
  sendFileName = 'Mumin-data';
  searchControl = new FormControl();
 niyatQuestionEnglish: string = ''
 checkboxSelectedVal: any[] = [];
  validationMessages: any = {
    subject: config.validationMessages.subject,
    messageText: config.validationMessages.message,
    remarks:config.validationMessages.remarks,
  }

  rejectForm: any = FormGroup;
  confirmDeactivateForm: any = FormGroup;
   mode: string = '';
   isConfirmMode: boolean = false;
  columnsHeader = [
    {
      columnDef: "itsId",
      header: "Its Id",
      dataName: (row: any) => `${row.itsId || "-"}`,
    },
    {
      columnDef: "name",
      header: "Name",
      dataName: (row: any) => `${row.name|| "-"}`,

    },
    {
      columnDef: "trophiesRedeemed",
      header: "Trophies Redeemed",
      dataName: (row: any) => `${row.trophiesRedeemed || "-"}`,
    },
    {
      columnDef: "action",
      header: "Action",
      dataName:  (row: any) => `${row?.action}`,
    },
    {
      columnDef: "select",
      header: "Select",
      dataName: (row: any) => `${row || "-"}`,
    },
   
  ];

  query=""
  products:any=[]
  
  constructor(
    public dialogRef: MatDialogRef<SmartDialogDeleteComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private LocalService: LocalStorageService,
    private toastrservice: ToastrService,
    private muminDashboardSr: MuminDashboardService,
    private sharedata: SharedataService,
    private router: Router,
    public dialog: MatDialog,
    public caterlogue: CatalogueService,
    private datepipe: DatePipe,
    
  ) {
   
    if(data?.imageScanPath2!==null && data?.imageScanPath2!==undefined){
    this.products = [
      {
     
        images: [
          {
            image:data?.imageScanPath,
            thumbImage:data?.imageScanPath,
          },
          {
            image:data?.imageScanPath2,
            thumbImage:data?.imageScanPath2,
          },
        ]
      },
      
    ];
  }else{
    this.products = [
      {
     
        images: [
          {
            image:data?.imageScanPath,
            thumbImage:data?.imageScanPath,
          }
        ]
      },
      
    ];
  }
 
  }
 

  ngOnInit(): void {

    if(this.data.form == "sendMessage"){
     this.createForm();
    }
    if(this.data.getReward== 'reward'){
      this.createForm1()
    }
    if(this.data.form1 == "revertForm"){

      this.createFormRevert();
    }
     if (this.data.form2 === "rejectForm") {
    this.createRejectForm();  
    }
    this.mode = this.data.mode
    this.isConfirmMode = this.mode === 'confirm';
    console.log('Full row data:', this.data.niyatDetails); 
    if (this?.data?.niyatDetails?.niyatDeactivateBtn?.niyatQuestionEnglish) {
    this.niyatQuestionEnglish = this.data?.niyatDetails?.niyatDeactivateBtn?.niyatQuestionEnglish;
    }else{
      this.niyatQuestionEnglish = this.data?.niyatDetails?.confirmNiyatDeactivateBtn?.niyatQuestionEnglish;
    }
    
    // if(this.data.catalogueType){
    //   this.catalogueType= this.data.catalogueType
    // }
    // if(this.data.itemId){
    //   this.itemId= this.data.itemId
    // }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  record() {
    this.dialogRef.close(this.data.record);
  }
  

  /******************************************************************************
  * @brief Create the send Message Form
  * @param none
  * @return none
  *
  ******************************************************************************/
  createForm(): void {
    this.sendMsgForm = this.fb.group({
      subject:[null, [Validators.required,Validators.minLength(config.validation.subject.minLength), Validators.maxLength(config.validation.subject.maxLength)]],
      messageText:[null,[Validators.required,Validators.minLength(config.validation.message.minLength), Validators.maxLength(config.validation.message.maxLength)]],
    });
  }

  /******************************************************************************
  * @brief Create the send Message Form
  * @param none
  * @return none
  *
  ******************************************************************************/
   createForm1(): void {
    this.sendApproveal = this.fb.group({
      approval:[null],
      approval1:[null],
      approval2:[null]
     });
  }


  /******************************************************************************
   *
   * @brief f() is used to get the form controls
   * @param none
   * @return controls of form
   *
   ******************************************************************************/
  get f() {
    return this.sendMsgForm.controls;
  }


  /******************************************************************************
   *
   * @brief f() is used to get the form controls
   * @param none
   * @return controls of form
   *
   ******************************************************************************/
   get g() {
    return this.sendApproveal.controls;
  }

  alertConfirm(){
    if(this.sendApproveal.invalid) {
      this.sendApproveal.markAllAsTouched();
      return false;   
    }else{
      let req = this.sendApproveal.getRawValue();
      if(req.approval >= 0 || req.approval1 >= 0 || req.approval2 >= 0){
        if(req.approval+req.approval1+req.approval2 > this.data.niyatInfo[0].trophiesAwarded){
          this.toastrservice.error('Trophy count should not be greater than total trophy.');
        }else{
          this.dialogRef.close();
          const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
            data: { buttonClose:true, record:'data-profile',niyatId:this.data.niyatId,approval:req.approval,approval1:req.approval1,approval2:req.approval2,approvalName:this.data.approve1,approvalName1:this.data.approve2,approvalName2:this.data.approve3},
          });   
        }
      }else{
        this.toastrservice.error('Value should be greater than 0');
      }
    
    }   
  }
   /******************************************************************************
  *
  * @brief send message 
  * @param none
  * @return none
  *
  ******************************************************************************/
 sendRecord() {
  if (this.data.form2 === 'rejectForm') {
   if (this.isConfirmMode) {
      this.dialogRef.close({ deactivationRequestId: this.data.niyatDetails?.confirmNiyatDeactivateBtn?.deactivationRequestId});  // ✅ Close with confirm = true
      return;
    }
    if (this.rejectForm.invalid) {
      this.rejectForm.markAllAsTouched();
      return false;
    } else {
      const payload = {
    comment: this.rejectForm.value.messageText,
    niyatId: this.data.niyatDetails?.niyatDeactivateBtn?.niyatId,
    fullRow: this.data.niyatDetails?.niyatDeactivateBtn?.deactivationRequestId
  };
      // const req = this.rejectForm.getRawValue();
      this.dialogRef.close(payload);
    }
    
  } else if(this.sendMsgForm.invalid) {
      this.sendMsgForm.markAllAsTouched();
      return false;
    }else{
      let req = this.sendMsgForm.getRawValue();
      this.dialogRef.close(req);
    }
}

  cancel(){
    this.dialogRef.close();
  }

  sendConfirm(){
     let approval = (this.data.approval)?this.data.approval:'';
     let approval1 = (this.data.approval1)?this.data.approval1:'';
     let approval2 = (this.data.approval2)?this.data.approval2:'';
     const dataJson=[];  
     if(approval){
       dataJson.push(
         {
           roleName: this.data.approvalName,
           trophyCount: approval
         }
       )
     }
     if(approval1){
       dataJson.push(
         {
           roleName: this.data.approvalName1,
           trophyCount: approval1
         }
       )
     }
     if(approval2){
      dataJson.push(
        {
          roleName: this.data.approvalName2,
          trophyCount: approval2
        }
      )
    }
     let reqdata ={
        fromItsId:this.LocalService.get("itsId"),
        niyatId:this.data.niyatId,
        rewards:dataJson
     }
     this.muminDashboardSr.sendReward(reqdata)
     .pipe()
     .subscribe((res) => {        
       if(res == null){
         this.toastrservice.error(res.errorMessage);
       }else{
         this.router.navigateByUrl(`/niyat-information/`+this.data.niyatIdParamms);
         this.sharedata.changeMessage("reload-niyat")
         this.toastrservice.success(res.message);
         this.dialogRef.close();     
       }
     })
       this.dialogRef.close();
     }
  
  

/******************************************************************************
  * @brief Create the send Message Form
  * @param none
  * @return none
  *
  ******************************************************************************/
 createFormRevert(): void {
  this.revertNiyatForm = this.fb.group({
    remarks:[null,[Validators.required,Validators.minLength(config.validation.message.minLength), Validators.maxLength(config.validation.message.maxLength)]],
  });
}



 createRejectForm(): void {
  this.rejectForm = this.fb.group({
    messageText: [
      null,
      [
        Validators.required,
        Validators.minLength(config.validation.message.minLength),
        Validators.maxLength(config.validation.message.maxLength),
      ],
    ],
  });
}

get fr() {
  return this.rejectForm.controls;
}

sendRejectRecord() {
  if (this.rejectForm.invalid) {
    this.rejectForm.markAllAsTouched();
    return false;
  } else {
    const req = this.rejectForm.getRawValue();
    this.dialogRef.close(req);
  }
}
/******************************************************************************
   *
   * @brief fg() is used to get the form controls
   * @param none
   * @return controls of form
   *
   ******************************************************************************/
 get fg() {
  return this.revertNiyatForm.controls;
}
 /******************************************************************************
  *
  * @brief send revert remarks
  * @param none
  * @return none
  *
  ******************************************************************************/
  sendRevertRecord(){
    if(this.revertNiyatForm.invalid) {
      this.revertNiyatForm.markAllAsTouched();
      return false;
    }else{
      let req = this.revertNiyatForm.getRawValue();
      this.dialogRef.close(req);
    }
  }
 
  downloadFileData(data:any): void {
    this.muminDashboardSr.getMuminCatalgoExcel(data?.itemId,data?.catalogueType)
    .pipe()
    .subscribe((res) => { 
      if(res == null){
      }else{
        let newdata:any=[]
          res?.map((item:any)=>{
          newdata?.push({ 
                ItsId: item?.itsId,
                Name:item?.name,
                TrophiesRedeemed:item?.trophiesRedeemed,
                Acknowledge:item?.isAcknowledged?'Yes':'No',  
                DateTime: this.datepipe.transform(item?.createdAt+'Z',"dd-MM-yyyy HH:mm:ss"),
                Jamaat: item?.jamaat || 'NA',
                Jamiat: item?.jamiat || 'NA',
                ContactNumber: item?.contactNumber || 'NA'
            })
        })
       let tmpHeader=["ItsId","Name","TrophiesRedeemed","Acknowledge","Date/Time","Jamaat","Jamiat","contact number"];
       this.sendHeader.push(tmpHeader);
       this.muminList$.next(newdata);
      }
    })
 }
 
 singleRowDownload(data: any, fileName: string = 'Mumin-data'){
const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
    // Format the date
  const formattedDateTime = this.datepipe.transform(data?.createdAt+'Z',"dd-MM-yyyy HH:mm:ss");

  // Convert object to key-value array for a simple row
  let tmpHeader=["ItsId","TrophiesRedeemed","Name","Date/Time","Acknowledge","Jamaat","Jamiat","contact number"];
  // Manually map values in same order as header
  const values = [
    data?.itsId || '',
    data?.trophiesRedeemed || '',
    data?.name || '',
    formattedDateTime,
    data?.isAcknowledged ? 'Yes' : 'No',
    data?.jamaat || 'NA',
    data?.jamiat || 'NA',
    data?.contactNumber || 'NA'
  ];
//   const headers = Object.keys(tmpHeader);
//   const values = Object.values(data);

  // Add headers and values to worksheet
  worksheet.addRow(tmpHeader);
  worksheet.addRow(values);

  // Write and download
  workbook.xlsx.writeBuffer().then((buffer: any) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    fs.saveAs(blob, `${fileName}.xlsx`);
  });
 }
 fetchedRecord(event: any) {
  if (event?.checkboxSelectedVal) {
  this.checkboxSelectedVal = Array.isArray(event.checkboxSelectedVal)
    ? event.checkboxSelectedVal
    : [event.checkboxSelectedVal?.record];
  return;
}

  if(event?.acknowledgeRow) {
    let dateStr=event?.acknowledgeRow?.createdAt?.split('T')
    let date=dateStr[0]+' '+ dateStr[1]
    let obj={
      itsId:event?.acknowledgeRow?.itsId,
      catalogueType:event?.acknowledgeRow?.catelogType,
      crnDate:date
    }
    const arrayOfOne = [obj];
    this.muminDashboardSr.acknowRedeemTrophies(arrayOfOne)
    .pipe()
    .subscribe((res) => {        
      if(res == null){
        this.toastrservice.error(res.errorMessage);
      }else{
        this.toastrservice.success(res?.message);
        this.dialogRef.close();     
      }
    })
      this.dialogRef.close();
   }
   if(event.downloadRow){
 
      this.singleRowDownload(event.downloadRow);
      
    }
  } 

 formatDateTime(dateString: string | Date): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

  searchByIts(event:any){
    if(event.target.value.length == 0) this.query = '';
    if(event.target.value.length == 8){
      this.query = event.target.value
    }
  }

  emptySearch() {
    this.searchControl = new FormControl();
    this.query = "";
  }
 showConfirmation = false;

openConfirmation() {
  this.showConfirmation = true;
}

closeConfirmation() {
  this.showConfirmation = false;
}

confirmAction() {
  // your allAcknowledged logic here
  this.showConfirmation = false;
  this.acknowledgeAll(); // Call your method here
}
acknowledgeAll() {
  if (Array.isArray(this.checkboxSelectedVal) && this.checkboxSelectedVal.length > 0) {
    // Map each selected item to the expected data shape with formatted date
    const data = this.checkboxSelectedVal.map((item: any) => {
      let crnDate = item.createdAt;
      if (crnDate && typeof crnDate === 'string') {
        const dateParts = crnDate.split('T');
        crnDate = dateParts[0] + (dateParts[1] ? ' ' + dateParts[1] : '');
      }
      return {
        itsId: item.itsId,
        catalogueType: item.catelogType, // fallback if inconsistent naming
        crnDate: crnDate,
      };
    });
    this.muminDashboardSr.acknowRedeemTrophies(data)
      .pipe()
      .subscribe({
        next: (res) => {
          if (res) {
            this.toastrservice.success(res?.message || 'Acknowledged successfully');
            this.dialogRef.close();
          } else {
            this.toastrservice.error(res?.message || 'An error occurred');
          }
        },
        error: (err) => {
          console.error(err);
          this.toastrservice.error('Failed to acknowledge. Please try again.');
        }
      });
  } else {
    this.toastrservice.warning('Please select at least one item to acknowledge.');
  }
}
  

}






