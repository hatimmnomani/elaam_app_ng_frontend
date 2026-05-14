import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';
import { LocalStorageService } from 'src/app/auth/service/storage/localstorage.service';

@Injectable({
  providedIn: 'root'
})

export class NiyatDataService {
  userrole: any;

  constructor(
    private http: HttpClient,
    private localService: LocalStorageService,
  ) {
    const data: any = this.localService.get("role");
    this.userrole = JSON.parse(data);
  }
  /******************************************************************************
 *
 * @brief Fetch  Get  Niyat Data List
 * @param any page and pageSize
 * @return Observable
 *
 ******************************************************************************/
  getList(data: any): Observable<any> {
    const data1: any = this.localService.get("role");
    this.userrole = JSON.parse(data1)
    let api: any = "";
    let dataObj={};
    if (data?.isApproved) {
      dataObj={
        pageSize: data?.pageSize,
        pgNo: data?.pageNo,
        searchValue:data?.searchValue ,
        search:data?.search ,
        uId:this.userrole==="Umoor Coordinator"?this.localService.get("UmoorId"):0,
        jId:this.userrole==="Aamil" || this.userrole === "Muavin Aamil"?this.localService.get("JamaatId"):0,
      }
      api = "/api/pendingApprovals/"+ data?. itsId;
    } else {
      dataObj=data;
      api = data?.download === false && (this.userrole == 'Super Admin' || this.userrole == 'Data Entry Operator') ? '/api/getListOfScannedNiyats' : this.userrole == 'Super Admin' || this.userrole == 'Template Creator' || this.userrole == 'Data Entry Operator' ? '/api/getListOfNiyat' : this.userrole == 'Mumin' ? '/api/getAllNiyatListV2' : '/api/getListOfNiyatListForApprover';
    }

    return this.http
      .get<any>(`${environment.serverUrl}` + api, { params: dataObj })
      .pipe(
        map(res => {
          if (res.data) {
            let result: any;
            if(data?.isApproved){
            let obj= {
                list:res.data?.list,
                totalSize:res.data?.count 
              }
              result=obj;

            }else{
             result = this.filteredData(res.data, data?.scanned === true ? data?.scanned : data?.download);
              if (data?.download === false) {
                result['niyatTotalCount'] = res?.message
              }
            }
            return result;
          }
          return [];
        }),
        catchError(err => of("error", err))
      );
  }


  filteredData(data: any, istrue: any) {
    const result = {
      list: istrue === false || istrue === true ? data?.content : data?.niyatData,
      totalSize: istrue === false || istrue === true ? data?.totalElements : data?.pagination?.totalRecords
    };
    return result;
  }


  /******************************************************************************
  *
  * @brief Add niyat data post request
  * @param any question
  * @return Observable<any>
  *
  ******************************************************************************/
  addNiyatData(question: any, file: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'multipart/form-data');
    headers = headers.append('enctype', 'multipart/form-data');

    const formData = new FormData();
    for (let i = 0; i < file?.length; i++) {
      if (i == 0) {
        formData.append('file', file[i]);
      } else {
        formData.append('file2', file[i]);
      }
    }

    formData.append('niyat', JSON.stringify(question));

    return this.http
      .post<any>(`${environment.serverUrl}/api/addNiyat`, formData)
      .pipe(
        map((data: any) => {

          if (data != null) {
            return data;
          }
          return null;
        }),
        // catchError(err => of([]))
      )
  }

  /******************************************************************************
*
* @brief Add Scanned niyat data post request
* @param any question
* @return Observable<any>
*
******************************************************************************/
  addScanNiyat(question: any, file: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'multipart/form-data');
    headers = headers.append('enctype', 'multipart/form-data');

    const formData = new FormData();
    formData.append('niyat', JSON.stringify(question));

    return this.http
      .post<any>(`${environment.serverUrl}/api/addScannedNiyat`, formData)
      .pipe(
        map((data: any) => {

          if (data != null) {
            return data;
          }
          return null;
        }),
        // catchError(err => of([]))
      )
  }
  /******************************************************************************
  *
  * @brief Edit data post request
  * @param any niyatId
  * @param any question
  * @return Observable<any>
  *
  ******************************************************************************/
  editNiyatData(questionId: any, question: any, file: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'multipart/form-data');
    headers = headers.append('enctype', 'multipart/form-data');
    const formData = new FormData();
    for (let i = 0; i < file?.length; i++) {
      if (i == 0) {
        if (typeof file[0] != 'string') {
          formData.append('file', file[i]);
        }

      } else {
        if (typeof file[1] != 'string') {
          formData.append('file2', file[i]);
        }
      }
    }
    formData.append('niyat', JSON.stringify(question));

    return this.http
      .put<any>(`${environment.serverUrl}/api/updateNiyat/` + questionId, formData)
      .pipe(
        map((data: any) => {

          if (data != null) {
            return data;
          }
          return null;
        })
      )
  }

  /******************************************************************************
  *
  * @brief Fetch Niyat By ID
  * @param any id
  * @return Observable<any>
  *
  ******************************************************************************/
  getNiyatByID(id: any): Observable<any> {
    let splitParams = id.split('-', 2);
    let params = new HttpParams();
    params = params.append("templateId", splitParams[0]);
    params = params.append("itsId", splitParams[1]);
    return this.http
      .get<any>(`${environment.serverUrl}/api/getNiyatByItsId`, { params: params })
      .pipe(
        map((data: any) => {

          if (data != null) {
            return data.data;
          }
          return null;
        }),
        catchError(err => of([]))
      )
  }
  
    /******************************************************************************
  *
  * @brief Fetch Niyat Scanned By ID
  * @param any id
  * @return Observable<any>
  *
  ******************************************************************************/
    getNiyatScannedByID(id: any): Observable<any> {
      let splitParams =  id.split('-',2);  
      let params = new HttpParams();  
      params = params.append("templateId",splitParams[0]);
      params = params.append("itsId",splitParams[1]);
      return this.http
        .get<any>(`${environment.serverUrl}/api/getScannedNiyat/`+splitParams[0]+'/'+splitParams[1])
        .pipe(
          map((data: any) => {
            
            if (data != null) {
              return data.data;
            }
            return null;
          }),
          catchError(err => of([]))
        )
    }


  

  /******************************************************************************
  *
  * @brief Fetch  Validate TsId
  * @param any id
  * @return Observable
  *
  ******************************************************************************/
  getValidITSId(tsId: any): Observable<any> {
    return this.http
      .get<any>(`${environment.serverUrl}/api/validatItsId/` + tsId, {})
      .pipe(
        map((data: any) => {
          if (data.error) { return data }
          if (data != null) {
            return data.data
          }
        }), catchError(err => of([]))
      )
  }
  /******************************************************************************
   *
   * @brief Fetch  Validate TsId
   * @param any id
   * @return Observable
   *
   ******************************************************************************/
  getValidITSIdForMumin(tsId: any): Observable<any> {
    return this.http
      .get<any>(`${environment.serverUrl}/api/validateItsIdForMumin/` + tsId, {})
      .pipe(
        map((data: any) => {
          if (data.error) { return data }
          if (data != null) {
            return data.data
          }
        }), catchError(err => of([]))
      )
  }
  /******************************************************************************
  *
  * @brief Fetch Template By ID
  * @param any id
  * @return Observable<any>
  *
  ******************************************************************************/
  getTemplateByID(id: any): Observable<any> {
    return this.http
      .get<any>(`${environment.serverUrl}/api/getTemplateById/${id}`, {})
      .pipe(
        map((data: any) => {

          if (data != null) {
            return data.data;
          }
          return null;
        }),
        catchError(err => of([]))
      )
  }
  /******************************************************************************
*
* @brief Fetch Is Munin Template By ID
* @param any id
* @return Observable<any>
*
******************************************************************************/
  getTemplateIsmuminByID(id: any): Observable<any> {
    let splitParams = id?.split('-', 2);
    let params = new HttpParams();
    if (splitParams[1] !== undefined) {
      params = params.append("isMumin", splitParams[1]);
    }
    return this.http
      .get<any>(`${environment.serverUrl}/api/getTemplateById/${splitParams[0]}`, { params: params })
      .pipe(
        map((data: any) => {

          if (data != null) {
            return data.data;
          }
          return null;
        }),
        catchError(err => of([]))
      )
  }


  /******************************************************************************
*
* @brief Upload Excel File request
* @param any file
* @return Observable<any>
*
******************************************************************************/
  uploadExcel(file: any): Observable<any> {
    const options = {} as any; // Set any options you like
    const header = {
      'Content-Type': 'multipart/form-data',
      'boundary': '----WebKitFormBoundary2VXDhMTLUU6KDBf0'
    }

    return this.http
      .post<any>(`${environment.serverUrl}/api/niyat/upload`, file, options)
      .pipe(
        map((data: any) => {

          if (data != null) {
            return data;
          }
          return null;
        }),
        // catchError(err => of([]))
      )
  }

  /******************************************************************************
  *
  * @brief Fetch Niyat By ID
  * @param any id
  * @return Observable<any>
  *
  ******************************************************************************/
  getScanedNiyatTemplates(startDate: any, endDate: any): Observable<any> {

    let params = new HttpParams();
    params = params.append("startDate", startDate);
    params = params.append("endDate", endDate);
    return this.http
      .get<any>(`${environment.serverUrl}/api/getTemplatesForScannedNiyats`, { params: params })
      .pipe(
        map((data: any) => {

          if (data != null) {
            return data.data;
          }
          return null;
        }),
        catchError(err => of([]))
      )
  }  
  

}
