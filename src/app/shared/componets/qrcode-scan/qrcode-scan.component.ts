import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/auth/service/storage/localstorage.service';
import * as printJS from 'print-js';
import { TemplateService } from 'src/app/layout/modules/niyat-template/services/template.service';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/layout/modules/dashboard/service/common.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-qrcode-scan',
  templateUrl: './qrcode-scan.component.html',
  styleUrls: ['./qrcode-scan.component.scss']
})
export class QrcodeScanComponent implements OnInit {
  isQrCode:any=false
  templateId:any="";
  images_urls:any=[];
  private destroy$ = new Subject();
  constructor(
    public dialogRef: MatDialogRef<QrcodeScanComponent>,
    private toastrservice: ToastrService,
    public commonservices: CommonService,
 
  
    @Inject(MAT_DIALOG_DATA) public data: any,
    
  ) { 
   if(data?.isQrCode){
    this.templateId= data?.data?.templateId;
    this.images_urls=data?.data?.qrUrl;
    this.isQrCode=data?.isQrCode;
   }
  
  }

  ngOnInit(): void {
    
   
  }

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }


 printPdf() {
  printJS({
      printable: this.images_urls,
      type: "image",
      header: "", // Optional
      showModal: true, // Optional
      modalMessage: "Printing Qr Code...", // Optional
      style: "img { width: 300px;height: 300px;}" // Optional})
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  mnaulExpire(ids:any){
    this.dialogRef.close(ids);
  }

}
