import { DatePipe } from "@angular/common";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  SimpleChanges
} from "@angular/core";
import { Workbook } from "exceljs";
import * as fs from "file-saver";
import * as json2csv from "json2csv";
import { Observable, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-download-files-button",
  templateUrl: "./download-files-button.component.html",
  styleUrls: ["./download-files-button.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
 export class DownloadFilesButtonComponent implements OnInit {

  @Input() getHeader: any;

  @Input() getTitle: any;

  @Input() getFileName: any;

  @Input() getTableId: any;

  @Input() downloadtitle: any;

  @Output() sendData = new EventEmitter<boolean>();

  @Input() showIcon: boolean = false;

  @Input() buttonText = "Sessions";

  fileType: any;

  @Input() showXLS: boolean = true;
  @Input() showCSV: boolean = true;

  imgPath:string = '';
  getData: any;
  @Input("dataList") dataList!: Observable<any[]>;
  private eventsSubscription!: Subscription;
  private destroy$ = new Subject();
  constructor() {}

   ngOnInit(): void {
    this.getDownloadData()
  }

  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

  /******************************************************************************
   *
   * @brief dataList list 
   * @param none
   * return none
   *
   ******************************************************************************/

  getDownloadData() {
    if (this.dataList !== undefined) {
      this.eventsSubscription = this.dataList.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        this.getData = data;
        if (this.fileType === 'csv' && data) {
          this.downloadCSV()
        }
        else if (this.fileType === 'xls' && data) {
          this.downloadXLS()
        }
      });
    }
  }


   /******************************************************************************
   *
   * @brief Common Function for download files
   * @param string type
   * @return none
   *
   ******************************************************************************/
   downloadFile(type:any): void {
     this.fileType = type;
     this.sendData.emit(type);
   }


   /******************************************************************************
   *
   * @brief Funtion for download the CSV/XLS file
   * @param none
   * @return none
   *
   ******************************************************************************/
   downloadCSV(): void {
    if (this.getData.length > 0) {
      const Mainobject:any = [];
       for (const [key, value] of Object.entries(this.getData)) {
        const header =this.getHeader[0];
        const Dataobject:any = {};
        let incremnt:number = 0;
        let dataValue:any = value; 
        for (const [vkey, vvalue] of Object.entries(dataValue)) {
          if (
            (vvalue != undefined || vvalue != null) &&
            typeof vvalue === "string"
          ) {
            Dataobject[header[incremnt]] =
              vvalue;
          } else {
            Dataobject[header[incremnt]] = vvalue;
          }
          incremnt=incremnt+1;

        }
        Mainobject[key] = Dataobject;
      }
      const csv = json2csv.parse(Mainobject);
      let blob = new Blob([csv], { type: "text/csv" });
      fs.saveAs(blob, this.getFileName + "." + this.fileType);
    }
  }



   /******************************************************************************
   *
   * @brief Funtion for download the CSV/XLS file
   * @param none
   * @return none
   *
   ******************************************************************************/
   downloadXLS(): void {
    //Excel Title, Header, Data
    const headerData: any[] = (this.getHeader && this.getHeader[0]) ? this.getHeader[0] : []; 
    const header = headerData.map(
      a => a.charAt(0).toUpperCase() + a.slice(1)
    );
    const data:any[] = [];
    const result:any[] = this.getData.map(Object.values);
    result.map(v => {
      let vData : any[] = v;
      let tarr = vData.map(f => {
        if ((f != undefined || f != null) && typeof f === "string") {
          return f;
        } else {
          return f;
        }
      });
      data.push(tarr);
    });
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(this.getTitle);
    // Add Row and Header formatting
    const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {});
    data.forEach(d => {
      const row = worksheet.addRow(d);
    });
    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      fs.saveAs(blob, this.getFileName + "." + this.fileType);
    });
  }
 }
