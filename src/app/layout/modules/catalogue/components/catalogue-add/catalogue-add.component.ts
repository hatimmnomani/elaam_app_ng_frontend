import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogueService } from '../../service/catalogue.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from 'src/app/shared/services/spinner/spinner.service';
import { config } from 'src/app/shared/models/validation_config';
import { SmartDialogDeleteComponent } from 'src/app/shared/componets/smart-dialog/smart-dialog-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-catalogue-add',
  templateUrl: './catalogue-add.component.html',
  styleUrls: ['./catalogue-add.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CatalogueAddComponent implements OnInit {
  imageUpload$: Subject<any> = new Subject<any>();
  catalogueForm: any = FormGroup;
  disableBtn: boolean = false;  
  id: any;
  action: any;
  catalogueData: any;
  imagePath: any;
   fileToUpload: File | null = null;
   fileName: string="No File Chosen";
  private destroy$ = new Subject();

  status: any = [
    { data: 'Active', value: 'ACTIVE'},
    { data: 'Inactive', value: 'INACTIVE' }
  ];

  catalogueType: any = [
    { data: 'MUMIN', value: 'MUMIN'},
    { data: 'APPROVERS', value: 'APPROVERS' }
  ];

  validationMessages: any = {
    itemTitle: config.validationMessages.itemTitle,
    trophies: config.validationMessages.trophies,
    status: config.validationMessages.status,
    description: config.validationMessages.description,
    maximumReward: config.validationMessages.maximumReward,
  }
  constructor(
    private fb:FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private catalogueService:CatalogueService,
    private toastrservice: ToastrService,
    public spinner: SpinnerService,
    public dialog: MatDialog,
    ) { }

  ngOnInit() {
    this.createForm();
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.id = atob(this.id);
      this.action = 'EDIT';
      this.getCatalogueByID(this.id);
    } else {
      this.action = 'Add';
      this.patchFormDefault();
    }
  }

  /******************************************************************************
   *
   * @brief Create the catalogueForm
   * @param none
   * @return none
   * 
   * ***************************************************************************/ 
  createForm():void{
     this.catalogueForm=this.fb.group({
      itemTitle:[null, [Validators.required,Validators.minLength(config.validation.itemTitle.minLength), Validators.maxLength(config.validation.itemTitle.maxLength)]],
      trophies:[null, [Validators.required,Validators.min(config.validation.trophies.minLength), Validators.maxLength(config.validation.trophies.maxLength),Validators.pattern(config.validation.trophies.RegExp)]],
      status:[null,[Validators.required]],
      description:[null,[Validators.minLength(config.validation.description.minLength), Validators.maxLength(config.validation.description.maxLength)]],
      logoPath:[''],
      catalogueType:[null],
      maximumReward:[null,[Validators.required]],
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
        return this.catalogueForm.controls;
      }
 
    /******************************************************************************
    *
    * @brief Get catalogue by Id
    * @param string catalogueId
    * @return none
    *
    ******************************************************************************/
     getCatalogueByID(id: string): void {
     this.catalogueService.getCatalogueByID(id)
    .pipe(takeUntil(this.destroy$))
     .subscribe((data) => {
       this.catalogueData = data;
       this.patchForm();
     }, error => { console.log(error) });
    }  
 
     /******************************************************************************
  *
  * @brief Patch the catalogueForm
  * @param none
  * @return none
  *
  ******************************************************************************/
    patchForm() {
       this.catalogueForm.patchValue({
        itemTitle: this.catalogueData.itemTitle,
        trophies: this.catalogueData.trophies,
        status:this.catalogueData.status,
        description: this.catalogueData.description,
        catalogueType: this.catalogueData.catalogueType,
        maximumReward: this.catalogueData.maximumReward,
       });
       setTimeout(() => this.imageUpload$.next(this.catalogueData?.image_url), 0)
       this.imagePath = this.catalogueData.image_url;
       this.fileName = this.catalogueData.image_url
       this.fileToUpload = this.catalogueData.image_url;
     }

  /******************************************************************************
   *
   * @brief status active
   * @param string event
   * @return none
   *
   ******************************************************************************/
     patchFormDefault() {
      this.catalogueForm.patchValue({
        status: "ACTIVE",
        catalogueType:"MUMIN"
      });
    }

 
   /******************************************************************************
 *
 * @brief Submit update catalogue form data
 * @param none
 * @return none
 *
 ******************************************************************************/
    onSubmit() {
      if (this.catalogueForm.invalid) {
        this.catalogueForm.markAllAsTouched();
        return;
      } else {      
        this.disableBtn = true;
        this.spinner.show();
        let req = this.catalogueForm.getRawValue();
  
  
        if (this.action === 'EDIT') {
          this.catalogueService.editCatalogue(this.catalogueData.id, req,this.fileToUpload)
        .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            this.toastrservice.success("Catalogue Updated Successfully.");
            this.router.navigate(['./admin/catalogue/list']);
            this.spinner.hide();
          }, (err) => {
            console.log(err);
            this.spinner.hide();
            this.disableBtn = false;
          },
          )
      
        }else{
          this.catalogueService.addCatalogue(req,this.fileToUpload)
        .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            this.toastrservice.success("Catalogue Added Successfully.");
            this.router.navigate(['./admin/catalogue/list']);
            this.spinner.hide();
          }, (err) => {
            console.log(err);
            this.spinner.hide();
            this.disableBtn = false;
          },
          )
        }
  
      }
  
    }
sendImageEvent(event: any) {
    this.imagePath=event.name
  this.fileToUpload = event;
}
    /******************************************************************************
 *
 * @brief Navigate to catalogue list page
 * @param none
 * @return none
 *
 ******************************************************************************/
     redirectToCatalogueList() {
      this.router.navigate(['./admin/catalogue/list']);
    }
  
    /******************************************************************************
   *
   * @brief open dialog box after click on cancel
   * @param none
   * @return redirection and reset form
   *
   ******************************************************************************/
     openDialog(){
      this.redirectToCatalogueList();
    }
/******************************************************************************
   *
   * @brief inactive status time popup
   * @param string event
   * @return none
   *
   ******************************************************************************/
    getStatus(event:any){
      if(event === "INACTIVE" ){
      const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
        width: '450px',
        data: { name: 'Are you sure you want to make this catalogue item INACTIVE ?',heading:'',
        buttonSubmit:'Confirm',buttonCancel:'Discard', record: event},
      });
  
      dialogRef.afterClosed()
    .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if(result === "closed"){
         this.catalogueForm.patchValue({status:"ACTIVE"})
        }
       
      });
      }
      
     
    }
}
