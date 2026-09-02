import { SpinnerService } from './../../services/spinner/spinner.service';

import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, Output, ViewChild, Input, EventEmitter, SimpleChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SmartDialogDeleteComponent } from '../smart-dialog/smart-dialog-delete.component';
import { MatSort } from '@angular/material/sort';
import { Searchable } from "src/app/shared/models/interface/searchable.interface";
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/auth/service/storage/localstorage.service';

@Component({
  selector: 'app-server-side-smart-table',
  templateUrl: './server-side-smart-table.component.html',
  styleUrls: ['./server-side-smart-table.component.scss']
})

export class ServerSideSmartTableComponent implements OnInit, AfterViewInit {
  @Input() service: Searchable<any>;

  @Input() pagination = 'block';

  @Input() filterList = false;

  @Input() hideHeader!: string;

  @Input() editBtn = false;

  @Input() hideUserBtn = false;

  @Input() deleteBtn = false;

  @Input() meterBtn = false;

  @Input() dotsBtn = false;

  @Input() downloadBtn = false;

  @Input() statusBtn = false;

  @Input() statusDeleteBtn = false;

  @Input() deleteOutlineBtn = false;

  @Input() viewBtn = false;
  @Input() cloneBtn = false;
  @Input() scan = false;

  @Input() centerFocus = false;

  @Input() centerFocusinfo = false;

  @Input() receivedData: any;

  @Input() columns: any[] = [];

  @Output() tableRecord = new EventEmitter<any>();

  @Output() tableParams = new EventEmitter<any>();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  @Input() displayedColumns!: string[];

  dataSource!: MatTableDataSource<any>;

  @Input() catelogType:any; 

  @Input() itemId:any;
  @Input() isAcknowledged = false;
 
  niyatListVal:any=""
  listSpinner = false;

  listRecord = false;

  checked = false;

  pageNo:any = 0;
  
  pageSize = 10;

  totalSize:any = 0;

  query: string = '';

  catalogueType:string=''
  isApprovedVal=false;
  userrole: string;

  selectedRowMap = new Map<string, any>();

  @ViewChild(MatSort) sort: MatSort;
  private _filters: any;

  @Input() set searchStr(value: string) {
    this.query = value;
    this.pageNo = 0;
    let role=localStorage.getItem("role");
    if(role?.includes('Mumin') ){
      if(this.query!=="" || this.router.url==="/notification"){
        this.loadData();
      }
    }else{
      if(this.router.url!=="/admin/niyat-approve/list"){
        if(value !== "Approver Details"){
          this.loadData();
        } 
      }
    }
  }

  get searchStr(): string {
    return this.query;
  }

  @Input() set niyatList(value:any){
    this.niyatListVal=value;
    let role=localStorage.getItem("role");
    if(role?.includes('Super Admin') || role?.includes('Data Entry Operator')){
     if(this.niyatListVal!=="" && this.router.url=="/admin/niyatCount/list"){
        this.loadData(); 
     }
    }
   
  }
  get niyatList(): string {
    return this.niyatListVal;
  }

  @Input() set isApproved(value:any) {
     this.isApprovedVal=value;
     if(this.isApprovedVal && this.router.url=="/admin/niyat-approve/list"){
      this.loadData(); 
     }
  }
  get isApproved(): any {
    return this.isApprovedVal;
  }
  @Input() set filters(value: string) {
    this._filters = JSON.parse(value);
    // console.log(this._filters)
    if(this._filters.search){
      this.pageNo = 0;
    }
    this.loadData();
  }


  selection = new SelectionModel<any>(true, []);

  constructor(
    public dialog: MatDialog, 
    public spinner: SpinnerService, 
    private changedetect: ChangeDetectorRef,
    private router: Router,
    private localService: LocalStorageService,
    
  ) { }

  ngOnInit(): void { 
    const data: any = this.localService.get("role");
    this.userrole = JSON.parse(data);
    if(this.catelogType != undefined){
        this.loadData();
    }
   
    if(this.niyatList){
        this.loadData();
    } 
    
    this.paginator._intl.itemsPerPageLabel = 'Items Per Page';
    this.changedetect.markForCheck()
    console.log('selectedRowMap keys:', Array.from(this.selectedRowMap.keys()));
console.log('Page rows:', this.dataSource.data.map(r => r.uniqueId));
console.log('Selected keys:', Array.from(this.selectedRowMap.keys()));
  }
  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.pageNo = 0;
      this.loadData();
    });
  }


  // ngDoCheck() {
  //   if(this.receivedData) { this.refershTable() }
  // }

  // refershTable() {
  //   this.paginator._changePageSize(this.paginator.pageSize);
  // }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource(this.receivedData);    
    this.displayedColumns = this.columns.map((x) => x.columnDef);
    this.totalSize = this.receivedData?.totalSize;

    this.dataSource.paginator = this.paginator;
    if (this.dataSource.data.length !== 0) {
      this.listSpinner = true;
      this.listRecord = false; 
      this.changedetect.markForCheck()
    } else {
      this.listSpinner = false;
      this.listRecord = true;
      this.changedetect.markForCheck()  
    }

      if (this.dataSource !== undefined && this.query != undefined) {
        this.dataSource.filter = this.query.trim().toLowerCase();
      }
  }

  checkx(r: any) {
    return typeof r
  }

  /******************************************************************************
   *
   * @brief updateRow we fetching the value of particular row for edit function
   * @param record
   * return emiting record
   *
   ******************************************************************************/
  updateRow(record: any, message: any) {
    switch (message) {
      case 'centerFocus':
        this.tableRecord.emit({ centerFocus: record });
        break;
      case 'centerFocusinfo':
        this.tableRecord.emit({ centerFocusinfo: record });
        break;
  
      case 'update':
        this.tableRecord.emit({ update: record });
        break;

      case 'view':
        this.tableRecord.emit({ viewRow: record });
        break;

      case 'hideUser':
        this.tableRecord.emit({ hideUserRow: record });
        break;

      case 'download':
        this.tableRecord.emit({ downloadRow: record });
        break;
      case 'isAcknowledged':
          this.tableRecord.emit({ acknowledgeRow: record })
          break;
      case 'status':
        const dialogR = this.dialog.open(SmartDialogDeleteComponent, {
          width: '450px',
          data: { name: 'Are you sure you want to change status?',heading:'',buttonSubmit:'Confirm',buttonCancel:'Discard', record: event },
        });
    
        dialogR.afterClosed().subscribe((result) => {
          if(result){
            this.tableRecord.emit({ statusRow: record })
          }
         
        });
        break;
      case 'scan':
        this.tableRecord.emit({ scan: record });
        break;
      case 'delete':
        const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
          width: '450px',
          data: { name: 'Are you sure you want to delete?', heading:'', buttonSubmit:'Confirm', buttonCancel:'Discard', record: record },
        });
    
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.tableRecord.emit({ delete: record });
          }
          
        });
        break;
      case 'clone':
        this.tableRecord.emit({ clone: record });
        break;
      default:
        break;
    }
  }

  /******************************************************************************
   *
   * @brief checkedChange we change the value of particular event and row
   * @param event
   * @param row
   * return emiting record
   *
   ******************************************************************************/
  checkedChange(event: any, row: any): void {
    this.tableRecord.emit({checkchanged: {row: row,checked: event.currentTarget.checked}});
  }


  /******************************************************************************
   *
   * @brief getSelectedRows Whether the number of selected elements matches the total number of rows
   * @param record
   * @param checkedVal
   * return emiting record
   *
   ******************************************************************************/

  getSelectedRows(record: any, checkedVal: any): void {
    this.tableRecord.emit({ checkboxSelectedVal: { record, checkedVal } });
  }


clickCheck(event: any, selection: any, row: any) {
  const key = row.uniqueId;

  if (event.checked) {
    selection.select(row);
    this.selectedRowMap.set(key, row);
  } else {
    selection.deselect(row);
    this.selectedRowMap.delete(key); // This is critical!
  }

  this.getSelectedRows(row, event.checked);
}


  /******************************************************************************
   *
   * @brief isAllSelected select rows length and data length
   * @param none
   * return numbers of rows
   *
   ******************************************************************************/
  isAllSelected() {
//     const rowsToSelect = this.dataSource.data.filter(row => {
//     return !row.hasOwnProperty('isAcknowledged') || row.isAcknowledged === false;
//   });
//     const numSelected = this.selection.selected.length;
//     const numRows = rowsToSelect.length;
//     return numSelected === numRows;
     const visibleRows = this.dataSource.data.filter(row => !row.isAcknowledged);
     console.log(visibleRows.length > 0);

  return visibleRows.length > 0 && visibleRows.every(row => this.selectedRowMap.has(row.uniqueId));
  
  
  }

isIndeterminate(): boolean {
  const currentPageRows = this.dataSource.data.filter(row => !row.isAcknowledged);
  const selectedOnPage = currentPageRows.filter(row => this.selectedRowMap.has(row.uniqueId));

  return selectedOnPage.length > 0 && selectedOnPage.length < currentPageRows.length;
}


  /******************************************************************************
   *
   * @brief masterToggle Selects all rows if they are not all selected; otherwise clear selection.
   * @param none
   * return emiting reocrd
   *
   ******************************************************************************/
  masterToggle() {
  const rowsOnPage = this.dataSource.data.filter(row => !row.isAcknowledged);

  if (this.isAllSelected()) {
    // Uncheck all on current page
    rowsOnPage.forEach(row => {
      this.selection.deselect(row);
      this.selectedRowMap.delete(row.uniqueId);
    });
  } else {
    // Select all on current page
    rowsOnPage.forEach(row => {
      this.selection.select(row);
      this.selectedRowMap.set(row.uniqueId, row);
    });
  }
  
  this.tableRecord.emit({
    checkboxSelectedVal: Array.from(this.selectedRowMap.values())
  });
}


  isAllAcknowledged(): boolean {
  return this.dataSource.data.length > 0 &&
    this.dataSource.data.every(row => row.isAcknowledged === true);
}
  /******************************************************************************
   *
   * @brief checkboxLabel The label for the checkbox on the passed row.
   * @param row
   * return select deselect value of particular row
   *
   ******************************************************************************/
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1
      }`;
  }


  checkedStatus(data:any, selection:any){

    if(data.checkedStatus === true){
      return true;
    }else if(selection.isSelected(data) && data.checkedStatus === false){
      return false;
    }else if(selection.isSelected(data)){
      return true
    }else{
      return false;
    }
  }

  loadData() {  
    let params = {
      pageSize: this.pageSize,
      pageNo: this.pageNo,
      sortBy: this.sort?.active || "",
      sortDir: this.sort?.direction || ""
    };
    if(this.isApproved){
      let itsID = this.localService.get('itsId'); 
      Object.assign(params, { itsId: itsID });
      Object.assign(params, { isApproved: this.isApproved });
    }
    if(this.niyatList){
      this.receivedData = [];
      this.tableRecord.emit({ 'data': {} });
      this.dataSource = new MatTableDataSource(this.receivedData);
      this.totalSize = 0;
    }
    if(this.niyatList && this.niyatListVal?.scanned===false){
      Object.assign(params, { download: this.niyatListVal?.scanned});
      Object.assign(params, { endDate: this.niyatListVal?.endDate});
      Object.assign(params, { startDate: this.niyatListVal?.startDate});
      Object.assign(params, { templateId: this.niyatListVal?.templateId});
    }else{
      if(this.query) {
        Object.assign(params, { searchValue: this.query });
        Object.assign(params, { search: this.query });
      }else{
        Object.assign(params, { searchValue: "" });
        Object.assign(params, { search: "" });
      }

      if(this.catelogType != undefined){
        Object.assign(params, { catalogueType: this.catelogType });
        Object.assign(params, { itemId: this.itemId });
        Object.assign(params, { itsId: this.query });
      }

      if(this._filters) {
        Object.assign(params, {...params, ...this._filters});
      }
      if(this.niyatList && this.niyatListVal?.scanned===true){
        Object.assign(params, { scanned: this.niyatListVal?.scanned});
        Object.assign(params, { itsId: this.niyatListVal?.itsId});
      }
    }

    this.tableParams.emit(params);

    this.spinner.show();

    this.service.getList(params).subscribe((data: any) => {
      this.spinner.hide();
      if (data.list && data.list?.length > 0) {
        this.listSpinner = true;
        data?.list?.forEach((obj:any)=>{
          obj.catelogType=this.catelogType
          });
        this.receivedData = this.isApproved==true?this.isApprovalList(data.list):data.list
        this.receivedData.forEach((row: any, index: number) => {
  row.catelogType = this.catelogType;
  row.uniqueId = `${row.itsId}-${row.templateId || ''}-${row.createdAt || index}`;

  const key = row.uniqueId;
  if (this.selectedRowMap.has(key)) {
    this.selection.select(row);
  }
});
        this.tableRecord.emit({ 'data': data });
        this.dataSource = new MatTableDataSource(this.receivedData);
        this.totalSize = data.totalSize;
      }else {
        this.listSpinner = false;
        this.receivedData = [];
        this.tableRecord.emit({ 'data': data });
        this.dataSource = new MatTableDataSource(this.receivedData);
        this.totalSize = data.totalSize;
      }
    });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
      this.pageNo = event.pageIndex;
    // }
    this.loadData();
  }
  
  // for niyat approved list
  isApprovalList(data:any){
    let niyatList:any;
    if(this.localService.get('MultipleJamaatIds') != undefined && (this.userrole === 'Aamil'|| this.userrole==='Muavin Aamil' || this.userrole === 'Khidmat Ramadaniyah')){
      niyatList = data.filter((res:any)=>{
        return (res.jamaat == this.localService.get('activeJamaatName'))
      });
    }else if(this.localService.get('MultipleUmoorIds') != undefined && this.userrole === 'Umoor Coordinator'){
      niyatList = data.filter((res:any)=>{
        return (res.umoorName == this.localService.get('activeUmoorName'))
      });
    }else if(this.localService.get('MultipleJamiatIds') != undefined && this.userrole === 'Jamiat Masool'){
      niyatList = data.filter((res:any)=>{
        return (res.jamiatName == this.localService.get('activeJamiatName'))
      });
    }
    else{
      niyatList = data;
    }
    return niyatList
  }

}