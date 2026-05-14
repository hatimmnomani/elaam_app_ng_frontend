import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SmartDialogDeleteComponent } from 'src/app/shared/componets/smart-dialog/smart-dialog-delete.component';
import { CommonService } from '../../../dashboard/service/common.service';
import { CatalogueService } from '../../service/catalogue.service';

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

  constructor(
    private catalogueService: CatalogueService,
    private toastrservice: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    public commonservices: CommonService
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

}