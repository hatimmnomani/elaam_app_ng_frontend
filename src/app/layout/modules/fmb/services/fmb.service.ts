import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/auth/service/storage/localstorage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FMBService {


  constructor(
    private http: HttpClient,
    private localService: LocalStorageService
  ) {}

  /******************************************************************************
   *
   * @brief Get All Niyat List request
   * @param any
   * @return Observable<any>
   *
  ******************************************************************************/
  
  getActiveChangeList(event: any, name: string, id: number, urlname: string, status:number= 4,search:string=''): Observable<any> {
    let params = new HttpParams();
    params = params.append("startDate", event.startDate);
    params = params.append("endDate", event.endDate);
    params = params.append("id", id);
    params = params.append("search", search);

    if(name !== 'nolabel') {
      params = params.append("name", name);
    }

    if (status !== 4) {
      params = params.append("status", status);
    }


    return this.http
      .get<any>(`${environment.serverUrl}/api/` + urlname, {
        params: params,
      })
      .pipe(
        map((data: any) => {
          if (data) {
            return data.data;
          }
          return [];
        })
        // catchError(err => of([]))
      );
  }

    /******************************************************************************
   *
   * @brief Get All Niyat List request
   * @param any
   * @return Observable<any>
   *
  ******************************************************************************/
  
     postActiveChangeList(event: any, name: string, id: number, urlname: string, status:number= 4,search:string='',jamiatId:any=''): Observable<any> {
      const body = {
        "startDate" :event.startDate,
        "endDate":event.endDate,
        "departmentId":id,
        "search":search,
        "status":(status!==4)?status:'',
        "name":(name !== 'nolabel')?name:'',
        "jamiatId":jamiatId,
      }
  
      return this.http
        .post<any>(`${environment.serverUrl}/api/` + urlname,body)
        .pipe(
          map((data: any) => {
            if (data) {
              return data.data;
            }
            return [];
          })
          // catchError(err => of([]))
        );
    }

  /******************************************************************************
   *
   * @brief Get Niyat Status post request
   * @param any
   * @return Observable<any>
   *
   ******************************************************************************/
  getNiyatStatus(event: any,urlname: string="getNiyatStatus",departmentId:number=0): Observable<any> {
    let params = new HttpParams();
    params = params.append("startDate", event.startDate);
    params = params.append("endDate", event.endDate);
    if(this.localService.get('JamaatId') != undefined){
      params = params.append("id",this.localService.get('JamaatId')!);  
    }

    if(departmentId>0){
      params = params.append("departmentId", departmentId);
      }

    return this.http
      .get<any>(`${environment.serverUrl}/api/` + urlname, {
        params: params,
      })
      .pipe(
        map((data: any) => {
          if (data) {
            return this.setNiyatStatus(data.data);
          }
          return null;
        })
        // catchError(err => of([]))
      );
  }

  /******************************************************************************
   *
   * @brief Set Niyat Status
   * @param any res
   * @return any
   *
   ******************************************************************************/
  setNiyatStatus(res: any): any {
    const result = [
      {
        id: 4,
        name: "total niyats",
        value: res.totalNiyat === undefined ? "0" : res.totalNiyat,
      },

      {
        id: 1,
        name: "active",
        value: res.active === undefined ? "0" : res.active,
      },

      {
        id: 2,
        name: "approval pending",
        value: res.approvalPending === undefined ? "0" : res.approvalPending,
      },

      {
        id: 3,
        name: "completed",
        value: res.completed === undefined ? "0" : res.completed,
      },
       {
        id: 0,
        name: "deactivated",
        value: res.deactivated === undefined ? "0" : res.deactivated,
      },
    ];
    return result;
  }

  /******************************************************************************
   *
   * @brief Get Active NiyatList
   * @param any
   * @return Observable<any>
   *
   ******************************************************************************/
  getListData(urlname: string,event: any,departmentId:number, status: number, search: string, id:any): Observable<any> {
    let params = new HttpParams();
    params = params.append("startDate", event.startDate);
    params = params.append("endDate", event.endDate);
    if(id != null){
      params = params.append("id", id);  
    }

    if(departmentId>0){
    params = params.append("departmentId", departmentId);
    }  
    if (status !== 4) {
      params = params.append("status", status);
    }
    params = params.append("search", search);

    return this.http
      .get<any>(`${environment.serverUrl}/api/` + urlname, { params: params })
      .pipe(
        map((data: any) => {
          if (data) {
            return data.data;
          }
          return [];
        })
      );
  }

  /******************************************************************************
   *
   * @brief Get Data Chart
   * @param any
   * @return Observable<any>
   *
   ******************************************************************************/
  getDataChart(urlname: string,event: any, status: number, departmentId:number=0, id:any): Observable<any> {
    let params = new HttpParams();
    params = params.append("endDate", event.endDate);
    params = params.append("startDate", event.startDate);
    if(departmentId>0){
      params = params.append("departmentId", departmentId);
      }
    if(id != null){
      params = params.append("id", id);  
    }

    if (status !== 4) {
      params = params.append("status", status);
    }

    return this.http
      .get<any>(`${environment.serverUrl}/api/` + urlname, { params: params })
      .pipe(
        map((data: any) => {
          if (data) {
            return data.data;
          }
          return [];
        })
      );
  }

}
