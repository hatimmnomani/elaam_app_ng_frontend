import { DatePipe } from "@angular/common";
import { LocalStorageService } from "./../../../../../auth/service/storage/localstorage.service";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";
import { SmartDialogDeleteComponent } from "src/app/shared/componets/smart-dialog/smart-dialog-delete.component";
import { NotificationService } from "../../services/notification.service";
import { takeUntil } from "rxjs/operators";
import * as moment from "moment";
import { SharedataService } from "src/app/shared/services/sharedata.service";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.scss"],
})
export class NotificationComponent implements OnInit {
  query: string ;

  searchByIts(event:any){
    
      this.query = event.target.value
  }

  columnsHeader = [
    {
      columnDef: "message",
      header: "Message",
      dataName: (row: any) => `${row.message.replace(/[<>]/g, '') || "-"}`,
    },
    {
      columnDef: "fromItsId",
      header: "From Its Id",
      dataName: (row: any) => `${row.fromItsId || "-"}`,
    },
    {
      columnDef: "fromName",
      header: "Sender Name",
      dataName: (row: any) => `${row.fromName || "-"}`,
    },
    {
      columnDef: "date",
      header: "Notification Received",
      dataName: (row: any) => `${this.getTime(row.duration) || "-"}`,
    },
    {
      columnDef: "notification",
      header: "Status",
      dataName: (row: any) => `${row.read}`,
    },
    {
      columnDef: "action",
      header: "Action",
      dataName: (row: any) => `${row.action}`,
    },
  ];

  private destroy$ = new Subject();
  notification = new BehaviorSubject<any>("");
  notification$ = this.notification.asObservable();

  constructor(
    private dialog: MatDialog,
    private datepipe: DatePipe,
    private sharedata: SharedataService,
    private localstorage: LocalStorageService,
    public notificationservice: NotificationService
  ) {}

  ngOnInit(): void {
    this.query =""
  }

  /******************************************************************************
   *
   * @brief Notification form popup
   * @param string event
   * @return none
   *
   ******************************************************************************/
  notify(message:string){
    {
      const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
        data: { buttonCancel:'Cancel', heading: 'Message', name: message, record: event  },
      });
    }
  }

  /******************************************************************************
   *
   * @brief fetch record data
   * @param string event
   * @return none
   *
  ******************************************************************************/

  fetchedRecord(event: any) {
    if (event.centerFocus) {
      this.getReadNotification(event.centerFocus.id);
      this.notify(event.centerFocus.message.replace(/[<>]/g, ''))    
    }
  }

  /******************************************************************************
   *
   * @brief Read Notification
   * @param none
   * @return none
   *
  ******************************************************************************/
  getReadNotification(notificationId: any) {
    // this.notificationservice
    //   .getReadNotification(notificationId)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data) => {
    //     this.sharedata.changeMessage("reload-notification")
    //     this.getNotification();
    //   });
  }

  /******************************************************************************
   *
   * @brief Get Notification
   * @param none
   * @return none
   *
  ******************************************************************************/
  getNotification(): void {
    const data: any = this.localstorage.get("itsId");
    const itsId: any = JSON.parse(data);
      // this.notificationservice
      //   .getNotification(itsId)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe((data) => {
      //     this.notification.next(data);
      // });
  }

  /******************************************************************************
  *
  * @brief Get Time Format
  * @param time
  * @return none
  *
  ******************************************************************************/
  getTime(seconds: any) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    
    var dDisplay = d > 0 ? d + (d == 1 ? " day ago " : " days ago ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour ago" : " hours ago ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute ago" : " minutes ago ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second ago" : " seconds ago") : "";

    // return dDisplay + hDisplay + mDisplay + sDisplay;
    return (d > 0) ? dDisplay : (h > 0) ? hDisplay : (m > 0) ? mDisplay : sDisplay; 
  }

}
