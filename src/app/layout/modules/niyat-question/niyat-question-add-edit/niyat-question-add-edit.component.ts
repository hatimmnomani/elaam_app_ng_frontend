import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  NgForm,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { SpinnerService } from "src/app/shared/services/spinner/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { config } from "src/app/shared/models/validation_config";
import { NiyatQuestionService } from "../services/niyat-question.service";
import { UmoorService } from "../../umoor/services/umoor.service";
import { DepartmentService } from "../../department/services/department.service";
import { SmartDialogDeleteComponent } from "src/app/shared/componets/smart-dialog/smart-dialog-delete.component";
import { MatDialog } from "@angular/material/dialog";
import { NiyatTypeService } from "../services/niyat-type.service";
import { QuestionTypeService } from "../services/question-type.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { CommonService } from "../../dashboard/service/common.service";

@Component({
  selector: "app-niyat-question-add-edit",
  templateUrl: "./niyat-question-add-edit.component.html",
  styleUrls: ["./niyat-question-add-edit.component.scss"],
})
export class NiyatQuestionAddEditComponent implements OnInit {
  status: any = [
    { data: "Active", value: "ACTIVE" },
    { data: "Inactive", value: "INACTIVE" },
  ];

  type: any = [
    { data: "YES", value: "yes" },
    { data: "NO", value: "no" },
  ];

  niyatQuestionForm: any = FormGroup;
  disableBtn: boolean = false;

  niyatQuestionData: any;
  umoorList: any = [];
  departmentList: any = [];
  niyatTypeList: any = [];
  questionTypeList: any = [];

  validationMessages: any = {
    departmentName: config.validationMessages.department,
    questionarabic: config.validationMessages.question,
    questionenglish: config.validationMessages.question,
    niyatstatus: config.validationMessages.status,
    niyatTypeId: config.validationMessages.niyatType,
    questionTypeId: config.validationMessages.chooseType,
    umoorName: config.validationMessages.umoor,
    trophycount: config.validationMessages.trophies,
    status: config.validationMessages.status,
  };

  id: any;
  action: any;
  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public spinner: SpinnerService,
    private niyatquestionservice: NiyatQuestionService,
    private toastrservice: ToastrService,
    private router: Router,
    private umoorservice: UmoorService,
    private changeDetection: ChangeDetectorRef,
    private departmentService: DepartmentService,
    private niyatTypeService: NiyatTypeService,
    private questionTypeService: QuestionTypeService,
    public dialog: MatDialog,
    public commonservices: CommonService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.id = this.route.snapshot.paramMap.get("id");
    let cloneId = this.route.snapshot.queryParamMap.get("cloneId");
    this.getUmoorList();
    this.getDepartmentList();
    this.getNiyatTypeList();
    this.getQuestionTypeList();
    if (this.id) {
      this.id = atob(this.id);
      this.action = "EDIT";
      this.getQuestionByID(this.id);
    } else if (cloneId) {
      this.id = atob(cloneId);
      this.action = "Clone";
      this.getQuestionByID(this.id);
    } else {
      this.action = "Add";
      this.patchFormDefault();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

  /******************************************************************************
   *
   * @brief Get umoor list
   * @param null
   * @return none
   *
   ******************************************************************************/
  getUmoorList(): void {
    this.umoorservice
      .getActiveUmoorList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.umoorList = data;
        this.changeDetection.detectChanges();
      });
  }

  /******************************************************************************
   *
   * @brief Get department list
   * @param id
   * @return none
   *
   ******************************************************************************/
  getDepartmentList(): void {
    this.departmentService
      .getAllActiveDpartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.departmentList = data;
        this.changeDetection.detectChanges();
      });
  }

  /******************************************************************************
   *
   * @brief Get getNiyatType list
   * @param id
   * @return none
   *
   ******************************************************************************/
  getNiyatTypeList(): void {
    this.niyatTypeService
      .getNiyatTypeList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.niyatTypeList = data;
        this.changeDetection.detectChanges();
      });
  }

  /******************************************************************************
   *
   * @brief Get getNiyatType list
   * @param id
   * @return none
   *
   ******************************************************************************/
  getQuestionTypeList(): void {
    this.questionTypeService
      .getQuestionTypeList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.questionTypeList = data;
        this.changeDetection.detectChanges();
      });
  }

  /******************************************************************************
   *
   * @brief Create the niyatQuestionForm
   * @param none
   * @return none
   *
   ******************************************************************************/
  createForm(): void {
    this.niyatQuestionForm = this.fb.group({
      departmentName: [null, [Validators.required]],
      questionarabic: [
        null,
        [
          Validators.minLength(config.validation.question.minLength),
          Validators.maxLength(config.validation.question.maxLength),
        ],
      ],
      questionenglish: [
        null,
        [
          Validators.required,
          Validators.minLength(config.validation.question.minLength),
          Validators.maxLength(config.validation.question.maxLength),
        ],
      ],
      niyatstatus: [null, [Validators.required]],
      niyatTypeId: [null, [Validators.required]],
      questionTypeId: [null, [Validators.required]],
      umoorName: [null, [Validators.required]],
      trophycount: [
        null,
        [
          Validators.pattern(config.validation.number.regExp),
          Validators.maxLength(config.validation.trophies.maxLength),
        ],
      ],
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
    return this.niyatQuestionForm.controls;
  }

  /******************************************************************************
   *
   * @brief Submit update department form data
   * @param none
   * @return none
   *
   ******************************************************************************/
  onSubmit() {
    if (this.niyatQuestionForm.invalid) {
      this.niyatQuestionForm.markAllAsTouched();
      return;
    } else {
      this.disableBtn = true;
      this.spinner.show();
      let req = this.niyatQuestionForm.getRawValue();

      if (this.action === "EDIT") {
        this.niyatquestionservice
          .editNiyatQuestion(this.niyatQuestionData.id, req)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (res) => {
              this.toastrservice.success(
                this.commonservices.toTitleCase(res.message)
              );
              this.router.navigate(["./admin/niyat-question/list"]);
              this.spinner.hide();
            },
            (err) => {
              console.log(err);
              this.spinner.hide();
              this.disableBtn = false;
            }
          );
      } else {
        this.niyatquestionservice
          .addNiyatQuestion(req)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (res) => {
              this.toastrservice.success(
                this.commonservices.toTitleCase(res.message)
              );
              this.router.navigate(["./admin/niyat-question/list"]);
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

  /******************************************************************************
   *
   * @brief Get Niyat Question by Id
   * @param string departmntId
   * @return none
   *
   ******************************************************************************/
  getQuestionByID(id: string): void {
    this.niyatquestionservice
      .getQuestionByID(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.niyatQuestionData = res;
          this.patchForm();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /******************************************************************************
   *
   * @brief Patch the niyatQuestionForm
   * @param none
   * @return none
   *
   ******************************************************************************/
  patchForm() {
    this.niyatQuestionForm.patchValue({
      departmentName: this.niyatQuestionData.departmentName,
      questionarabic: this.niyatQuestionData.questionarabic,
      questionenglish: this.action === 'Clone' ? '' : this.niyatQuestionData.questionenglish,
      niyatstatus: this.niyatQuestionData.niyatstatus,
      niyatTypeId: this.niyatQuestionData.niyatTypeId,
      questionTypeId: this.niyatQuestionData.questionTypeId,
      umoorName: this.niyatQuestionData.umoorName,
      trophycount: this.niyatQuestionData.trophycount,
    });
  }

  /******************************************************************************
   *
   * @brief Patch the Default Values For niyatQuestionForm
   * @param none
   * @return none
   *
   ******************************************************************************/
  patchFormDefault() {
    this.niyatQuestionForm.patchValue({
      niyatstatus: this.status[0].value,
    });
  }

  /******************************************************************************
   *
   * @brief Navigate to Niyat Question list page
   * @param none
   * @return none
   *
   ******************************************************************************/
  redirectToDepartmentList() {
    this.router.navigate(["./admin/niyat-question/list"]);
  }

  /******************************************************************************
   *
   * @brief open dialog box after click on cancel
   * @param none
   * @return redirection and reset form
   *
   ******************************************************************************/
  openDialog() {
    this.redirectToDepartmentList();
  }

  /******************************************************************************
   *
   * @brief On Change niyat template
   * @param none
   * @return none
   *
   ******************************************************************************/
  onChangeNiyatStatus(event: any) {
    if (event.value != null) {
      if (event.value === "INACTIVE") {
        const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
          width: "450px",
          data: {
            name: "Are you sure you want to delete this Question ?",
            heading: "",
            buttonSubmit: "Delete",
            buttonCancel: "Discard",
            record: event,
          },
        });

        dialogRef
          .afterClosed()
          .pipe(takeUntil(this.destroy$))
          .subscribe((result) => {
            if (result === "closed") {
              this.niyatQuestionForm.patchValue({ niyatstatus: "ACTIVE" });
            }
          });
      }
    }
  }

  cloneRecord() {
    const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
      width: "450px",
      data: {
        name: "Are you sure you want to clone this Niyat Question ?",
        heading: "",
        buttonSubmit: "Confirm",
        buttonCancel: "Discard",
        record: this.niyatQuestionData,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          let lId = btoa(this.id);
          this.router.navigateByUrl(`/admin/niyat-question/add?cloneId=${lId}`);
        }
      });
  }
}
