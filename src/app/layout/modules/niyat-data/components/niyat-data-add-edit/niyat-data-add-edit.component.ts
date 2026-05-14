import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup,Validators } from "@angular/forms";
import { SpinnerService } from 'src/app/shared/services/spinner/spinner.service';
import { config } from 'src/app/shared/models/validation_config';
import { NiyatDataService } from '../../services/niyat-data.service';
import { TemplateService } from '../../../niyat-template/services/template.service';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from "@angular/common";
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { CommonService } from '../../../dashboard/service/common.service';
import { LocalStorageService } from 'src/app/auth/service/storage/localstorage.service';
import { QrcodeScanComponent } from '../../../../../shared/componets/qrcode-scan/qrcode-scan.component'
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SmartDialogDeleteComponent } from 'src/app/shared/componets/smart-dialog/smart-dialog-delete.component';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-niyat-data-add-edit',
  templateUrl: './niyat-data-add-edit.component.html',
  styleUrls: ['./niyat-data-add-edit.component.scss']
})
export class NiyatDataAddEditComponent implements OnInit {
  @ViewChild("screen") screen: ElementRef;
  @ViewChild("canvas") canvas: ElementRef;
  @ViewChild("downloadLink") downloadLink: ElementRef;

  imageUpload$: Subject<any> = new Subject<any>();
  
  ValidItsId: any = false;
  @ViewChild('dateCtrl') dateCtrl: any;
  itsIdForm: any = FormGroup;
  niyatForm: any = FormGroup;
  niyatTemplate: any = [];
  filteredTemplates: Observable<any[]>;
  templateSearchControl = new FormControl();
  niyatQuestion: any = [];
  templateClicked: boolean = false;
  action: any;
  id: any;
  isFileUpload: boolean = false
  disableBtn: boolean = false;
  niyatDataValues: any;
  niyateDate: any = "";
  templatedId: number = 0;
  isQrCode: any = 'false'
  // fileToUpload: File | null = null;
  fileUpload: any = [];
  fileName: string = "";
  userName: string = "";
  jamiyatMobile: string = "";
  jamaatAge: string = "";
  jamaatName: string = "";
  jamiyatName: string = "";
  jamaatId: number | null = null;
  jamiyatId: number | null = null;
  maxDate = new Date();
  imgLenght: any = 0;
  remarks: any = "";
  validationMessages: any = {
    ItsId: config.validationMessages.itsId
  }
  private destroy$ = new Subject();
  imagePath: any;
  niyatUrls: any = [];
  products: any = []
  formSubmitted = false;
  isDateValid = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public spinner: SpinnerService,
    public niyatDataService: NiyatDataService,
    public niyatTemplateService: TemplateService,
    public changeDetection: ChangeDetectorRef,
    private toastrservice: ToastrService,
    public commonservices: CommonService,
    private localStorageService: LocalStorageService,
    public dialog: MatDialog
  ) { 
   
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.checkItsForm();
    this.isQrCode = this.localStorageService.get('isQrCode');
    if (this.isQrCode === "true") {
      let templateId1: any = this.localStorageService.get('templateId');
      let loginId: any = this.localStorageService.get('itsId');
      this.ValidItsId = loginId
      this.templatedId = parseInt(atob(templateId1))
      this.validateItsId(loginId);
      this.action = 'QRCODE';
      if (this.templatedId !== null) {
        let templateIsMumin=this.templatedId+'-' + true
        this.getQuestionByTemplateId(templateIsMumin);
      }

    } else {
      this.getNiyatTemplateList();
      if (this.id) {
        this.id = atob(this.id);
        let splitParams = this.id?.split('-', 3)[2];
        this.isQrCode = splitParams;
        if (this.isQrCode === "true") {
          this.action = 'EDIT'
          let splitParams = this.id?.split('-', 3)[1];
          this.ValidItsId = splitParams;
          this.templatedId = this.id?.split('-', 3)[0];
          this.editQrVodeValidateItsId(this.ValidItsId)
          this.getNiyatScannedDataById(this.id);
        } else {
          this.getNiyatDataByID(this.id);
          this.action = 'EDIT';
        }

      } else {
        const cloneId = this.route.snapshot.queryParamMap.get('cloneId');
        if (cloneId) {
          const id = atob(cloneId);
          this.action = 'Clone';
          this.getNiyatDataByID(id);
        } else {
          this.action = 'Add';
        }
      }
    }
    this.filteredTemplates = this.templateSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (!value || value === '') {
            this.templateClicked = false;
            this.niyatQuestion = [];
            this.niyateDate = '';
            this.isDateValid = false;
        }
        return typeof value === 'string' ? value : value?.templateName;
      }),
      map(name => name ? this._filterTemplates(name) : this.niyatTemplate.slice())
    );

   
    
  }

  displayTemplateFn(template: any): string {
    return template && template.templateName ? template.templateName : '';
  }

  private _filterTemplates(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.niyatTemplate.filter((option: any) => option.templateName.toLowerCase().includes(filterValue));
  }

  clearSearch() {
    this.templateSearchControl.setValue('');
    this.niyatQuestion = []; // Optionally clear questions if desired, or just reset search
    this.niyateDate = '';
    this.templateClicked = false;
    this.isDateValid = false;
  }

  validateDate(control: any, rawValue?: string) {
    // Reset immediately so form hides on invalid input
    this.isDateValid = false;

    if (!control || !control.control) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const value = control.value;
    // Prioritize rawValue from the input field string
    const inputValue = (rawValue !== undefined ? rawValue : (typeof value === 'string' ? value : '')).trim();

    // 1. Empty Check
    if (!inputValue) {
      control.control.setErrors({ required: true });
      control.control.markAsTouched();
      control.control.markAsDirty();
      this.changeDetection.detectChanges();
      return;
    }

    // 2. Strict Format Check (MM/DD/YYYY)
    // Supports 1/12/2026 or 01/12/2026
    const regex = /^(0?[1-9]|1[0-2])[\/-](0?[1-9]|[12][0-9]|3[01])[\/-](\d{4})$/;
    const match = inputValue.match(regex);
    
    if (!match) {
      control.control.setErrors({ invalidDate: true });
      control.control.markAsTouched();
      control.control.markAsDirty();
      this.changeDetection.detectChanges();
      return;
    }

    const month = +match[1];
    const day = +match[2];
    const year = +match[3];
    const date = new Date(year, month - 1, day);

    // 3. Real Calendar Validation
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      control.control.setErrors({ invalidDate: true });
      control.control.markAsTouched();
      control.control.markAsDirty();
      this.changeDetection.detectChanges();
      return;
    }

    // 4. Future Date Check
    if (date > today) {
      control.control.setErrors({ futureDate: true });
      control.control.markAsTouched();
      control.control.markAsDirty();
      this.changeDetection.detectChanges();
      return;
    }

    // ✅ ALL CHECKS PASSED
    this.niyateDate = date;
    control.control.setErrors(null);
    this.isDateValid = true;
    control.control.markAsTouched();
    control.control.markAsDirty();
    this.changeDetection.detectChanges();
  }






  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

  /******************************************************************************
   *
   * @brief Navigate to Niyat list page
   * @param none
   * @return none
   *
   ******************************************************************************/
  redirectToDataList() {
    if (this.isQrCode === 'true') {
      if (this.action === 'QRCODE') {
        this.localStorageService?.clear();
        this.router.navigate(['./admin/login'])
      }
      else {
        this.router.navigate(['./admin/niyatCount/list']);
      }
    } else {
      this.router.navigate(['./admin/niyat-data/list']);
    }
  }
  editQrVodeValidateItsId(ids: any) {
    this.niyatDataService.getValidITSId(ids)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.error) {
          this.toastrservice.error(this.commonservices.toTitleCase(res.message));
        } else {
          this.jamiyatId = res.jamiat.id;
          this.jamaatId = res.jamaat.id;
          this.spinner.hide();
        }
      }, err => {
        console.log(err);
        this.spinner.hide();
      })
  }

  /******************************************************************************
   *
   * @brief Navigate to Niyat Its page
   * @param none
   * @return none
   *
   ******************************************************************************/
  BackToItsNiyat() {
    this.ValidItsId = false;
    this.templateClicked = false;
    this.niyateDate = "";
  }


  /******************************************************************************
  *
  * @brief Create the Form for Its Id Check
  * @param none
  * @return none
  *
  ******************************************************************************/
  checkItsForm(): void {
    this.itsIdForm = this.fb.group({
      ItsId: [null, [Validators.required, Validators.maxLength(config.validation.itsId.maxLength), Validators.minLength(config.validation.itsId.minLength), Validators.pattern(config.validation.itsId.regExp)]]
    });


  }

  /******************************************************************************
  *
  * @brief Create the Form for niyat data
  * @param none
  * @return none
  *
  ******************************************************************************/
  createForm(): void {
    // let decimal="^[0-9]+\.[0-9][0-9]$"
    let group: any = {};
    for (let data of this.niyatQuestion?.niyatQuest) {
      group[data.id] = [null, [Validators.required]]
    }
    this.niyatForm = this.fb.group(group)
  }

  /******************************************************************************
  *
  * @brief Create the Form and Patch data for niyat data
  * @param none
  * @return none
  *
  ******************************************************************************/
  createPatchForm(): void {
    let group: any = {};
    for (let data of this.niyatQuestion?.niyatQuest) {
      let value = this.niyatDataValues?.quesAns.filter((x: any) => x.quesId == data.id);
      let ansv = '';
      if (value[0]) {
        if (value[0].ans != null) {
          ansv = value[0].ans;
          if (value[0].ans.toLowerCase() == 'yes') {
            ansv = '1';
          } else if (value[0].ans.toLowerCase() == 'no') {
            ansv = '2';
          }
        }
      }
      group[data.id] = [ansv, [Validators.required]]
    }
    this.niyatForm = this.fb.group(group)
  }

  /******************************************************************************
   *
   * @brief Get getNiyatTemplate list
   * @param id
   * @return none
   *
   ******************************************************************************/
  getNiyatTemplateList(): void {
    this.niyatTemplateService.getTemplateList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.niyatTemplate = data;
        this.templateSearchControl.setValue('');
        this.changeDetection.detectChanges();
      });

  }

  validateItsId(ids: any) {
    this.niyatDataService.getValidITSIdForMumin(ids)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.error) {
          this.toastrservice.error(this.commonservices.toTitleCase(res.message));
        } else {
          this.jamiyatId = res.jamiat.id;
          this.jamaatId = res.jamaat.id;
          this.spinner.hide();
        }
      }, err => {
        console.log(err);
        this.spinner.hide();
      })
  }

  /******************************************************************************
  *
  * @brief f() is used to get the form controls
  * @param none
  * @return controls of form
  *
  ******************************************************************************/
  get f() {
    return this.niyatForm.controls;
  }

  /******************************************************************************
  *
  * @brief Submit Its form data
  * @param none
  * @return none
  *
  ******************************************************************************/
  onItsSubmit() {

    if (this.itsIdForm.invalid) {
      this.itsIdForm.markAllAsTouched();
      return;
    } else {
      this.spinner.show();
      let req = this.itsIdForm.value;
      this.niyatDataService.getValidITSId(req.ItsId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res.error) {
            this.toastrservice.error(this.commonservices.toTitleCase(res.message));
          } else {
            this.formSubmitted = false
            this.userName = res.userName;
            this.jamaatName = res.jamaat.name;
            this.jamiyatName = res.jamiat.name;
            this.jamaatAge = res.age;
            this.jamiyatMobile = res.mobileNumber
            this.jamiyatId = res.jamiat.id;
            this.jamaatId = res.jamaat.id;
            this.ValidItsId = req.ItsId;
            this.spinner.hide();
          }
        }, err => {
          console.log(err);
          this.spinner.hide();
        })
    }

  }

  /******************************************************************************
  *
  * @brief On Change niyat template 
  * @param none
  * @return none
  *
  ******************************************************************************/
  onChangeNiyatTemplate(event: any) {
    const value = event.value || event.option?.value?.templateId;
    if (value != null) {
      this.templatedId = value;
      this.niyatDataService.getTemplateByID(value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.niyatQuestion = data;
          this.createForm();
          this.templateClicked = true;
          this.changeDetection.detectChanges();
        });
    }
  }

  onTemplateSelected(event: MatAutocompleteSelectedEvent) {
    const selectedTemplate = event.option.value;
    this.onChangeNiyatTemplate({ value: selectedTemplate.templateId });
  }

  /******************************************************************************
 *
 * @brief Get Niyat Data by Id
 * @param string id
 * @return none
 *
 ******************************************************************************/
  getNiyatDataByID(id: string): void {
    this.niyatDataService.getNiyatByID(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.niyatDataValues = res;
        this.patchForm();
      }, error => { console.log(error) });
  }


  /******************************************************************************
*
* @brief Get Niyat Scanned Data by Id
* @param string id
* @return none
*
******************************************************************************/
  getNiyatScannedDataById(id: string): void {
    let splitParams = id.split('-', 2);
    this.niyatDataService.getNiyatScannedByID(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.niyatDataValues = res;
        // this.patchForm();
        // this.createPatchForm();
        this.getQuestionByTemplateId(splitParams[0]+'-')
      }, error => { console.log(error) });
  }

  /******************************************************************************
 *
 * @brief Patch the niyatForm
 * @param none
 * @return none
 *
 ******************************************************************************/
  patchForm() {
    this.ValidItsId = this.niyatDataValues.itsId;
    this.templatedId = this.niyatDataValues.templateId;
    this.niyateDate = this.niyatDataValues.niyateDate;

    this.niyatDataService.getValidITSId(this.ValidItsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (!res.error) {
          this.userName = res.userName;
          this.jamaatName = res.jamaat.name;
          this.jamiyatName = res.jamiat.name;
          this.jamaatAge = res.age;
          this.jamiyatMobile = res.mobileNumber;
          this.jamiyatId = res.jamiat.id;
          this.jamaatId = res.jamaat.id;
        }
      });

    this.niyatDataService.getTemplateByID(this.templatedId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.niyatQuestion = data;
        this.createPatchForm();
        this.templateClicked = true;
        this.fileUpload.push(this.niyatDataValues?.imagePath);
        this.niyatUrls.push(this.niyatDataValues?.imagePath)
        if (this.niyatDataValues.imagePath2 !== null) {
          this.niyatUrls.push(this.niyatDataValues?.imagePath2);
          this.fileUpload.push(this.niyatDataValues?.imagePath2);
        }
        this.imgLenght = this.niyatUrls?.length;
        this.imgviewPopup()
        setTimeout(() => this.imageUpload$.next(this.niyatDataValues.imagePath), 0)
        
        const selectedTemplate = this.niyatTemplate.find((t: any) => t.templateId == this.templatedId);
        if (selectedTemplate) {
          this.templateSearchControl.setValue(selectedTemplate);
        }
        this.isDateValid = true;
        this.changeDetection.detectChanges();
      });
  }
  /******************************************************************************
 *
 * @brief Patch the niyatForm using Qr Code
 * @param none
 * @return none
 *
 ******************************************************************************/

  getQuestionByTemplateId(ids: any) {
    this.niyatDataService.getTemplateIsmuminByID(ids)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if(data?.length===0){
          this.localStorageService?.clear();
          this.router.navigate(['./admin/login'])
        }
        this.niyatQuestion = data;
        if (this.action === 'QRCODE') {
          this.createForm();
        } else {
          this.createPatchForm();
        }

        this.templateClicked = true;
        this.niyateDate = Date();
      });
  }

  /******************************************************************************
  *
  * @brief Submit update niyat form data
  * @param none
  * @return none
  *
  ******************************************************************************/
  onSubmit() {
    this.formSubmitted = true;
    
    // Check manual date validation
    if (!this.niyateDate || (this.dateCtrl && this.dateCtrl.invalid)) {
      if (this.dateCtrl) this.dateCtrl.control.markAsTouched();
      this.toastrservice.error('Please enter a valid date');
      return;
    }

    if (this.niyatUrls?.length === 0 && this.isQrCode  !== 'true') {
      this.toastrservice.error('Upload Niyat Scan Copy');
      return;
    }

    if (this.niyatForm.invalid) {
      this.niyatForm.markAllAsTouched();
      return;
    } else {
     
      let submitData: any = {};
      let templateQuestionAnswer: any = [];
      let req = this.niyatForm.value;
      //Creating data format to submit
      for (var key in req) {
        if (req.hasOwnProperty(key)) {
          let questData = { quesId: key, ans: req[key] }
          templateQuestionAnswer.push(questData);
        }
      }

      if (this.isQrCode === 'true') {
        const format = 'yyyy-MM-dd';
        const myDate = new Date();
        const locale = 'en-US';
        const formattedDate = formatDate(myDate, format, locale);
        //End data format creation
        submitData = { itsId: this.ValidItsId, jamaatId: this.jamaatId, jamiatId: this.jamiyatId, templateId: this.templatedId, niyateDate: formattedDate, quesAns: templateQuestionAnswer };
        // submitData['remarks']=this.remarks;
        if (this.action === 'EDIT') {
          const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
            width: '450px',
            data: { name: 'Please download the Niyat form before submitting and upload with the template.', heading: '', buttonSubmit:'Ok', record: submitData },
          });
          submitData['remarks']=this.remarks;
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              if (this.niyatUrls?.length === 0 && this.action  !== 'QRCODE') {
                this.toastrservice.error('Upload Niyat Scan Copy');
                return;
              }
              this.spinner.show();
              this.niyatDataService.addNiyatData(submitData, this.fileUpload)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                  this.fileUpload = [];
                  this.niyatUrls = [];
                  this.router.navigate(['./admin/niyatCount/list']);
                  this.toastrservice.success(this.commonservices.toTitleCase(res.message));
                  this.spinner.hide();
                }, (err) => {
                  console.log(err);
                  this.spinner.hide();
                  this.disableBtn = false;
                },
                )
            }
            this.spinner.hide();
          });

        } else {
          this.spinner.show();
          this.niyatDataService.addScanNiyat(submitData, this.fileUpload)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
              this.fileUpload = [];
              this.niyatUrls = [];
              this.toastrservice.success(this.commonservices.toTitleCase(res.message));
              this.localStorageService?.clear();
              this.router.navigate(['./admin/login']);
              const qrCodePopup = this.dialog?.open(QrcodeScanComponent, {
                width: '350px',
                data: {}
              })

              this.spinner.hide();
            }, (err) => {
              console.log(err);
              this.spinner.hide();
              this.disableBtn = false;
            },
            )
        }

      } else {
        this.spinner.show();
        const format = 'yyyy-MM-dd';
        const myDate = this.niyateDate;
        const locale = 'en-US';
        const formattedDate = formatDate(myDate, format, locale);
        submitData = { itsId: this.ValidItsId, jamaatId: this.jamaatId, jamiatId: this.jamiyatId, templateId: this.templatedId, niyateDate: formattedDate, quesAns: templateQuestionAnswer,remarks:'' };

        if (this.action === 'EDIT') {
          let tId = this.niyatDataValues.itsId + '/' + this.niyatDataValues.templateId;
          this.niyatDataService.editNiyatData(tId, submitData, this.fileUpload)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
              this.fileUpload = [];
              this.niyatUrls = [];
              this.toastrservice.success(this.commonservices.toTitleCase(res.message));
              if (this.isQrCode === "true") {
                this.router.navigate(['./admin/niyatCount/list']);
              } else {
                this.router.navigate(['./admin/niyat-data/list']);
              }

              this.spinner.hide();
            }, (err) => {
              console.log(err);
              this.spinner.hide();
              this.disableBtn = false;
            },
            )
        } else {

          this.niyatDataService.addNiyatData(submitData, this.fileUpload)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
              this.fileUpload = [];
              this.niyatUrls = [];
              this.toastrservice.success(this.commonservices.toTitleCase(res.message));
              if (this.isQrCode === "true") {
                this.localStorageService?.clear();
                this.router.navigate(['./admin/login']);
                const qrCodePopup = this.dialog?.open(QrcodeScanComponent, {
                  data: {}
                })
              } else {
                this.router.navigate(['./admin/niyat-data/list']);
              }
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
  }

  /******************************************************************************
 *
 * @brief Handle File upload
 * @param none
 * @return none
 *
 ******************************************************************************/

  // sendImageEvent(event: any) {
  //     this.imagePath=event.name
  //   this.fileToUpload = event;
  // }
  onSelectFile(event: any) {
    if (event.target.files[0].type !== "image/jpeg" && event.target.files[0].type !== "image/png" && event.target.files[0].type !== "image/jpg") {
      this.toastrservice.error("Please upload jpg/png/jpg file .");
      return
    }
    if (event.target.files[0].size > 5000000) {/* checking size here - 5MB */
      this.toastrservice.error("Image size cannot be greater than 5 MB .");
      return
    }
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.niyatUrls.push(event.target.result);
          this.imgLenght = this.niyatUrls?.length;
          this.imgviewPopup()
        }
        reader.readAsDataURL(event.target.files[i]);
        this.fileUpload.push(event.target.files[i])

      }

    }
  }
  removeImg(index: any) {
    this.niyatUrls?.splice(index, 1);
    this.products?.splice(index, 1)
    if (this.fileUpload[index]) {
      this.fileUpload?.splice(index, 1)
    }
    this.imgLenght = this.niyatUrls?.length;


  }
  imgviewPopup() {
    this.products = []
    for (let i = 0; i < this.niyatUrls?.length; i++) {
      this.products.push({
        images: [{
          image: this.niyatUrls[i],
          thumbImage: this.niyatUrls[i],
        }]
      }
      )
    }

  }
 downloadAsPDF() {
    html2canvas(this.screen.nativeElement).then((canvas:any) => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL("image/png");
      this.downloadLink.nativeElement.download = "niyat_"+this.ValidItsId+".png";
      this.downloadLink.nativeElement.click();
    });
  }

}
