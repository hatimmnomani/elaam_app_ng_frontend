import { ChangeDetectorRef, ViewChild ,Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { NiyatDataService } from "../../services/niyat-data.service";
import { TemplateService } from "../../../niyat-template/services/template.service";
import { DepartmentService } from "../../../department/services/department.service";
import { Subject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { takeUntil } from "rxjs/operators";
import { DatePipe } from '@angular/common';
import { CommonService } from "../../../dashboard/service/common.service";
import { FormControl } from "@angular/forms";
import { SmartDialogDeleteComponent } from "src/app/shared/componets/smart-dialog/smart-dialog-delete.component";
import { LocalStorageService } from "src/app/auth/service/storage/localstorage.service";


@Component({
  selector: 'app-niyat-data-list',
  templateUrl: './niyat-data-list.component.html',
  styleUrls: ['./niyat-data-list.component.scss']
})
export class NiyatDataListComponent implements OnInit {
  @ViewChild('dnMenuTrigger') trigger: MatMenuTrigger;
  @ViewChild('upMenuTrigger') uptrigger: MatMenuTrigger;
  query: string = "";
  searchControl = new FormControl();


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
      columnDef: "itsID",
      header: "Its Id",
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
      dataName: (row: any) => `${row.jamaat}`,
    },
    {
      columnDef: "status",
      header: "Status",
      dataName: (row: any) => `${this.checkStatus(row.status)}`
    },
    {
      columnDef: "action",
      header: "Action",
      dataName: (row: any) => `${row.status}`,
    },
  ];

  sendTitle = 'Niyat Data';
  sendFileName = 'Niyat-data';
  sendTableId = 'smartTableData';
  downloadButtonTitle="Download Niyat";
  defaultSelected = 0;
  sendData: any;
  niyatStatusList$: Subject<any> = new Subject<any>();
  sendHeader: any[] = [];
  niyatTemplate:any[] = [];
  isTemplateClicked:boolean = false;
  isUpTemplateClicked:boolean = true;
  List:any = [];
  excelToUpload: File | null = null;
  fileName: string="No File Chosen";
  private destroy$ = new Subject();
  userrole: string = "";

  constructor(
    private toastrservice: ToastrService,
    private changeDetection: ChangeDetectorRef,
    private router: Router,
    public niyatDataService: NiyatDataService,
    private niyatTemplateService: TemplateService,
    private departmentService: DepartmentService,
    public dialog: MatDialog,
    private datepipe: DatePipe,
    public commonservices: CommonService,
    private localService: LocalStorageService
  ) { }

  ngOnInit(): void {
    const data: any = this.localService.get("role");
    this.userrole = JSON.parse(data);
    this.getNiyatTemplateList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

  /******************************************************************************
   *
   * @brief Get getNiyatTemplate list
   * @return none
   *
   ******************************************************************************/
    getNiyatTemplateList(): void {
        this.niyatTemplateService.getTemplateList().pipe(takeUntil(this.destroy$)).subscribe((data) => {
          this.niyatTemplate = data;
        });    
    }

    /******************************************************************************
  *
  * @brief Creating data for file download
  * @param none
  * @return download 
  *
  ******************************************************************************/
 downloadFileData(): void {
   this.niyatStatusList$.next(this.List);
   this.defaultSelected = 0;
}

 /******************************************************************************
 *
 * @brief On Change downalod  niyat template 
 * @param none
 * @return none
 *
 ******************************************************************************/
  onChangeNiyatTemplate(event: any){
    if(event.value != null && event.value > 0){
      const tmpTbl:any[] = [];
      const tmpHeader:any[] = [];
      const tmpHeader2:any[] = [];
      this.sendHeader.length = 0;
      this.List.length = 0;
        this.niyatDataService.getTemplateByID(event.value).pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.sendFileName = data.templateName; 
            tmpHeader.push("Template Id");
            tmpHeader.push(data.templateId+'');
            tmpHeader2.push("Template Name");
            tmpHeader2.push(data.templateName+'');
            tmpTbl.push("Its Id");
            tmpTbl.push("Niyat Date (dd/mm/yyyy)");
            for (var key in data.niyatQuest) {
              let addVal:any = data.niyatQuest[key].questionenglish != null ? data.niyatQuest[key].questionenglish + ' /' :  '- /'  
                addVal += data.niyatQuest[key].questionarabic != null ? data.niyatQuest[key].questionarabic + ' (' :  '- ('   
                addVal += data.niyatQuest[key].quesLabel != null ? data.niyatQuest[key].quesLabel + ' )' :  '- )'   
              tmpTbl.push(addVal);             
            }
            
            this.sendHeader.push(tmpHeader);
            this.List.push(tmpHeader2);
            this.List.push(tmpTbl);
            this.isTemplateClicked = true;
        });
      }else{
        this.isTemplateClicked = false;
      }
   }

    /******************************************************************************
 *
 * @brief On Change upload niyat template 
 * @param none
 * @return none
 *
 ******************************************************************************/
  onChangeUploadNiyatTemplate(event: any){
    if(event.value!=null && event.value>0){
      this.isUpTemplateClicked = true;
    }else{
        this.isUpTemplateClicked = false;
      }
   }

        /******************************************************************************
   *
   * @brief Call fetchedRecord
   * @param string event chargerUid  questionId
   * @return none
   *
   ******************************************************************************/

  fetchedRecord(event: any) { 
    if(event.statusRow) {} 
    if(event.update) {
      let lId =  btoa(event.update.templateId+'-' + event.update.itsId);
      this.router.navigateByUrl(`/admin/niyat-data/edit/${lId}`);
    }
    if(event.viewRow) {
      let lId =  btoa(event.viewRow.niyatId);
      this.router.navigateByUrl(`/niyat-information/${lId}`);
    }
    if (event.clone) {
      const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
        width: '450px',
        data: { name: 'Are you sure you want to clone this Niyat Template?', heading: '', buttonSubmit: 'Confirm', buttonCancel: 'Discard', record: event.clone },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          let lId = btoa(event.clone.templateId + '-' + event.clone.itsId);
          this.router.navigate(['/admin/niyat-data/add'], { queryParams: { cloneId: lId } });
        }
      });
    }
  } 

  /******************************************************************************
 *
 * @brief Handle Excel File upload
 * @param none
 * @return none
 *
 ******************************************************************************/
   handleExcelFileInput(event:any) {
    this.excelToUpload = event.target.files[0];
    this.fileName = event.target.files[0].name;
    this.fileName = this.fileName.substring(0, 12) + '...';
  }

 /******************************************************************************
 *
 * @brief Bulk Upload Niyat Data
 * @param none
 * @return none
 *
 ******************************************************************************/
  uploadNiyat(){
    const formData: FormData = new FormData();
    const file:any = this.excelToUpload;
    formData.append('file', file);

    this.niyatDataService.uploadExcel(formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if(res.error){
        this.toastrservice.error(this.commonservices.toTitleCase(res.message)); 
      }else{
        this.toastrservice.success(this.commonservices.toTitleCase(res.message));
        // this.getNiyatDataList();
        this.router.navigateByUrl(`/admin/niyat-data/list`);
      }
    }, (err) => {
      console.log(err);
      // this.toastrservice.error('Error'); 
    })
  }

  /******************************************************************************
 *
 * @brief Reset data on download cancel button
 * @param none
 * @return none
 *
 ******************************************************************************/
  resetDownload(){
    this.defaultSelected = 0;
  }

 /******************************************************************************
 *
 * @brief Reset data on upload cancel button
 * @param none
 * @return none
 *
 ******************************************************************************/
  resetUpload(){
    this.fileName ="No File Chosen";
    this.excelToUpload = null;
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
      case "ACTIVE":
        return 'ACTIVE'
        break;
    
      case "APPROVAL PENDING":
        return 'PENDING'
        break;
    
      case "COMPLETED":
        return 'COMPLETED'
        break;
    
      default:
        return '-'
        break;
    }
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
}
