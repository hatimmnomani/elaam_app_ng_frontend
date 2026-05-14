import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from "file-saver";

@Injectable()
export class DownloadXLSQuestionsService {
    getHeader:any = [];
    getTitle:any = 'Niyat Template';
    getFileName = 'Niyat-template';
    getData:any = [];
    addVal:any  = [];
    fileType:any = 'xls';
    
    constructor() { }

    /******************************************************************************
     *
     * @brief adjust column row value according to xls data 
     * @param data Array
     * @return none
     *
     ******************************************************************************/

    adjustHeader(data:any){
      const tmpHeader:any = [];
      const tmpHeader2:any = [];
      this.getData = [];
      this.getHeader = [];
      this.getFileName = data.templateName;

      tmpHeader.push("Template Id");
      tmpHeader.push(data.templateId+'');
      tmpHeader2.push("Template Name");
      tmpHeader2.push(data.templateName+'');

      this.getHeader.push(tmpHeader);
      this.getData.push(tmpHeader2);

      for (var key in data.niyatQuest) {
        if(data.val != undefined){
          this.addVal.push(data.niyatQuest[key].question_eng != null ? data.niyatQuest[key].question_eng : '-')
          this.addVal.push(data.niyatQuest[key].queslabel != null ? data.niyatQuest[key].queslabel : '-')
          this.addVal.push((data.niyatQuest[key].questionarabic != null ? data.niyatQuest[key].questionarabic : '-')+'')
        }else{
          this.addVal.push(data.niyatQuest[key].questionenglish != null ? data.niyatQuest[key].questionenglish : '-')
          this.addVal.push(data.niyatQuest[key].quesLabel != null ? data.niyatQuest[key].quesLabel : '-')
          this.addVal.push((data.niyatQuest[key].questionarabic != null ? data.niyatQuest[key].questionarabic : '-')+'')
        }
        this.getData.push(this.addVal);
        /* ****  after every etration always empty addVal array ***/ 
        this.addVal = [];  
      }
      /*** call downloadXLS() for download xls file  */
      this.downloadXLS();
    }


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
        fs.saveAs(blob, this.getFileName + "-Template" + "." + this.fileType);
      });
    }

}
