import { DashboardService } from './../../../dashboard/service/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { SmartDialogDeleteComponent } from 'src/app/shared/componets/smart-dialog/smart-dialog-delete.component';
import { MuminDashboardService } from '../../service/mumin-dashboard.service';
import { LocalStorageService } from 'src/app/auth/service/storage/localstorage.service';
import { Location } from '@angular/common';
import { SpinnerService } from 'src/app/shared/services/spinner/spinner.service';
import { CommonService } from '../../../dashboard/service/common.service';
import { SharedataService } from 'src/app/shared/services/sharedata.service';

@Component({
  selector: 'app-niyat-information',
  templateUrl: './niyat-information.component.html',
  styleUrls: ['./niyat-information.component.scss']
})
export class NiyatInformationComponent implements OnInit {
  private destroy$ = new Subject();

  requestUpdate: Boolean = true;
  id: any;
  niyatInfoData: any;
  requestStatus:any = '';
  commitedValue:any = '';
  pendingTime:any = '0 hour : 0 Minutes';
  pendingTime2:any = '0 hour : 0 Minutes';
  userRole:any;
  daysleft: boolean = true;
  itsApproved: any = null;
  haveSanad:boolean = false;
  userItsId: any;
  updateReqStatus: boolean = false;
  alternateApproverRoles = ['Aamil', 'Umoor Coordinator', 'Muavin Aamil', 'Dept Head', 'Umoor Head'];

  subscription: Subscription;

  niyatProfileLoading = new BehaviorSubject<any>("");
  niyatLoading$ = this.niyatProfileLoading.asObservable();
  niyatParamId:any

  constructor(
    public dialog: MatDialog,
    private muminDashboardSr: MuminDashboardService,
    public spinner: SpinnerService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private toastrservice: ToastrService,
    private localService: LocalStorageService,
    public commonservices: CommonService,
    private sharedata: SharedataService,
  ) { }

  ngOnInit(): void {
    let role:any = this.localService.get("role");
    this.userRole = JSON.parse(role);
    this.userItsId = this.localService.get("itsId");

    let id:any = this.route.snapshot.paramMap.get('id');
    // console.log(id)
    this.niyatParamId=id
    if(id) {
      this.id = atob(id);
      this.getNiyat(this.id);
    }
    this.subscription = this.sharedata.currentMessage.subscribe(message => {
      if(message === 'reload-niyat') {
        console.log('test')
        this.getNiyat(this.id)
        //this.getNotification()
      }
    })
  }



  /******************************************************************************
   *
   * @brief back to previous location navigate
   * @param nn
   * @return none
   *
   ******************************************************************************/

  backtolocation() {
    // When navigating back, ensure we have the latest selected month value from SharedataService
    // This will be used by the month-section component when it initializes
    
    // The selected month value is already stored in SharedataService
    // and will be used by month-section component when returning to dashboard
    
    // Retrieve any saved search and date details to maintain filter context
    const savedSearch = this.localService.get('PrevSearch');
    const savedDate = this.localService.get('PrevDateDetails');
    
    // Ensure we have these values stored before navigating back
    if (!savedSearch && this.niyatInfoData && this.niyatInfoData.searchValue) {
      this.localService.set('PrevSearch', this.niyatInfoData.searchValue);
    }
    
    if (!savedDate && this.niyatInfoData && this.niyatInfoData.dateDetails) {
      this.localService.set('PrevDateDetails', JSON.stringify(this.niyatInfoData.dateDetails));
    }
    
    this.location.back();
  }
 /******************************************************************************
   *
   * @brief view niyat form popup
   * @param string event
   * @return none
   *
   ******************************************************************************/
  viewNiyat(imagePath:any,imagePath2:any){
    {
      const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
        data: { buttonClose:true, imageScanPath: imagePath, imageScanPath2: imagePath2 },
      });
    }
  }
  /******************************************************************************
   *
   * @brief redirect to update niyat form
   * @param string event
   * @return none
   *
   ******************************************************************************/
  updateNiyat(){ 
    if(this.requestStatus==null || this.requestStatus=='')
    {
      this.toastrservice.error('Can`t Proceed With Empty Value');     
      return false; 
    }
    this.muminDashboardSr.completeNiyat(this.id, this.requestStatus)
     .pipe(takeUntil(this.destroy$))
     .subscribe((data) => { 
      if(data.data==null){
        //this.updateReqStatus = true
        window.location.reload()
        this.toastrservice.error(this.commonservices.toTitleCase(data.errorMessage));
      }else{  
       // this.updateReqStatus = true
       window.location.reload()
        this.niyatInfoData = data.data;
        if(this.niyatInfoData[0]){
          if(this.niyatInfoData[0].status == 3){
            this.requestUpdate = false;
          }
          if(this.niyatInfoData[0].niyatType == 'ITS APPROVED'){
            // this.haveSanad  = true;
            if(this.niyatInfoData[0].itsApproved == "You don't have any sanad."){
              // this.itsApproved = this.niyatInfoData[0].itsApproved;
              this.itsApproved = 'You do not have any sanad. Incase, the sanad is not updated on ITS, we request you to kindly contact the Mahad Al-Zahra Department.'
            }else{
              this.itsApproved = ' You have following sanad : ' + this.niyatInfoData[0].itsApproved;
            }
          }
        }
        this.toastrservice.success(this.commonservices.toTitleCase(data.message));
      }
     })
  }
/******************************************************************************
   *
   * @brief show mubarak popup 
   * @param string event
   * @return none
   *
   ******************************************************************************/
  mubarak(event:any){
    const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
      data: {m1:"MUBARAK",record: event,buttonClose:true},
    });
  }
  /******************************************************************************
   *
   * @brief show message popup
   * @param string event
   * @return none
   *
   ******************************************************************************/
   sendMessage(event:any, approver:any, mumin:string){
    const sendingUserRole = approver;
    if(this.userRole != 'Mumin') approver = mumin;

    const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
      data: { form:"sendMessage", username: approver, buttonClose: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined && result.messageText != ""){
        result['roleName'] = sendingUserRole;
        
        this.muminDashboardSr.sendMessage(result, this.userRole, this.id, this.userItsId).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          this.spinner.hide();
          this.toastrservice.success(this.commonservices.toTitleCase(res.message));
        }, (err) => {
          this.spinner.hide();
        })
      }
    });

  }
  /******************************************************************************
   *
   * @brief show contact popup
   * @param string event
   * @return none
   *
   ******************************************************************************/
  contact(approverRole:any){
    this.muminDashboardSr.getApproverDetails(this.id, approverRole)
     .pipe(takeUntil(this.destroy$))
     .subscribe((data) => {
      if(data.data==null){
          this.toastrservice.error(this.commonservices.toTitleCase(data.errorMessage));
      }else{
        let contactDetails = data.data;
        const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
          data: {contact:true,contactDetails:contactDetails,record: event,buttonClose:true},
        });
      }
     });
  }

  // ------------------
    /******************************************************************************
   *
   * @brief Get get Total Redeem Trophies from api
   * @param none
   * @return none
   *
   ******************************************************************************/
  getNiyat(niyatId: number): void {
     this.muminDashboardSr.getNiyat(niyatId)
     .pipe(takeUntil(this.destroy$))
     .subscribe((data) => {
       this.niyatInfoData = data;
       if(this.niyatInfoData && this.niyatInfoData.length>0){
        this.requestStatus = this.commitedValue = this.niyatInfoData[0].commitedValue;  
        if(this.niyatInfoData[0].questType=='RADIO' || this.niyatInfoData[0].questType=='CHECKBOX'){       
          if(this.niyatInfoData[0].commitedValue != null && (this.niyatInfoData[0].commitedValue.toLowerCase() == 'yes' || this.niyatInfoData[0].commitedValue=='1')){
            this.requestStatus = '1';
            this.commitedValue = 'Yes';
          }else if(this.niyatInfoData[0].commitedValue != null && (this.niyatInfoData[0].commitedValue.toLowerCase()=='no' || this.niyatInfoData[0].commitedValue=='2')){
            this.requestStatus = '2';
            this.commitedValue = 'No';
          }
        } 

        if(this.niyatInfoData[0].completedValue!=null){
          this.requestStatus = this.niyatInfoData[0].completedValue;
          if(this.requestStatus.toLowerCase()=='yes'){
            this.requestStatus = '1';
          }else if(this.requestStatus.toLowerCase()=='no'){
            this.requestStatus = '2';
          }
        }
        
        if(this.niyatInfoData[0].status==3){
          this.requestUpdate = false;
        }

        if(this.niyatInfoData[0].selfCompletedDate!=null && this.niyatInfoData[0].selfCompletedDate!='' ){
          this.pendingTime2 = this.timeDiffCalc(new Date(this.niyatInfoData[0].selfCompletedDate), new Date());
        }

        if(this.niyatInfoData[0].firstApprovalDate==null){
          this.pendingTime = this.pendingTime2;
        }else{       
          this.pendingTime = this.timeDiffCalc(new Date(this.niyatInfoData[0].selfCompletedDate), new Date(this.niyatInfoData[0].firstApprovalDate));
        }

        if(this.niyatInfoData[0].secondApprovalDate!=null){
          this.pendingTime2 = this.timeDiffCalc(new Date(this.niyatInfoData[0].selfCompletedDate), new Date(this.niyatInfoData[0].secondApprovalDate));
        }

        if(this.niyatInfoData[0].niyatType == 'SELF TIMEBOUND' || this.niyatInfoData[0].niyatType == 'AAMIL and TIMEBOUND'){
          this.daysleft = this.niyatInfoData[0].days <= 0 ? false : true;
        }
      }
      this.niyatProfileLoading.next(this.niyatInfoData);
    });
  }

   /******************************************************************************
   *
   * @brief Get get Total time diffrence between two dates
   * @param dateFuture
   * @param dateNow
   * @return none
   *
   ******************************************************************************/
  timeDiffCalc(dateFuture:any, dateNow:any) {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;

    let difference = '';
    if (days > 0) {
      difference += (days === 1) ? `${days} day, ` : `${days} days, `;
    }

    if(hours>0) {
    difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;
    }

    difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`; 

    return difference;
  }

  niyatApproval(id:any, userRole:string){
    const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
      data: { 
        heading: 'Confirmation', 
        name: 'Are you sure you want to approve this niyat?', 
        buttonSubmit: 'Confirm', 
        buttonCancel: 'Cancel', 
        record: true 
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let itsId=Number(this.localService.get('itsId'))
        this.muminDashboardSr.approveNiyatByNID(id, userRole,itsId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
            if(res == null){
              this.toastrservice.error(this.commonservices.toTitleCase(res.errorMessage));
            }else{
              this.toastrservice.success(this.commonservices.toTitleCase(res.message));
              this.router.navigate(['./admin/niyat-approve/list']);
            }
        })
      }
    });
  }

  getReward(approveNityat:any,approve2:any,approve3:any){
    const rewardsArray=[]
    if(approveNityat){
      rewardsArray.push(approveNityat)
    }
    if(approve2){
      rewardsArray.push(approve2)
    }
    if(approve3){
      rewardsArray.push(approve3)
    }
    const requestData ={
      niyatId:this.id,
      roleName: rewardsArray
    }

    this.muminDashboardSr.getApprover(requestData).then((data)=>{
          {
            const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
              data: { buttonClose:true, getReward:'reward' ,approverName:data ,niyatId:this.id,niyatIdParamms:this.niyatParamId,niyatInfo:this.niyatInfoData,approve1:approveNityat,approve2:approve2,approve3:approve3},
            });
          }
    })
  
  }


  /******************************************************************************
   *
   * @brief view revert niyat form
   * @param any id
   * @param any userRole
   * @return none
   *
   ******************************************************************************/
   viewRevertNiyat(id:any, userRole:string){
    const confirmDialogRef = this.dialog.open(SmartDialogDeleteComponent, {
      data: { 
        heading: 'Confirmation', 
        name: 'Are you sure you want to revert this niyat?', 
        buttonSubmit: 'Confirm', 
        buttonCancel: 'Cancel', 
        record: true 
      },
    });

    confirmDialogRef.afterClosed().subscribe(confirmResult => {
      if (confirmResult) {
        const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
          data: { form1:'revertForm',buttonClose:true, heading:'Details' , revertForm:'yes'},
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if(result != undefined && result.remarks != ""){
            result['roleName'] = this.userRole;
            this.muminDashboardSr.sendNiyatRevertRemarks(result, this.userRole, this.id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
              this.spinner.hide();
              this.toastrservice.success(this.commonservices.toTitleCase(res.message));
              this.router.navigate(['./admin/dashboard']);
            }, (err) => {
              this.spinner.hide();
            })
            //console.log('ressssssssss',result,'iddddd',this.id)
          }
        });
      }
    });
  }


  /******************************************************************************
   *
   * @brief view rejection niyat form
   * @param any Title
   * @param any trophy
   * @return none
   *
   ******************************************************************************/
   viewRejectionNiyat(){
    {
      
    const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
        data: { buttonClose:true, heading:'Details' , rejectForm:'yes'},
      });
  
    }
  }

  isAlternateApprover(role: any): boolean {
    if (!role) return false;
    const normalizedRole = role.toString().toLowerCase().trim();
    return this.alternateApproverRoles.some(alt => alt.toLowerCase().trim() === normalizedRole);
  }

  shouldShowApproverRow(approverRole: any): boolean {
    if (!approverRole) return false;
    if (!this.isAlternateApprover(approverRole)) return true;
    
    // For alternate roles:
    if (this.userRole === 'Mumin') return true;
    
    // If the logged in user is an alternate approver themself
    if (this.isAlternateApprover(this.userRole)) {
      return this.userRole.toLowerCase().trim() === approverRole.toLowerCase().trim();
    }
    
    // For other roles (like Masool), show the alternate paths
    return true;
  }

  isSelf(approverRole: any): boolean {
    if (!this.userRole || !approverRole) return false;
    return this.userRole.toString().toLowerCase().trim() === approverRole.toString().toLowerCase().trim();
  }

  getAlternateApproverNames(niyatInfo: any): string {
    if (!niyatInfo) return '';
    const approvers = [niyatInfo.approver1, niyatInfo.approver2, niyatInfo.approver3];
    const alternates = approvers
      .filter(a => this.isAlternateApprover(a))
      .map(a => this.getApproverDisplayName(a));
    
    // Remove duplicates
    const uniqueAlternates = [...new Set(alternates)];
    
    return uniqueAlternates.join(' / ');
  }

  getApproverDisplayName(role: any): string {
    if (!role) return '';
    if (role === 'Aamil') return 'Aamil Saheb';
    if (role === 'Muavin Aamil') return 'Muawin Aamil Saheb';
    if (role === 'Dept Head') return 'Department Head';
    if (role === 'Umoor Head') return 'Umoor Head';
    return role;
  }


}
