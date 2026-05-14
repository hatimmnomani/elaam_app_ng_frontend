import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NiyatQuestionService } from '../services/niyat-question.service';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';
import {FormControl} from '@angular/forms';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SmartDialogDeleteComponent } from 'src/app/shared/componets/smart-dialog/smart-dialog-delete.component';
import { CommonService } from '../../dashboard/service/common.service';

@Component({
  selector: 'app-niyat-question-list',
  templateUrl: './niyat-question-list.component.html',
  styleUrls: ['./niyat-question-list.component.scss']
})
export class NiyatQuestionListComponent implements OnInit {
  querymeter: string = "";
  
  columnsHeader = [
    {
      columnDef: "Question",
      header: "Question",
      dataName: (row: any) => `${row.question_eng || row.questionenglish || "-"}`,
    },
    {
      columnDef: "umoor",
      header: "umoor",
      dataName: (row: any) => `${row.umoor_name || "-"}`,
    },
    {
      columnDef: "department",
      header: "department",
      dataName: (row: any) => `${row.department_name || "-"}`,
    },
    {
      columnDef: "action",
      header: "Action",
      dataName: (row: any) => `${row.status}`,
    },
  ];

  private destroy$ = new Subject();
  filteredList : any = [];
  searchList: any = []

  constructor(
    private toastrservice: ToastrService,
    private niyatquestionservice: NiyatQuestionService, 
    private changeDetection: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    public commonservices: CommonService
  ) { }

  ngOnInit(): void {
    this.getQuestionList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }
  

  /******************************************************************************
   *
   * @brief Get Question List
   * @param null
   * @return none
   *
   ******************************************************************************/
    getQuestionList(): void {
        this.niyatquestionservice.getQuestionList().pipe(takeUntil(this.destroy$)).subscribe((data) => {
          const filteredDataSource = data.map((item:any) => ({
              ...item,
              question_eng: item.question_eng.replace(/"/g, "'")
            }));
          this.filteredList = filteredDataSource; 
          this.searchList  = filteredDataSource.filter((value:any, index:any, self:any) => index === self.findIndex((t:any) => (t.question_eng === value.question_eng)))
          this.changeDetection.detectChanges();
        
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
    if(event[0].length != 0){
      this.filteredList = event
    }else{
      this.getQuestionList();
    }
  }

  /******************************************************************************
   *
   * @brief Call fetchedRecord
   * @param string event chargerUid  questionId
   * @return none
   *
   ******************************************************************************/

    fetchedRecord(event: any) { 
      if(event.statusRow) {
        // const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
        //   width: '450px',
        //   data: { name: 'Are you sure you want to delete this Question ?',heading:'',buttonSubmit:'Delete',buttonCancel:'Discard', record: event },
        // });
    
        // dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
          // if(result.statusRow) {
          this.niyatquestionservice
            .getStatusNiyatQuestion(event.statusRow.id)
            .pipe(takeUntil(this.destroy$)).subscribe(
              (res) => {
                this.toastrservice.success(this.commonservices.toTitleCase(res.message));
                this.getQuestionList();
              },
              (error) => {
                console.log(error);
              }
            );
          // }
        // });
      } 
      if(event.update) {
        let lId =  btoa(event.update.id);
        this.router.navigateByUrl(`/admin/niyat-question/edit/${lId}`);
      }
      if(event.clone) {
        const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
          width: '450px',
          data: { name: 'Are you sure you want to clone this Niyat Question ?', heading: '', buttonSubmit: 'Confirm', buttonCancel: 'Discard', record: event.clone },
        });
    
        dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
          if (result) {
            let lId = btoa(event.clone.id);
            this.router.navigateByUrl(`/admin/niyat-question/add?cloneId=${lId}`);
          }
        });
      }
    }
}
