import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/auth/service/storage/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private http: HttpClient,
    private localService: LocalStorageService,
  ) { }
  /******************************************************************************
  *
  * @brief Fetch  Get All Question Data
  * @param none
  * @return Observable
  *
  ******************************************************************************/
  getQuestionList(): Observable<any> {
    return this.http
      .get<any>(`${environment.serverUrl}/api/get-all-niyat-question`, {})
      .pipe(
        map((data: any) => {
          if (data.error) { return data }
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
  * @brief Fetch  Get All Report Data
  * @param reportKey report name for which report needs to fetch
  * @param search search term
  * @param startDate start date range
  * @param endDate end date range
  * @param status for which status report need to fetch
  * @return Observable
  *
  ******************************************************************************/
  getAllReport(body: any): Observable<any> {
    if (this.localService.get('JamaatId') != undefined && !body.jamaatId) {
      Object.assign(body, { jamaatId: JSON.parse(this.localService.get('JamaatId')!) });
    } else if (this.localService.get('JamiatId') != undefined && !body.jamiatId) {
      Object.assign(body, { jamiatId: JSON.parse(this.localService.get('JamiatId')!) });
    } else if (this.localService.get('DepartmentId') != undefined && !body.departmentId) {
      Object.assign(body, { departmentId: JSON.parse(this.localService.get('DepartmentId')!) });
    }

    if (this.localService.get('UmoorId') != undefined && !body.umoorId) {
      Object.assign(body, { umoorId: JSON.parse(this.localService.get('UmoorId')!) });
    }
    body['search'] = body['searchValue'];

    return this.http
      .post<any>(`${environment.serverUrl}/api/getAllreports`, body)
      .pipe(
        map((data: any) => {
          if (data.error) { return data }
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
  * @brief Fetch  Get All Report Data
  * @param reportKey report name for which report needs to fetch
  * @param search search term
  * @param startDate start date range
  * @param endDate end date range
  * @param status for which status report need to fetch
  * @return Observable
  *
  ******************************************************************************/
  getAllDropDown(body: any): Observable<any> {
    const bodyCopy = { ...body };
    if (this.localService.get('JamaatId') != undefined && !bodyCopy.jamaatId) {
      Object.assign(bodyCopy, { jamaatId: JSON.parse(this.localService.get('JamaatId')!) });
    } else if (this.localService.get('JamiatId') != undefined && !bodyCopy.jamiatId) {
      Object.assign(bodyCopy, { jamiatId: JSON.parse(this.localService.get('JamiatId')!) });
    } else if (this.localService.get('DepartmentId') != undefined && !bodyCopy.departmentId) {
      Object.assign(bodyCopy, { departmentId: JSON.parse(this.localService.get('DepartmentId')!) });
    }

    if (this.localService.get('UmoorId') != undefined && !bodyCopy.umoorId) {
      Object.assign(bodyCopy, { umoorId: JSON.parse(this.localService.get('UmoorId')!) });
    }

    return this.http
      .post<any>(`${environment.serverUrl}/api/getDropDownData`, bodyCopy)
      .pipe(
        map((data: any) => {
          if (data.error) { return data }
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
* @brief Fetch  Get  Report Data List
* @param any page and pageSize
* @return Observable
*
******************************************************************************/
  getList(body: any): Observable<any> {
    if (this.localService.get('JamaatId') != undefined && !body.jamaatId) {
      Object.assign(body, { jamaatId: JSON.parse(this.localService.get('JamaatId')!) });
    } else if (this.localService.get('JamiatId') != undefined && !body.jamiatId) {
      Object.assign(body, { jamiatId: JSON.parse(this.localService.get('JamiatId')!) });
    } else if (this.localService.get('DepartmentId') != undefined && !body.departmentId) {
      Object.assign(body, { departmentId: JSON.parse(this.localService.get('DepartmentId')!) });
    }

    if (this.localService.get('UmoorId') != undefined && !body.umoorId) {
      Object.assign(body, { umoorId: JSON.parse(this.localService.get('UmoorId')!) });
    }
    if(body.status === -1){
      body.status = null;
    }

    body["search"] = body["searchValue"];
    let endPoint = (body.reportKey === "Approver Details") ? "v2/approverDetailsReport" : "report";
      return this.http.post<any>(`${environment.serverUrl}/api/${endPoint}`, body).pipe(
        map(data => {
            if (data.data) {
              const result = this.filteredData(data.data);
              return result;
            }
            return [];
          }
        ),
        catchError(() => of({ list: [], totalSize: 0 }))
      );
    // }
  }

  /******************************************************************************
  *
  * @brief Fetch Approver Details Data List
  * @param any page and pageSize
  * @return Observable
  *
  ******************************************************************************/
  fetchApproverDetailsReport(body: any): Observable<any> {
    return this.http
      .post<any>(`${environment.serverUrl}/api/v2/approverDetailsReport`, body)
      .pipe(
        map((data: any) => {
          if (data.error) { return data }
          if (data != null) {
            return data.data;
          }
          return null;
        }),
        catchError(err => of([]))
      )
  }

  filteredData(data: any) {
    const result = {
      list: data.reportData,
      totalSize: data.pagination.totalRecords
    };
    return result;
  }
  /******************************************************************************
    dynamic report
   ******************************************************************************/
  sendRequestData(body: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http
      .post<any>(`${environment.serverUrl}/api/generateReport`, body,{headers})
      .pipe(
        map((data: any) => {
          if (data.error) { return data }
          if (data != null) {
            return data;
          }
          return null;
        }),
        catchError(err => of([]))
      )
  }
  /******************************************************************************
   get Jammat data by jamiat id for dynamic report
  ******************************************************************************/
  filerJamaatByJamiat(ids: any): Observable<any> {
    return this.http
      .post<any>(`${environment.serverUrl}/api/getJamaatByJamiatIds`, ids)
      .pipe(
        map((data: any) => {
          if (data.error) { return data }
          if (data != null) {
            return data.data;
          }
          return null;
        }),)
  }
  /******************************************************************************
   get All Jamiat data for Jamiat droppdown
  ******************************************************************************/
  getAllJamiatList(): Observable<any> {
    return this.http
      .get<any>(`${environment.serverUrl}/api/getAllJamiat`)
      .pipe(
        map((data: any) => {
          if (data.error) { return data }
          if (data != null) {
            return data.data;
          }
          return null;
        }),)
  }

  getAllJamaatList(): Observable<any> {
    return this.http
      .get<any>(`${environment.serverUrl}/api/getAllJamaat`)
      .pipe(
        map((data: any) => {
          if (data.error) { return data }
          if (data != null) {
            return data.data;
          }
          return null;
        }),)
  }
}
