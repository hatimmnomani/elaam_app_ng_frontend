import { config } from 'src/app/shared/models/validation_config';
import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SendMessageService } from '../../service/send-message.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from 'src/app/shared/services/spinner/spinner.service';
import { CommonService } from '../../../dashboard/service/common.service';
import { LocalStorageService } from 'src/app/auth/service/storage/localstorage.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})


export class SendMessageComponent implements OnInit {

  roleList: any = [
    { id: 1, name: 'Umoor Head', isSelected: false },
    { id: 2, name: 'Department Head', isSelected: false },
    { id: 3, name: 'Aamil', isSelected: false },
    { id: 4, name: 'Jamiat Masool', isSelected: false },
    { id: 5, name: 'Umoor Coordinator', isSelected: false }
  ];

  private destroy$ = new Subject();
  getListData: any = [];
  displayData:any = [];
  showRoles: boolean = false;
  roleName: string = '';
  roleEntityId: any = [];

  sendMessageForm:any = FormGroup;

  validationMessages: any = {
    subject: config.validationMessages.subject,
    messageText: config.validationMessages.message
  }
  roleArray: any = [];
  showMessageBox: boolean = false;
  messageForAll: string = '';
  roleID: number;
  hideLoadMore: boolean = false;
  displayData$: any;
  limit: number = 15;
  searchValue: any;
  searchList: any = [];
  checked: boolean = false;
  checkedArray: any =[];
  roleEntityIdSelected: boolean = false;
  userItsId: any;

  constructor(
    private sendmessageservice: SendMessageService,
    private changeDetection: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    private toastrservice: ToastrService,
    public spinner: SpinnerService,
    public commonservices: CommonService,
    private localService: LocalStorageService,
  ) {
    const data: any = this.localService.get("itsId");
    this.userItsId = JSON.parse(data);
  }


  ngOnInit(): void {
    this.createForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

  /******************************************************************************
  * @brief Create the send Message Form
  * @param none
  * @return none
  *
  ******************************************************************************/
  createForm(): void {
    this.sendMessageForm = this.fb.group({
      subject:[null, [Validators.required,Validators.minLength(config.validation.subject.minLength), Validators.maxLength(config.validation.subject.maxLength)]],
      message:[null,[Validators.required,Validators.minLength(config.validation.message.minLength), Validators.maxLength(config.validation.message.maxLength)]],
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
    return this.sendMessageForm.controls;
  }



  /******************************************************************************
   *
   * @brief Get Niyat Status from api
   * @param start and end date
   * @return none
   *
   ******************************************************************************/
    onCheckboxChange(event: any,role: string): void {
      this.getListData = [];
      this.displayData = [];
      this.roleEntityId = [];
      this.showRoles = false;
      this.roleArray = [];

      this.roleList.forEach((val: { name: string; isSelected: boolean; }) => {
        if(val.name == role) val.isSelected = !val.isSelected;
        else val.isSelected = false;
      });

      switch (role) {
        case 'Umoor Head':
          this.roleName = 'UMOOR';
          this.roleID  = 5;
          this.messageForAll = "Message will be sent to all Umoor Heads. If you want to send messages to specific Umoor Head please select only those Umoor."      
          break;
        
        case 'Department Head':
          this.roleName = 'DEPARTMENT';
          this.roleID  = 4;
          this.messageForAll = "Message will be sent to all Department Heads. If you want to send messages to specific Department Head please select only those Departments."      
          break;
  
        case 'Aamil' || 'Muavin Aamil':
          this.roleName = 'JAMAAT';
          this.roleID  = 3;
          this.messageForAll = "Message will be sent to all Ummal Kiraam. If you want to send messages to specific Ummal Kiraam please select only those Jamaats." 
          break;
  
        case 'Jamiat Masool':
          this.roleName = 'JAMIAT';
          this.roleID  = 2; 
          this.messageForAll = "Message will be sent to all Jamiat Masooleen. If you want to send messages to specific Jamiat Masooleen please select only those Jamiats."    
          break;
        
        case 'Umoor Coordinator':
          this.roleName = 'UMOOR';
          this.roleID  = 6;
          this.messageForAll = "Message will be sent to all Umoor Coordinators . If you want to send message to specific Umoor Coordinator please select only those Umoor."      
          break;
      
        default:
          break;
      }

      if(event.checked == true){
        this.roleArray.push(this.roleName);
        this.showRoles = true;
        this.sendmessageservice.getData('sub-role', this.roleArray).pipe(takeUntil(this.destroy$)).subscribe((data) => {
          this.searchList  = data.filter((value:any, index:any, self:any) => index === self.findIndex((t:any) => (t.name === value.name)))
          this.hideLoadMore = data.length <= this.limit ? false  : true;
          this.getListData = data;

          this.displayData = this.displayData$ =  data.slice(0, this.limit)
          data.filter((val: { id: any; }) => {
            this.roleEntityId.push(val.id)
          });
          this.showMessageBox = true;
        });        
      }else{
        this.roleArray.splice(this.roleArray.indexOf(this.roleName), 1);
        this.displayData = [];
        this.showMessageBox = false;
      }
      this.changeDetection.detectChanges();
    }


    onCheckboxIDs(event:any, data:any){
      if(this.showMessageBox)  {
        this.roleEntityId = [];
      }
      
      if(event.checked) {
        this.showMessageBox = false;
        this.roleEntityId.push(data.id);
        this.roleEntityIdSelected = true;
        this.updatedGetDataValue()
      }else {
        this.roleEntityId.splice(this.roleEntityId.indexOf(data.id), 1);
        this.roleEntityIdSelected = true;
        this.updatedGetDataValue()

        if(this.roleEntityId.length == 0){
          this.getListData.filter((val: { id: any; }) => {
            this.roleEntityId.push(val.id)
          });
          this.showMessageBox = true;
        }
      }
    }


    updatedGetDataValue(){
      if(this.roleEntityIdSelected){
        this.getListData = this.getListData.filter((data: any) => {
          if(this.roleEntityId.indexOf(data.id) !== -1){
            data['checked'] = true;
          }else{
            data['checked'] = false;
          }
          return data
        });
      }

      this.getListData.sort((a:any, b:any) => a.checked < b.checked ? 1 : -1);
      this.refreshDropdown()
    }



  /******************************************************************************
   *
   * @brief show more data
   * @param none
   * @return data return increasing with 15 
   *
  ******************************************************************************/
  showMore() {
    let newLength = this.displayData.length + this.limit;
    if (newLength > this.getListData.length) {
        newLength = this.getListData.length;
        this.hideLoadMore = false;
    }
    this.updatedGetDataValue();
    this.displayData = this.getListData.slice(0, newLength);
  }

 

  /******************************************************************************
   *
   * @brief open dialog box after click on cancel
   * @param none
   * @return redirection and reset form
   *
  ******************************************************************************/
  emptySearch() {
    this.displayData =  this.getListData.slice(0, this.limit)
    this.refreshDropdown();
    this.hideLoadMore = true;
  }


  refreshDropdown(){
    this.searchList = this.getListData.filter((data: any) => {
      return !data.checked
    });
  }

    /******************************************************************************
   *
   * @brief Get Search List
   * @param null
   * @return none
   *
   ******************************************************************************/
  
  searchData(event: any) {
    if(this.roleName == 'UMOOR' && event[0].length != 0 ){
      this.searchValue = event[0].id || event[0];
      this.sendmessageservice.getDataByID("getUmoorById", this.searchValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.displayData = [{'name' : data.umoorName, 'id' : data.umoorId}]
          this.hideLoadMore = false;
        }) 
    }else if(this.roleName == 'DEPARTMENT' && event[0].length != 0){
      this.searchValue = event[0].id || event[0];
      this.sendmessageservice.getDataByID("getDepartmentById", this.searchValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.displayData = [{'name' : data.departmentName, 'id' : data.departmentId}]
          this.hideLoadMore = false;
        }) 
    }else if(this.roleName == 'JAMAAT' && event[0].length != 0){
      this.sendmessageservice.getDataByID("getAllJamaat",'')
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          let newData = data.filter((val: any) => {
            return val.jamaatName == event[0].name
          });
          this.displayData = [{'name' : newData[0].jamaatName, 'id' : newData[0].id}]
          this.hideLoadMore = false;
        }) 
    }else if(this.roleName == 'JAMIAT' && event[0].length != 0){
      this.sendmessageservice.getDataByID("getAllJamiat",'')
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          let newData = data.filter((val: any) => {
            return val.jamiatName == event[0].name
          });
          this.displayData = [{'name' : newData[0].jamiatName, 'id' : newData[0].id}]
          this.hideLoadMore = false;
        }) 
    }else{
      this.emptySearch();
    }
  }

  /******************************************************************************
  *
  * @brief send message 
  * @param none
  * @return none
  *
  ******************************************************************************/
  sendMessage(){
    if(this.roleEntityId.length == 0){
      this.showMessageBox = true;
      this.messageForAll = "Please check atleast one role."
    }

    if(this.sendMessageForm.invalid) {
      this.sendMessageForm.markAllAsTouched();
      return false;
    }else{
      let req = this.sendMessageForm.getRawValue();
        req['roleName'] = this.roleName;
        req['roleId'] = this.roleID;
        if( this.roleID===3){
          req['roleId2'] = 9;  
        }
        req['roleEntityId'] = this.roleEntityId;
        req['itsId'] = this.userItsId;


      this.sendmessageservice.sendMessage(req)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            this.toastrservice.success(this.commonservices.toTitleCase(res.message));
            this.router.navigate(["./admin/dashboard"]);
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
          }
        );
    }
  }

  /******************************************************************************
  *
  * @brief open dialog box after click on cancel
  * @param none
  * @return redirection and reset form
  *
  ******************************************************************************/
  openDialog() {
    this.router.navigate(["./admin/dashboard"]);
  }

  
}
