import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SmartDialogDeleteComponent } from 'src/app/shared/componets/smart-dialog/smart-dialog-delete.component';
import { CommonService } from '../../../dashboard/service/common.service';
import { CatalogueService } from '../../service/catalogue.service';
import { RedeemedPrizesService } from '../../service/redeemed-prizes.service';
import { MuminDashboardService } from '../../../mumin-dashboard/service/mumin-dashboard.service';

@Component({
  selector: 'app-catalogue-list',
  templateUrl: './catalogue-list.component.html',
  styleUrls: ['./catalogue-list.component.scss']
})
export class CatalogueListComponent implements OnInit {
  imgPath = "../assets/images/catelogue.png";
  viewImagePath = ""
  customerProfileLoading = new BehaviorSubject<any>('');
  catalogueList$ = this.customerProfileLoading.asObservable();
  private destroy$ = new Subject();

  /* ------------------------- Prizes Redeemed tab ------------------------- */
  redeemedPrizesColumns = [
    {
      columnDef: "select",
      header: "Select",
      sortable: false,
      dataName: (row: any) => `${row || "-"}`,
    },
    {
      columnDef: "prizeId",
      header: "Prize ID",
      sortable: true,
      dataName: (row: any) => `${row.prizeId ?? row.itemId ?? "-"}`,
    },
    {
      columnDef: "itsId",
      header: "ITS ID",
      sortable: true,
      dataName: (row: any) => `${row.itsId || "-"}`,
    },
    {
      columnDef: "name",
      header: "Name",
      sortable: true,
      dataName: (row: any) => `${row.name || "-"}`,
    },
    {
      columnDef: "createdAt",
      header: "Date & Time of Redemption",
      sortable: true,
      dataName: (row: any) => `${row.createdAt ? this.datepipe.transform(row.createdAt + 'Z', 'dd-MM-yyyy HH:mm:ss') : "-"}`,
    },
    {
      columnDef: "itemTitle",
      header: "Prize Name",
      sortable: true,
      dataName: (row: any) => `${row.itemTitle || row.prizeName || "-"}`,
    },
    {
      columnDef: "trophiesRedeemed",
      header: "Trophies Redeemed",
      sortable: true,
      dataName: (row: any) => `${row.trophiesRedeemed ?? "-"}`,
    },
    {
      columnDef: "action",
      header: "Acknowledgement",
      sortable: false,
      dataName: (row: any) => `${row?.action}`,
    },
  ];

  redeemedPrizesService = this.redeemedPrizesSr;
  prizeQuery = "";
  prizeSearchControl = new FormControl();
  acknowledgementFilter = "";
  redeemedPrizesFilters = JSON.stringify({});
  redeemedPrizesCurrentParams: any = {};
  checkboxSelectedVal: any[] = [];
  showConfirmation = false;

  downloadButtonTitle = "Download Excel";
  sendHeader: any[] = [];
  sendTableId = "redeemedPrizesTable";
  sendTitle = "Prizes Redeemed";
  sendFileName = "Prizes-Redeemed";
  redeemedPrizesList$: Subject<any> = new Subject<any>();
  /* ------------------------------------------------------------------------ */

  constructor(
    private catalogueService: CatalogueService,
    private redeemedPrizesSr: RedeemedPrizesService,
    private muminDashboardSr: MuminDashboardService,
    private toastrservice: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    public commonservices: CommonService,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.getCatalogueList();
  }
  /******************************************************************************
   *
   * @brief catalogue list 
   * @param string event
   * @return none
   *
   ******************************************************************************/
  getCatalogueList() {
    this.catalogueService.getCatalogueList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.customerProfileLoading.next(data);
        },
        error => { console.log(error) });
  }

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }


  /******************************************************************************
   *
   * @brief Call fetchedRecord 
   * @param string event change status
   * @return update
   *
   ******************************************************************************/

  fetchedRecord(event: any) {
    if (event.statusRow) {
      this.catalogueService.changeStatusByID(event.statusRow.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            this.toastrservice.success(this.commonservices.toTitleCase(res.message));
            this.getCatalogueList();
          },
          (error) => {
            console.log(error);
          }
        );
    }
    if (event.update) {
      let lId = btoa(event.update.id);
      this.router.navigateByUrl(`/admin/catalogue/edit/${lId}`);
    }
  }

  encBtoa(id: any) {
    return btoa(id);
  }


  /******************************************************************************
   *
   * @brief view Catalog from popup
   * @param any Title
   * @param any trophy
   * @return none
   *
   ******************************************************************************/
  viewCatalog(title: any, trophy: any) {
    const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
      data: { buttonClose: true, imgPath: this.imgPath, itemTitle: title, trophies: trophy, viewCatalog: 'yes' },
    });
  }

  // ********* Image view
  viewImage(imgPath: any) {
    if (imgPath !== null && imgPath !== "") {
      const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
        data: { buttonClose: true, imageScanPath: imgPath },
      });
    }
  }

  /******************************************************************************
   *
   * @brief view list of mumin
   * @param any Title
   * @param any trophy
   * @return none
   *
   ******************************************************************************/
  viewListMumin(catalogueType: any, itemId: any) {
    //   this.catalogueService.getMuminInfoByCatalogue(catalogueType,itemId)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((datas) => {

    // const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
    //     data: { buttonClose:true, heading:'Details' , viewMumin:'yes',muminData :'test' },
    //   });
    // })


    const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
      data: { buttonClose: true, heading: 'Details', viewMumin: 'yes', muminData: '', catalogueType: catalogueType, itemId: itemId },
    });
  }

  /* --------------------------- Prizes Redeemed --------------------------- */

  /******************************************************************************
   *
   * @brief Search redeemed prizes by ITS ID / Name / Prize Name
   * @param any event
   * @return none
   *
   ******************************************************************************/
  searchPrizes(event: any) {
    this.prizeQuery = event.target.value;
  }

  emptyPrizeSearch() {
    this.prizeSearchControl = new FormControl();
    this.prizeQuery = "";
  }

  /******************************************************************************
   *
   * @brief Filter redeemed prizes by acknowledgement status
   * @param any event
   * @return none
   *
   ******************************************************************************/
  onAcknowledgementFilterChange(event: any) {
    const filters: any = {};
    if (event.value !== "") {
      filters.isAcknowledged = event.value;
    }
    this.redeemedPrizesFilters = JSON.stringify(filters);
  }

  /******************************************************************************
   *
   * @brief Keep track of the list's current pagination/sort/filter params so the
   * Excel export can retain the same filters and sorting
   * @param any params
   * @return none
   *
   ******************************************************************************/
  onRedeemedPrizesParamsChange(params: any) {
    this.redeemedPrizesCurrentParams = params;
  }

  /******************************************************************************
   *
   * @brief Handle acknowledge / bulk-select events emitted from the redeemed prizes table
   * @param any event
   * @return none
   *
   ******************************************************************************/
  fetchedPrizeRecord(event: any) {
    if (event?.checkboxSelectedVal) {
      this.checkboxSelectedVal = Array.isArray(event.checkboxSelectedVal)
        ? event.checkboxSelectedVal
        : [event.checkboxSelectedVal?.record];
      return;
    }

    if (event?.acknowledgeRow) {
      this.acknowledgeRows([event.acknowledgeRow]);
    }
  }

  acknowledgeRows(rows: any[]) {
    const body = rows.map((item: any) => {
      const dateStr = item?.createdAt?.split('T');
      const crnDate = dateStr ? dateStr[0] + ' ' + dateStr[1] : '';
      return {
        itsId: item?.itsId,
        catalogueType: item?.catalogueType,
        crnDate: crnDate
      };
    });

    this.muminDashboardSr.acknowRedeemTrophies(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res == null) {
          this.toastrservice.error('Something went wrong.');
        } else {
          this.toastrservice.success(res?.message || 'Acknowledged successfully');
          this.checkboxSelectedVal = [];
        }
      }, (error) => {
        this.toastrservice.error('Failed to acknowledge. Please try again.');
      });
  }

  openConfirmation() {
    this.showConfirmation = true;
  }

  closeConfirmation() {
    this.showConfirmation = false;
  }

  confirmAction() {
    this.showConfirmation = false;
    if (this.checkboxSelectedVal.length > 0) {
      this.acknowledgeRows(this.checkboxSelectedVal);
    } else {
      this.toastrservice.warning('Please select at least one item to acknowledge.');
    }
  }

  /******************************************************************************
   *
   * @brief Download the full redeemed prizes list as a single Excel file, honouring
   * the currently applied search/sort/filter and enriching with Jamaat, Jamiat and Contact No.
   * @param none
   * @return none
   *
   ******************************************************************************/
  downloadRedeemedPrizesExcel() {
    this.redeemedPrizesSr.getAllRedeemedPrizesExcel(this.redeemedPrizesCurrentParams)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res == null) {
          return;
        }
        const rows: any[] = [];
        (res || []).forEach((item: any) => {
          rows.push({
            PrizeId: item?.prizeId ?? item?.itemId,
            ItsId: item?.itsId,
            Name: item?.name,
            DateTime: item?.createdAt ? this.datepipe.transform(item?.createdAt + 'Z', 'dd-MM-yyyy HH:mm:ss') : '-',
            PrizeName: item?.itemTitle || item?.prizeName,
            TrophiesRedeemed: item?.trophiesRedeemed,
            Acknowledgement: item?.isAcknowledged ? 'Yes' : 'No',
            Jamaat: item?.jamaat || 'NA',
            Jamiat: item?.jamiat || 'NA',
            ContactNumber: item?.contactNumber || 'NA'
          });
        });
        this.sendHeader = [["PrizeId", "ItsId", "Name", "Date/Time", "PrizeName", "TrophiesRedeemed", "Acknowledgement", "Jamaat", "Jamiat", "contact number"]];
        this.redeemedPrizesList$.next(rows);
      }, (error) => {
        this.toastrservice.error('Failed to download Excel. Please try again.');
      });
  }

  /* ------------------------------------------------------------------------ */

}