import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { SpinnerService } from "src/app/shared/services/spinner/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { config } from "src/app/shared/models/validation_config";
import { UmoorService } from "../services/umoor.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { CommonService } from "../../dashboard/service/common.service";

@Component({
  selector: "app-umoor-add-edit",
  templateUrl: "./umoor-add-edit.component.html",
  styleUrls: ["./umoor-add-edit.component.scss"],
})
export class UmoorAddEditComponent implements OnInit {
  umoorForm: any = FormGroup;
  disableBtn: boolean = false;
  imageUpload$: Subject<any> = new Subject<any>();

  id: any;
  action: any;
  logoUrl: any;
  status: any = [
    { data: "Active", value: "ACTIVE" },
    { data: "Inactive", value: "INACTIVE" },
  ];
  private destroy$ = new Subject();

  validationMessages: any = {
    umoorName: config.validationMessages.departmentUmoorName,
    emailId: config.validationMessages.email,
    phone: config.validationMessages.phone,
    userStatus: config.validationMessages.status,
    shortDesc: config.validationMessages.description,
  };
  fileToUpload: any;
  fileName: any;
  imagePath: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private spinner: SpinnerService,
    private umoorService: UmoorService,
    private toastrservice: ToastrService,
    private router: Router,
    public commonservices: CommonService

  ) { }

  ngOnInit() {
    this.createForm();
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id) {
      this.id = atob(this.id);
      this.action = "EDIT";
      this.getUmoorById(this.id);
    } else {
      this.action = "Add";
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

  /******************************************************************************
   *
   * @brief Create the umoorForm
   * @param none
   * @return none
   *
   * ***************************************************************************/
  createForm(): void {
    this.umoorForm = this.fb.group({
      umoorName: [
        null,
        [
          Validators.required,
          Validators.minLength(config.validation.departmentUmoorName.minLength),
          Validators.maxLength(config.validation.departmentUmoorName.maxLength),
          Validators.pattern(config.validation.departmentUmoorName.regExp),
        ],
      ],
      shortDesc: [
        null,
        [
          Validators.minLength(config.validation.description.minLength),
          Validators.maxLength(config.validation.description.maxLength),
        ],
      ],
      emailId: [
        null,
        [
          Validators.minLength(config.validation.email.minLength),
          Validators.maxLength(config.validation.email.maxLength),
          Validators.pattern(config.validation.email.regExp),
        ],
      ],
      phoneNumber: [
        null,
        [
          Validators.minLength(config.validation.phone.minLength),
          Validators.maxLength(config.validation.phone.maxLength),
          Validators.pattern(config.validation.phone.regExp),
        ],
      ],
      logoPath: [''],
      userStatus: ["", [Validators.required]],
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
    return this.umoorForm.controls;
  }

  /******************************************************************************
   *
   * @brief Get umoor by Id
   * @param string umoorId
   * @return none
   *
   ******************************************************************************/
  getUmoorById(id: string): void {
    this.umoorService.getUmoorByID(id).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
          this.patchForm(res);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /******************************************************************************
   *
   * @brief Patch the umoorForm
   * @param none
   * @return none
   *
   ******************************************************************************/
  patchForm(res: any) {
    this.umoorForm.patchValue({
      umoorName: res.umoorName,
      emailId: res.emailId,
      phoneNumber: res.phoneNumber,
      shortDesc: res.shortDesc,
      userStatus: res.userStatus,
    });
    this.fileToUpload = res.logoPath;

    setTimeout(() => this.imageUpload$.next(res.logoPath), 0)

  }

  /******************************************************************************
   *
   * @brief Submit update umoor form data
   * @param none
   * @return none
   *
   ******************************************************************************/
  onSubmit() {
    if (this.umoorForm.invalid) {
      this.umoorForm.markAllAsTouched();
      return;
    } else {
      this.disableBtn = true;
      this.spinner.show();
      let req = this.umoorForm.value;

      if (this.action === "EDIT") {
        this.umoorService.editUmoor(this.id, req, this.fileToUpload, ).pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
              this.toastrservice.success(this.commonservices.toTitleCase(res.message));
              this.router.navigate(["./admin/umoor/list"]);
              this.spinner.hide();
            },
            (err) => {
              console.log(err);
              this.spinner.hide();
              this.disableBtn = false;
            }
          );
      } else {
        this.umoorService.createUmoor(req, this.fileToUpload).pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
              this.toastrservice.success(this.commonservices.toTitleCase(res.message));
              this.router.navigate(["./admin/umoor/list"]);
              this.spinner.hide();
            },
            (err) => {
              console.log(err);
              this.spinner.hide();
              this.disableBtn = false;
            }
          );
      }
    }
  }
  //

  /******************************************************************************
   *
   * @brief Navigate to umoor list page
   * @param none
   * @return none
   *
   ******************************************************************************/
  redirectToUmoorList() {
    this.router.navigate(["./admin/umoor/list"]);
  }

  /******************************************************************************
   *
   * @brief open dialog box after click on cancel
   * @param none
   * @return redirection and reset form
   *
   ******************************************************************************/
  openDialog() {
    this.redirectToUmoorList();
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
