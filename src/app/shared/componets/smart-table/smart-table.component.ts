import { SpinnerService } from './../../services/spinner/spinner.service';

import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ChangeDetectionStrategy, Output, ViewChild, Input, EventEmitter, SimpleChanges, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SmartDialogDeleteComponent } from '../smart-dialog/smart-dialog-delete.component';
import { MatSort } from '@angular/material/sort';
import {QrcodeScanComponent} from '../qrcode-scan/qrcode-scan.component'
import { LocalStorageService } from 'src/app/auth/service/storage/localstorage.service';
import { Subject } from 'rxjs';
import { auditTime, map, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class  SmartTableComponent implements OnInit, AfterViewInit, OnDestroy {

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

  @Input() niyatDeactivateBtn = false;

  @Input() confirmNiyatDeactivateBtn = false;

  @Input() pageNumber: number | null = null;

  @Input() isServerSide: boolean = false;

  @Input() totalRecords: number = 0;

  @Output() tableRecord = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<any>();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  @Input() displayedColumns!: string[];

  dataSource!: MatTableDataSource<any>;

  listSpinner = false;

  listRecord = false;

  checked = false;

  @Input() pageSize = 5;

  pageIndex = 0;

  query: string = '';

  userRole:any;

  @ViewChild(MatSort) sort: MatSort;


  @Input() set searchStr(value: string) {
    this.query = value;
  }

  get searchStr(): string {
    return this.query;
  }
@Input() qrCodeScanBtn=false

  selection = new SelectionModel<any>(true, []);

  // Internal: avoid memory leaks
  private destroy$ = new Subject<void>();

  constructor(public dialog: MatDialog, public spinner: SpinnerService, private changedetect: ChangeDetectorRef,private localService: LocalStorageService,) { }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Items Per Page';
    this.changedetect.markForCheck()
   let role:any = this.localService.get("role");
    this.userRole = JSON.parse(role);
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page
        .pipe(
          // Coalesce multiple paginator events (e.g., clamp + final) into the last value this tick
          auditTime(0),
          // Only react when index/size actually changes
          map(evt => ({ pageIndex: evt.pageIndex, pageSize: evt.pageSize })),
          takeUntil(this.destroy$)
        )
        .subscribe(({ pageIndex, pageSize }) => {
            console.log('page change', pageIndex, pageSize);
            this.pageChange.emit({ pageIndex, pageSize, length: this.paginator?.length ?? 0 });

        });
    }
  }

  ngDoCheck() {
    // No-op: avoid programmatic _changePageSize calls that suppress legitimate user events
  }

  refershTable() {
  if (this.paginator) {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}

  ngOnChanges(changes: SimpleChanges) {
    
    this.dataSource = new MatTableDataSource(this.receivedData);
    
    this.displayedColumns = this.columns.map((x) => x.columnDef);

    if (!this.isServerSide) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.paginator) {
      // Keep length in sync; do not suppress here to avoid swallowing next real user event
      this.paginator.length = this.isServerSide ? this.totalRecords : (this.dataSource?.data?.length || 0);
    }
    if (this.dataSource.data.length !== 0) {
      this.listSpinner = true;
      this.listRecord = false; 
      this.changedetect.markForCheck()
    } else {
      this.listSpinner = false;
      this.listRecord = true;
      this.changedetect.markForCheck()  
    }

      if (!this.isServerSide) {
        if (this.dataSource !== undefined && this.query != undefined) {
          this.dataSource.filter = this.query.trim().toLowerCase();
        }
      }

      // Handle page number input; setting pageIndex typically does not emit page event
    if (this.pageNumber !== null && this.paginator) {
      setTimeout(() => {
        // Parent uses 0-based pageNumber; MatPaginator.pageIndex is also 0-based
        const nextIndex = (this.pageNumber as number);
        const indexChanged = this.paginator.pageIndex !== nextIndex;
        if (indexChanged) {
          this.paginator.pageIndex = nextIndex;
        }
        // In client-side mode, programmatic pageIndex changes don't emit a page event.
        // Force MatTableDataSource to re-slice by triggering a synthetic page-size change.
        if (!this.isServerSide) {
          this.refershTable();
        }
      });
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
        this.tableRecord.emit({ downloadRow: record })
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
      case 'qrCodeScan':
        const dialogScan = this.dialog.open(SmartDialogDeleteComponent, {
          width: '450px',
          data: { name: 'Are you sure you want to generate QR Code?', heading:'', buttonSubmit:'Confirm', buttonCancel:'Discard', record: record },
        });
    
        dialogScan.afterClosed().subscribe((result) => {
          if (result) {
            this.tableRecord.emit({ qrCodeScan: record });
          }
        });
       
       break;
       case 'qrCodeScanView':
        const qrCodePopup=this.dialog?.open(QrcodeScanComponent,{
          data:{ data:record,isQrCode:true}
         })
         qrCodePopup.afterClosed().subscribe((result) => {
          if (result) {
            this.tableRecord.emit({ qrCodeScanView: result });
          }
        });
       
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
        case 'niyatDeactivateBtn':
        this.tableRecord.emit({ niyatDeactivateBtn: record });
        break;
      case 'confirmNiyatDeactivateBtn':
        this.tableRecord.emit({ confirmNiyatDeactivateBtn: record });
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
    event ? selection.toggle(row) || this.getSelectedRows(row, selection.isSelected(row)) : null
  }


  /******************************************************************************
   *
   * @brief isAllSelected select rows length and data length
   * @param none
   * return numbers of rows
   *
   ******************************************************************************/
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  /******************************************************************************
   *
   * @brief masterToggle Selects all rows if they are not all selected; otherwise clear selection.
   * @param none
   * return emiting reocrd
   *
   ******************************************************************************/
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));

    this.tableRecord.emit({ checkboxSelectedVal: this.selection.selected });
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
    }else{
      return false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
