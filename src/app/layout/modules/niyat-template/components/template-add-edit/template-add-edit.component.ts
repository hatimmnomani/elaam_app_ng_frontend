import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SpinnerService } from "src/app/shared/services/spinner/spinner.service";
import { DepartmentService } from "../../../department/services/department.service";
import { UmoorService } from "../../../umoor/services/umoor.service";
import { TemplateService } from "../../../niyat-template/services/template.service";
import { ToastrService } from "ngx-toastr";
import { config } from "src/app/shared/models/validation_config";

import { LocalStorageService } from "../../../../../auth/service/storage/localstorage.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CommonService } from "../../../dashboard/service/common.service";
import { MatDialog } from "@angular/material/dialog";
import { SmartDialogDeleteComponent } from "src/app/shared/componets/smart-dialog/smart-dialog-delete.component";

@Component({
  selector: "app-template-add-edit",
  templateUrl: "./template-add-edit.component.html",
  styleUrls: ["./template-add-edit.component.scss"],
})

export class TemplateAddEditComponent implements OnInit {
  templateForm: any = FormGroup;
  disableBtn: boolean = false;
  checkedArray: any = [];
  checkedArrayIDs: any = [];
  id: any;
  action: any;

  umoorList: any = [];
  templateData: any;
  departmentList: any = [];
  questionList: any = [];
  questionList$: any = [];
  selected = null;
  private destroy$ = new Subject();
  columnsHeader = [
    {
      columnDef: "add-edit-question",
      header: "Question",
      dataName: (row: any) =>
        `${row.questionenglish || row.question_eng || "-"}`,
    },
    {
      columnDef: "select",
      header: "Select Asset",
      dataName: (row: any) => `${row || "-"}`,
    },
  ];

  validationMessages: any = {
    templateName: config.validationMessages.templatename,
  };
  status: string = "ACTIVE";
  selectedDepartment: any = null;
  selectedUmoor: any = null;
  objValue: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public spinner: SpinnerService,
    private departmentService: DepartmentService,
    private templateService: TemplateService,
    private toastrservice: ToastrService,
    private changeDetection: ChangeDetectorRef,
    private umoorservice: UmoorService,
    private router: Router,
    private localService: LocalStorageService,
    public commonservices: CommonService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getQuestionsList();
    this.getUmoorList();
    this.getDepartmentList();

    this.createForm();
    this.id = this.route.snapshot.paramMap.get("id");
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

  /******************************************************************************
   *
   * @brief Get all umoor
   * @param none
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

  /*  ******************************************************************************
   * @brief Get all questions
   * @param none
   * @return qustion list
   *
   ******************************************************************************/

  getQuestionsList(): void {
    this.templateService
      .getQuestionsList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.questionList = data;
        this.questionList$ = data;
        this.checkedArray = [];

        if (this.id) {
          this.id = atob(this.id);
          this.action = "EDIT";
          this.getTemplateById(this.id);
        } else {
          this.action = "Create";
        }

        const cloneId = this.route.snapshot.queryParamMap.get("cloneId");
        if (cloneId) {
          const id = atob(cloneId);
          this.action = "Clone";
          this.getTemplateById(id);
        }

        if (this.localService.get("template_preview") != null) {
          let obj: any = this.localService.get("template_preview");
          this.templateData = JSON.parse(obj);
          let newArray: any[] = []
          for(let i = 0; i <= this.templateData.niyatQuestId.length;i++){
            this.questionList.map((val:any)  =>{
              if(val.id == this.templateData.niyatQuestId[i]){
                newArray.push(val)
              }
            })
          }

          this.templateData.niyatQuest = newArray;
          this.patchForm();
        }

        this.changeDetection.detectChanges();
      });
  }

  /******************************************************************************
   *
   * @brief Get all departments
   * @param none
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
   * @brief Create the templateForm
   * @param none
   * @return none
   *
   ******************************************************************************/
  createForm(): void {
    this.templateForm = this.fb.group({
      templateName: [
        null,
        [
          Validators.required,
          Validators.minLength(config.validation.templatename.minLength),
          Validators.maxLength(config.validation.templatename.maxLength),
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
    return this.templateForm.controls;
  }

  /******************************************************************************
   *
   * @brief Submit update template form data
   * @param none
   * @return none
   *
   ******************************************************************************/
  onSubmit() {
    if (this.templateForm.invalid) {
      this.templateForm.markAllAsTouched();
      return;
    } else {
      this.disableBtn = true;
      this.spinner.show();
      let req = this.templateForm.getRawValue();
      req["niyatQuestId"] = this.getIDsOfChecked();
      req["creatorItsId"] = this.localService.get("itsId");

      if(this.action === "EDIT") {
        req["userStatus"] = this.status;
        this.templateService
          .editTemplate(this.templateData.templateId, req)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (res) => {
              this.toastrservice.success(this.commonservices.toTitleCase(res.message));
              this.localService.remove("template_preview")
              this.router.navigate(["./admin/niyat-template/list"]);
              this.spinner.hide();
            },
            (err) => {
              this.spinner.hide();
              this.disableBtn = false;
            }
          );
      } else {
        req["userStatus"] = 'ACTIVE';
        this.templateService
          .addTemplate(req)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (res) => {
              this.toastrservice.success(this.commonservices.toTitleCase(res.message));
              this.localService.remove("template_preview")
              this.router.navigate(["./admin/niyat-template/list"]);
              this.spinner.hide();
            },
            (err) => {
              this.spinner.hide();
              this.disableBtn = false;
            }
          );
      }
    }
  }

  /******************************************************************************
   *
   * @brief Get template by Id
   * @param string id
   * @return none
   *
   ******************************************************************************/
  getTemplateById(id: string): void {
    this.templateService
      .getTemplateByID(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.templateData = res;
          this.patchForm();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /******************************************************************************
   *
   * @brief Patch the templateForm
   * @param none
   * @return none
   *
   ******************************************************************************/
  patchForm() {
    this.templateForm.patchValue({
      templateName: this.action === 'Clone' ? '' : this.templateData.templateName,
    });
    this.status = this.templateData.userStatus;
    this.checkedArray = this.templateData.niyatQuest.filter(
      (val: any) => (val["checkedStatus"] = true)
    );
    this.getAllQuestionExceptChecked();
  }

  /******************************************************************************
   *
   * @brief get all  none checked questions
   * @param none
   * @return question list
   *
   ******************************************************************************/

  getAllQuestionExceptChecked() {
    let checkValuesArray = this.getIDsOfChecked();
    this.questionList$ = this.questionList.filter((data: any) => {
      return checkValuesArray.indexOf(data.id) == -1;
    });
  }

  getIDsOfChecked() {
    this.checkedArrayIDs = [];
    this.checkedArray.filter((val: any) => this.checkedArrayIDs.push(val.id));
    var mySet = new Set(this.checkedArrayIDs);
    return [...mySet];
  }

  /******************************************************************************
   *
   * @brief open dialog box after click on cancel
   * @param none
   * @return redirection and reset form
   *
   ******************************************************************************/
  openDialog() {
    this.router.navigate(["./admin/niyat-template/list"]);
  }

  /******************************************************************************
   *
   * @brief get Questions according to umoor
   * @param val
   * @return question list
   *
   ******************************************************************************/

  getUmoorName(val: any) {
    this.selectedUmoor = val;
    this.selectedDepartment = null;

    this.questionList$ = this.questionList.filter((data: any) => {
      return (
        data.umoor_name === val && this.getIDsOfChecked().indexOf(data.id) == -1
      );
    });

    if (val == "all") {
      this.questionList$ = this.questionList;
      this.getAllQuestionExceptChecked();
    }

    this.changeDetection.detectChanges();
  }

  /******************************************************************************
   *
   * @brief get Questions according to department name
   * @param val
   * @return question list
   *
   ******************************************************************************/
  getDepartmentName(val: any) {
    this.selectedDepartment = val;
    this.selectedUmoor = null;
    this.questionList$ = this.questionList.filter((data: any) => {
      return (
        data.department_name === val &&
        this.getIDsOfChecked().indexOf(data.id) == -1
      );
    });
    if (val == "all") {
      this.questionList$ = this.questionList;
      this.getAllQuestionExceptChecked();
    }
    this.changeDetection.detectChanges();
  }

  fetchedRecord2(event: any) {
    if (event.checkboxSelectedVal) {
      var index: number = this.checkedArray.indexOf(
        event.checkboxSelectedVal.record
      );
      this.checkedArray.splice(index, 1);
      event.checkboxSelectedVal.record["checkedStatus"] = false;
      if (
        event.checkboxSelectedVal.record.umoor_name == this.selectedUmoor ||
        event.checkboxSelectedVal.record.department_name ==
          this.selectedDepartment
      ) {
        this.questionList$.push(event.checkboxSelectedVal.record);
      }
    }
    this.changeDetection.detectChanges();
  }

  /******************************************************************************
   *
   * @brief fetch record data
   * @param string event
   * @return none
   *
   ******************************************************************************/

  fetchedRecord(event: any) {
    if (event.checkboxSelectedVal) {
      // if(event.checkboxSelectedVal.checkedVal === true) {
      event.checkboxSelectedVal.record["checkedStatus"] = true;
      this.checkedArray.push(event.checkboxSelectedVal.record);
      var index: number = this.questionList$.indexOf(
        event.checkboxSelectedVal.record
      );
      this.questionList$.splice(index, 1);
      // }
    }
    this.changeDetection.detectChanges();
  }

  /******************************************************************************
   *
   * @brief Redirect to template preview
   * @param none
   * @return none
   *
   ******************************************************************************/

  redirectToPreview() {
    let req = this.templateForm.getRawValue();
    req["niyatQuestId"] = this.getIDsOfChecked();
    req["creatorItsId"] = this.localService.get("itsId");
    this.localService.set("template_preview", JSON.stringify(req));
    this.router.navigate(["/admin/niyat-template/preview"]);
  }

  /******************************************************************************
   *
   * @brief Redirect to Edit template preview
   * @param none
   * @return none
   *
   ******************************************************************************/
  redirectToPreview2() {
    let req = this.templateForm.getRawValue();
    req["niyatQuestId"] = this.getIDsOfChecked();
    req["creatorItsId"] = this.localService.get("itsId");
    this.localService.set("template_preview", JSON.stringify(req));
    this.router.navigate(["/admin/niyat-template/preview"], {
      queryParams: { id: btoa(this.id) },
    });
  }

  onClone() {
    const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
      width: "450px",
      data: {
        name: "Are you sure you want to clone this template?",
        heading: "",
        buttonSubmit: "Confirm",
        buttonCancel: "Discard",
        record: true, // Pass a record to prevent crash in dialog template
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let lId = btoa(this.id);
        this.router.navigate(["/admin/niyat-template/add"], {
          queryParams: { cloneId: lId },
        });
      }
    });
  }
}
