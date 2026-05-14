import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { TemplateService } from "../../services/template.service";
import { DownloadXLSQuestionsService } from '../../services/downloadXLSQuestions.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonService } from '../../../dashboard/service/common.service';
import { MatDialog } from '@angular/material/dialog';
import {QrcodeScanComponent} from '../../../../../shared/componets/qrcode-scan/qrcode-scan.component'
import { SmartDialogDeleteComponent } from '../../../../../shared/componets/smart-dialog/smart-dialog-delete.component';


@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})

export class TemplateListComponent implements OnInit {

  templateList: any[] = [];
  columnsHeader = [
    {
      columnDef: "templateId",
      header: "Niyat Template Id",
      dataName: (row: any) => `${row.templateId || "-"}`,
    },
    {
      columnDef: "templateName",
      header: "Niyat Template Name",
      dataName: (row: any) => `${row.templateName || "-"}`,
    },
    {
      columnDef: "createdAt",
      header: "Created Date",
      dataName: (row: any) => `${this.datepipe.transform(row.createdAt, "dd-MM-yyyy") || "-"}`,
    },
    {
      columnDef: "status",
      header: "Status",
      dataName: (row: any) => `${row.userStatus}`,
    },
    {
      columnDef: "action",
      header: "Action",
      dataName: (row: any) => `${row.status}`,
    },
  ];

  private destroy$ = new Subject();


  constructor(
    private toastrservice: ToastrService,
    private templateservice: TemplateService,
    private changeDetection: ChangeDetectorRef,
    private router: Router,
    private _downloadXLSQuestionsService : DownloadXLSQuestionsService,
    private datepipe: DatePipe,
    public commonservices: CommonService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getTemplateList();
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
   getTemplateList(): void {
    this.templateservice.getTemplateList().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.templateList = data;
      this.changeDetection.detectChanges();
    });
  }

  /******************************************************************************
   *
   * @brief Call fetchedRecord 
   * @param string templateId
   * @return none
   *
   ******************************************************************************/

  fetchedRecord(event: any) {
    if (event.statusRow) {
      this.templateservice
        .getStatusTemplate(event.statusRow.templateId)
        .pipe(takeUntil(this.destroy$)).subscribe(
          (res) => {
            this.toastrservice.success(this.commonservices.toTitleCase(res.message));
            this.getTemplateList();
          },
          (error) => {
            console.log(error);
          }
        );
    } 
    if (event.update) {
      let lId =  btoa(event.update.templateId);
      this.router.navigateByUrl(`/admin/niyat-template/edit/${lId}`);
    }
    if(event.downloadRow){
      ['templateDescription', 'itsId'].forEach(e => delete event.downloadRow[e]);
      this._downloadXLSQuestionsService.adjustHeader(event.downloadRow);
      // this.getTemplateList();
    }
    if(event?.qrCodeScan){
      this.templateservice.generateQRCode(event?.qrCodeScan?.templateId).pipe(takeUntil(this.destroy$)).subscribe(
        (res:any)=>{
          this.toastrservice.success(this.commonservices.toTitleCase(res.message));
          this.getTemplateList();
        },(error) => {
          console.log(error);
        }
      );
    }
    if(event?.qrCodeScanView){
       this.templateservice.expireQRCode(event?.qrCodeScanView).pipe(takeUntil(this.destroy$)).subscribe(
      (res:any)=>{
        this.toastrservice.success(this.commonservices.toTitleCase(res.message));
        this.getTemplateList();
      },(error) => {
        console.log(error);
      }
    );
    
    }
    if (event.clone) {
      const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
        width: '450px',
        data: { name: 'Are you sure you want to clone this niyat templates?', heading: '', buttonSubmit: 'Confirm', buttonCancel: 'Discard', record: event.clone },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          let lId = btoa(event.clone.templateId);
          this.router.navigate(['/admin/niyat-template/add'], { queryParams: { cloneId: lId } });
        }
      });
    }
  }

  

}
