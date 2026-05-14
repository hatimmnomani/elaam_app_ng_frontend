import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { LocalStorageService } from '../../../../auth/service/storage/localstorage.service';


@Injectable({
  providedIn: "root",
})

export class DashboardService {
  pageSize: number = 5;
  pageNumber: number = 1;
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
  
  getActiveChangeList(event: any, name: string, urlname: string, status:number= 4,search:string='', jamaatId: number, jamiatId: number, umoorId: number, departmentId: number, niyatQuestId: number, pageNo: number, pageSize: number): Observable<any> {
    let body:any  = {
      "startDate": event.startDate,
      "endDate": event.endDate
    }
    const trimmed = (search || '').trim();
    if (trimmed.length > 0) {
      Object.assign(body, { search: trimmed });
    }else {
      if(name == 'NiyatList') {
        Object.assign(body, { search: '' });
      }else{
        Object.assign(body, { search: '%' });
      }
    }


    switch (name) {
      case 'Umoor':
        Object.assign(body, {jamaatId: jamaatId});
        Object.assign(body, {umoorId: umoorId});
        break;

      case 'nolabel':
        Object.assign(body, {jamiatId: jamiatId});
        break;

      case 'Department':
        Object.assign(body, {departmentId: departmentId});
        break;

      case 'niyatQuestion':
        Object.assign(body, {niyatQuestId: niyatQuestId});
        Object.assign(body, {jamaatId: jamaatId});
        Object.assign(body, {umoorId: umoorId});
        break;
      case 'Jamaat': 
        Object.assign(body, {jamiatId: jamiatId});
        Object.assign(body, {jamaatId: jamaatId});
        break;

      default:
        break;
    }
    
    if(name !== 'nolabel') {
      Object.assign(body, {name: name});
    }

    if(this.localService.get('JamaatId') != undefined){
      Object.assign(body, {jamaatId: JSON.parse(this.localService.get('JamaatId')!)});
    }else if(this.localService.get('JamiatId') != undefined) {
      Object.assign(body, {jamiatId: JSON.parse(this.localService.get('JamiatId')!)});
    }else if(this.localService.get('DepartmentId') != undefined) {
      Object.assign(body, {departmentId: JSON.parse(this.localService.get('DepartmentId')!)});
    }

    if(this.localService.get('UmoorId') != undefined) {
      Object.assign(body, {umoorId: JSON.parse(this.localService.get('UmoorId')!)});
    }




    if (status !== 4) {
      Object.assign(body, {status: status});
    }

    Object.assign(body, {pageNo: pageNo-1, pageSize: pageSize});
    if(urlname === 'getJamaatActiveNiyatList'){
      Object.assign(body, {pageNo: 0, pageSize: 2000});
    }



    return this.http
      .post<any>(`${environment.serverUrl}/api/` + urlname, body)
      .pipe(
        map((data: any) => {
          if (data && data.data) {
            return data; // Return the whole data object { content: [], totalElements: ... }
          }
          return { data: [], pagination: {totalRecords: 0 } };
        })
        // catchError(err => of([]))
      );
  }


  getNiyatList(event: any, name: string, urlname: string, status:number= 4,search:string='', jamaatId: number, jamiatId: number, umoorId: number, departmentId: number, niyatQuestId: number, pageNo: number, pageSize: number): Observable<any> {
    let body:any  = {
      "startDate": event.startDate,
      "endDate": event.endDate
    }
    const trimmed = (search || '').trim();
    if (trimmed.length > 0) {
      Object.assign(body, { search: trimmed });
    }else {
      if(name == 'NiyatList') {
        Object.assign(body, { search: '' });
      }else{
        Object.assign(body, { search: '%' });
      }
    }


    Object.assign(body, {jamaatId: jamaatId});
    Object.assign(body, {jamiatId: jamiatId});
    Object.assign(body, {departmentId: departmentId});
    Object.assign(body, {umoorId: umoorId});
    Object.assign(body, {niyatQuestId: niyatQuestId});

    if(this.localService.get('JamaatId') != undefined){
      Object.assign(body, {jamaatId: JSON.parse(this.localService.get('JamaatId')!)});
    }else if(this.localService.get('JamiatId') != undefined) {
      Object.assign(body, {jamiatId: JSON.parse(this.localService.get('JamiatId')!)});
    }else if(this.localService.get('DepartmentId') != undefined) {
      Object.assign(body, {departmentId: JSON.parse(this.localService.get('DepartmentId')!)});
    }
    if(this.localService.get('UmoorId') != undefined) {
      Object.assign(body, {umoorId: JSON.parse(this.localService.get('UmoorId')!)});
    }



    if (status !== 4) {
      Object.assign(body, {status: status});
    }

    Object.assign(body, {pageNo: pageNo-1, pageSize: pageSize});
    if(urlname === 'getJamaatActiveNiyatList'){
      Object.assign(body, {pageNo: 0, pageSize: 2000});
    }



    return this.http
      .post<any>(`${environment.serverUrl}/api/` + urlname, body)
      .pipe(
        map((data: any) => {
          if (data && data.data) {
            return data; // Return the whole data object { content: [], totalElements: ... }
          }
          return { data: [], pagination: {totalRecords: 0 } };
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
    let body = {
      "startDate": event.startDate,
      "endDate": event.endDate
    }

    if(this.localService.get('JamaatId') != undefined){
      Object.assign(body, {jamaatId: JSON.parse(this.localService.get('JamaatId')!)});
    } else if(this.localService.get('JamiatId') != undefined) {
      Object.assign(body, {jamiatId: JSON.parse(this.localService.get('JamiatId')!)});
    } else if(this.localService.get('DepartmentId') != undefined) {
      Object.assign(body, {departmentId: JSON.parse(this.localService.get('DepartmentId')!)});
    }
    
    if(this.localService.get('UmoorId') != undefined) {
        Object.assign(body, {umoorId: JSON.parse(this.localService.get('UmoorId')!)});
    }


    if(departmentId > 0){
      Object.assign(body, {departmentId: departmentId});
    }

    Object.assign(body, {pageNo: 0, pageSize: 1400});

    return this.http
      .post<any>(`${environment.serverUrl}/api/` + urlname, body)
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
    let body =  {
      "startDate": event.startDate,
      "endDate": event.endDate
    }
    if(id != null){
      Object.assign(body, {id: id});
    }

    if(this.localService.get('JamaatId') != undefined){
      Object.assign(body, {jamaatId: JSON.parse(this.localService.get('JamaatId')!)});
    } else if(this.localService.get('JamiatId') != undefined) {
      Object.assign(body, {jamiatId: JSON.parse(this.localService.get('JamiatId')!)});
    } else if(this.localService.get('DepartmentId') != undefined) {
      Object.assign(body, {departmentId: JSON.parse(this.localService.get('DepartmentId')!)});
    }
    
    if(this.localService.get('UmoorId') != undefined) {
      Object.assign(body, {umoorId: JSON.parse(this.localService.get('UmoorId')!)});
    }

    if(departmentId > 0){
      Object.assign(body, {departmentId: departmentId});
    }  
    if (status !== 4) {
      Object.assign(body, {status: status});
    }
    if(search){
      Object.assign(body, {search: search});
    }

    Object.assign(body, {pageNo: 1, pageSize: 2000});

    return this.http
      .post<any>(`${environment.serverUrl}/api/` + urlname, body)
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
   * @brief Get Active NiyatList
   * @param any
   * @return Observable<any>
   *
   ******************************************************************************/
  getPaginatedListData(urlname: string,event: any,departmentId:number, status: number, search: string, id:any, pageNo:number, pageSize:number): Observable<any> {
    let body =  {
      "startDate": event.startDate,
      "endDate": event.endDate
    }
    if(id != null){
      Object.assign(body, {id: id});
    }

    if(this.localService.get('JamaatId') != undefined){
      Object.assign(body, {jamaatId: JSON.parse(this.localService.get('JamaatId')!)});
    } else if(this.localService.get('JamiatId') != undefined) {
      Object.assign(body, {jamiatId: JSON.parse(this.localService.get('JamiatId')!)});
    } else if(this.localService.get('DepartmentId') != undefined) {
      Object.assign(body, {departmentId: JSON.parse(this.localService.get('DepartmentId')!)});
    }
    Object.assign(body, {pageNo: pageNo} );
    Object.assign(body, {pageSize: pageSize  } );

    if(this.localService.get('UmoorId') != undefined) {
      Object.assign(body, {umoorId: JSON.parse(this.localService.get('UmoorId')!)});
    }

    if(departmentId > 0){
      Object.assign(body, {departmentId: departmentId});
    }
    if (status !== 4) {
      Object.assign(body, {status: status});
    }
    if(search){
      Object.assign(body, {search: search});
    }

    // Use the caller-provided pagination only; do not override with internal defaults

    return this.http
      .post<any>(`${environment.serverUrl}/api/` + urlname, body)
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
    let body = {
      "endDate": event.endDate,
      "startDate": event.startDate
    }
    if(departmentId > 0){
      Object.assign(body, {departmentId: departmentId});
      }
    if(id != null){
      Object.assign(body, {id: JSON.parse(id)});
    }

    if(this.localService.get('JamaatId') != undefined){
      Object.assign(body, {jamaatId: JSON.parse(this.localService.get('JamaatId')!)});
    }else if(this.localService.get('JamiatId') != undefined) {
      Object.assign(body, {jamiatId: JSON.parse(this.localService.get('JamiatId')!)});
    }else if(this.localService.get('DepartmentId') != undefined) {
      Object.assign(body, {departmentId: JSON.parse(this.localService.get('DepartmentId')!)});
    }
    
    if(this.localService.get('UmoorId') != undefined) {
      Object.assign(body, {umoorId: JSON.parse(this.localService.get('UmoorId')!)});
    }

    if (status !== 4) {
      Object.assign(body, {status: status});
    }

    return this.http
      .post<any>(`${environment.serverUrl}/api/` + urlname, body)
      .pipe(
        map((data: any) => {
          if (data) {
            return data.data;
          }
          return [];
        })
      );
  }

  setDeactivationNiyat(data: any,itsId:number): Observable<any> {
  const body = {
    deactivationReason: data?.comment || '',   // ensure data has .comment
    niyatId: data?.niyatId || '',
    requestedBy: itsId || ''
  };

  return this.http.post<any>(`${environment.serverUrl}/api/niyat/deactivation-request`, body); // Adjust URL
}

confirmDeactivationNiyat(data: any,itsId:number): Observable<any> {
  const deactivationRequestId = data?.deactivationRequestId;
  const approverItsId = itsId;

  const url = `${environment.serverUrl}/api/niyat/deactivation-request/${deactivationRequestId}/approve?approvedBy=${approverItsId}`;

  return this.http.put<any>(url,null);
}
}