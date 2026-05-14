import { config } from './../../../../../shared/models/validation_config';
import { SpinnerService } from './../../../../../shared/services/spinner/spinner.service';
import { UmoorService } from './../../../umoor/services/umoor.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from '../../services/department.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonService } from '../../../dashboard/service/common.service';

@Component({
  selector: 'app-department-add-edit',
  templateUrl: './department-add-edit.component.html',
  styleUrls: ['./department-add-edit.component.scss']
})
export class DepartmentAddEditComponent implements OnInit {
  private destroy$ = new Subject();
  imageUpload$: Subject<any> = new Subject<any>();

  imagePath: string;

  departmentForm: any = FormGroup;
  disableBtn: boolean = false;  

  status: any = [
    { data: 'Active', value: 'ACTIVE' },
    { data: 'Inactive', value: 'INACTIVE' }
  ];

  umoorList: any = [];

  departmentData: any;
  fileToUpload: File | null = null;
  fileName: string="No File Chosen";

  validationMessages: any = {
    departmentName: config.validationMessages.departmentUmoorName,
    emailId: config.validationMessages.email,
    phoneNumber: config.validationMessages.phone,
    description: config.validationMessages.description,
    userStatus: config.validationMessages.status,
    umoorId: config.validationMessages.umoor,
    emailMaxLength:config.validationMessages.emailLength,
  }

  id: any;
  action: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public spinner: SpinnerService,
    private departmentService: DepartmentService,
    private toastrservice: ToastrService,
    private changeDetection: ChangeDetectorRef,
    private umoorservice: UmoorService,
    private router: Router,
    public commonservices: CommonService
  ) { }

  ngOnInit() {
    this.createForm();
    this.id = this.route.snapshot.paramMap.get('id');
    this.getUmoorList()
    if (this.id) {
      this.id = atob(this.id);
      this.action = 'EDIT';
      this.getDepartmentById(this.id);
    } else {
      this.action = 'Add';
    }
  }

    /******************************************************************************
     *
     * @brief Get Umoor List
     * @param id
     * @return none
     *
     ******************************************************************************/
    getUmoorList(): void {
      this.umoorservice.getActiveUmoorList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.umoorList = data;
        this.changeDetection.detectChanges();
      });
    }
    
    ngOnDestroy(): void {
      this.destroy$.next();  // trigger the unsubscribe
      this.destroy$.complete(); // finalize & clean up the subject stream
    }
  

/******************************************************************************
*
* @brief Create the departmentForm
* @param none
* @return none
*
******************************************************************************/
createForm(): void {
  this.departmentForm = this.fb.group({
    departmentName: [null, [Validators.required, Validators.minLength(config.validation.departmentUmoorName.minLength), Validators.maxLength(config.validation.departmentUmoorName.maxLength)]],
    description: [null, [Validators.minLength(config.validation.description.minLength), Validators.maxLength(config.validation.description.maxLength)]],
    emailId: [null, [Validators.minLength(config.validation.email.minLength), Validators.maxLength(config.validation.email.maxLength), Validators.pattern(config.validation.email.regExp)]],
    phoneNumber: [null, [ Validators.minLength(config.validation.phone.minLength), Validators.maxLength(config.validation.phone.maxLength), Validators.pattern(config.validation.phone.regExp)]],
    userStatus: ['', [Validators.required]],
    umoorId: ['', [Validators.required]],
    logoPath: [''],
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
    return this.departmentForm.controls;
  }

  /******************************************************************************
 *
 * @brief Submit update department form data
 * @param none
 * @return none
 *
 ******************************************************************************/
   onSubmit() {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    } else {      
      this.disableBtn = true;
      this.spinner.show();
      let req = this.departmentForm.value;


      if (this.action === 'EDIT') {
        this.departmentService.editDepartment(this.fileToUpload, this.departmentData.departmentId, req)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.toastrservice.success(this.commonservices.toTitleCase(res.message));
          this.router.navigate(['./admin/department/list']);
          this.spinner.hide();
        }, (err) => {
          this.spinner.hide();
          this.disableBtn = false;
        },
        )
    
      }else{
        this.departmentService.addDepartment(req, this.fileToUpload)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.toastrservice.success(this.commonservices.toTitleCase(res.message));
          this.router.navigate(['./admin/department/list']);
          this.spinner.hide();
        }, (err) => {
          this.spinner.hide();
          this.disableBtn = false;
        },
        )
      }

    }

  }
  
/******************************************************************************
 *
 * @brief Get department by Id
 * @param string departmntId
 * @return none
 *
 ******************************************************************************/
     getDepartmentById(id: string): void {
      this.departmentService.getDepartmentByID(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.departmentData = res;
        this.patchForm();
      }, error => { console.log(error) });
    }

  /******************************************************************************
 *
 * @brief Patch the departmentForm
 * @param none
 * @return none
 *
 ******************************************************************************/
   patchForm() {
    this.departmentForm.patchValue({
      departmentName: this.departmentData.departmentName,
      emailId: this.departmentData.emailId,
      phoneNumber: this.departmentData.phoneNumber,
      description: this.departmentData.description,
      userStatus: this.departmentData.userStatus,
      umoorId: this.departmentData.umoorId,
    });
    setTimeout(() => this.imageUpload$.next(this.departmentData.logoPath), 0)
    this.imagePath = this.departmentData.logoPath;
    this.fileName = this.departmentData.logoPath
    this.fileToUpload = this.departmentData.logoPath;

  }

 /******************************************************************************
 *
 * @brief Navigate to department list page
 * @param none
 * @return none
 *
 ******************************************************************************/
     redirectToDepartmentList() {
      this.router.navigate(['./admin/department/list']);
    }

/******************************************************************************
 *
 * @brief open dialog box after click on cancel
 * @param none
 * @return redirection and reset form
 *
 ******************************************************************************/
     openDialog(){
          this.redirectToDepartmentList();
    }

/******************************************************************************
 *
 * @brief Handle File upload
 * @param none
 * @return none
 *
 ******************************************************************************/

  sendImageEvent(event: any) {
    this.imagePath = event.name
    this.fileToUpload = event;
  }

}
