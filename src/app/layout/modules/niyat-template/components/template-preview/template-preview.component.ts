import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {LocalStorageService} from '../../../../../auth/service/storage/localstorage.service';
import { ToastrService } from 'ngx-toastr';
import { config } from 'src/app/shared/models/validation_config';
import { TemplateService } from '../../../niyat-template/services/template.service';
import { QuestionTypeService } from '../../../niyat-question/services/question-type.service';
import { SpinnerService } from 'src/app/shared/services/spinner/spinner.service';
import { DownloadXLSQuestionsService } from '../../services/downloadXLSQuestions.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonService } from '../../../dashboard/service/common.service';


@Component({
  selector: 'app-template-preview',
  templateUrl: './template-preview.component.html',
  styleUrls: ['./template-preview.component.scss']
})
export class TemplatePreviewComponent implements OnInit {
   objValue:any; 
   previewTemplateForm:any = FormGroup;
   disableBtn: boolean = false;  
   questionList: any = [];
   templateData: any = [];

   id: any;
   action: any;

   validationMessages: any = {
     templateName: config.validationMessages.templatename
   }

   private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private localService: LocalStorageService,
    private toastrservice: ToastrService,
    private templateService: TemplateService,
    private questionTypeService: QuestionTypeService,
    public spinner: SpinnerService,
    private _downloadXLSQuestionsService : DownloadXLSQuestionsService,
    private activeroute: ActivatedRoute,
    public commonservices: CommonService
  ) { }

  ngOnInit(): void {
    let obj:any = this.localService.get('template_preview');
    this.objValue = JSON.parse(obj);


    this.id = this.activeroute.snapshot.queryParamMap.get('id');
    if (this.id) {
      this.id = atob(this.id);
      this.action = 'Update';
    } else {
      this.action = 'Create';
    }
    this.createForm();
    this.getQuestionsList();
    this.patchForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }


    /******************************************************************************
  *
  * @brief Create the templateForm
  * @param none
  * @return none
  *
  ******************************************************************************/
    createForm(): void {
      this.previewTemplateForm = this.fb.group({
        templateName: [null, [Validators.required]]
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
    return this.previewTemplateForm.controls;
  }

  /******************************************************************************
   *
   * @brief Patch the templateForm
   * @param none
   * @return none
   *
   ******************************************************************************/
  patchForm() {
    this.previewTemplateForm.patchValue({
      templateName: this.objValue.templateName
    });
    this.questionList = this.objValue.niyatQuest
  }



    /******************************************************************************
   *
   * @brief Get getAll Question list
   * @param none
   * @return none
   *
   ******************************************************************************/
    getQuestionsList(): void {
      this.templateService.getQuestionsList().pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.questionList = [];
        for(let i = 0; i <= this.objValue.niyatQuestId.length;i++){
              data.map((val:any)  =>{
                if(val.id == this.objValue.niyatQuestId[i]){
                  this.questionList.push(val)
                }
            })
        }
      });
    }

      /******************************************************************************
 *
 * @brief Submit template form data
 * @param none
 * @return none
 *
 ******************************************************************************/
  onSubmit(val:string) {
    if (this.previewTemplateForm.invalid) {
      this.previewTemplateForm.markAllAsTouched();
      return false;
    }else{
      this.disableBtn = true;
      this.spinner.show();
      let req = this.previewTemplateForm.getRawValue();
      req['niyatQuestId'] = this.objValue.niyatQuestId ;
      req['creatorItsId'] = this.localService.get('itsId');
      req['userStatus'] = 'ACTIVE';
      this.templateData = req;

      if(this.action === 'Update') {
        this.templateService.editTemplate(this.id, req).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          this.toastrservice.success(this.commonservices.toTitleCase(res.message));
          this.templateData['templateId'] = res.data.templateId;
          if(val == 'export'){
            this.templateData['niyatQuest'] = this.questionList; 
            this.templateData['val'] = 'export';
            this._downloadXLSQuestionsService.adjustHeader(this.templateData)
          }
          this.localService.remove('template_preview');
          this.spinner.hide();
          this.router.navigate(['./admin/niyat-template/list']);
        }, (err) => {
          this.spinner.hide();
          this.disableBtn = false;
        })
      }else {      
        this.templateService.addTemplate(req).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          this.toastrservice.success(this.commonservices.toTitleCase(res.message));
          this.templateData['templateId'] = res.data.templateId;
          if(val == 'export'){
            this.templateData['niyatQuest'] = this.questionList; 
            this.templateData['val'] = 'export';
            this._downloadXLSQuestionsService.adjustHeader(this.templateData)
          }
  
          this.spinner.hide();
          this.localService.remove('template_preview');
          this.router.navigate(['./admin/niyat-template/list']);
        }, (err) => {
          this.spinner.hide();
          this.disableBtn = false;
        })
      }
    }
  }
    
}
