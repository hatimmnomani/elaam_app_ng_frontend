import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';



@Injectable({
  providedIn: "root",
})
export class MuminDashboardService {
  constructor(private http: HttpClient) {}

  /******************************************************************************
   *
   * @brief Get getNiyat
   * @param niyatid
   * @return Observable<any>
   *
   ******************************************************************************/
  getNiyat(niyatId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append("niyatId", niyatId);

    return this.http
      .get<any>(`${environment.serverUrl}/api/getNiyat`, {
        params: params,
      })
      .pipe(
        map((data: any) => {
          if (data) {
            return data.data;
          }
          return null;
        })
        // catchError(err => of([]))
      );
  }


  /******************************************************************************
   *
   * @brief Redeem Trophies
   * @param itsId
   * @param catalogueId
   * @return Observable<any>
   *
   ******************************************************************************/
  redeemTrophies(itsId: number,catalogueId: number): Observable<any> {
    
    return this.http
      .post<any>(`${environment.serverUrl}/api/redeemTrophies` + `/${itsId}` + `/${catalogueId}` , { "itsId": itsId, "catalogueId": catalogueId })
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

    /******************************************************************************
   *
   * @brief Get Redeem Trophies
   * @param itsId
   * @return Observable<any>
   *
   ******************************************************************************/
  getRedeemStatusTrophies(itsId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append("itsId", itsId);
    return this.http
      .get<any>(`${environment.serverUrl}/api/getTotalAndRedeemedTrophies`, {params: params})
      .pipe(
        map((data: any) => {
          return data.data;
        })
      );
  }


  /******************************************************************************
   *
   * @brief Get Niyat Status post request
   * @param any
   * @return Observable<any>
   *
   ******************************************************************************/
  getNiyatStatus(event: any, itsId: number): Observable<any> {
    let params = new HttpParams();
    params = params.append("startDate", event.startDate);
    params = params.append("endDate", event.endDate);
    params = params.append("itsId", itsId);

    return this.http
      .get<any>(`${environment.serverUrl}/api/getAllNiyatStatus`, {
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
      // {
      //   id: 0,
      //   name: "deactivated",
      //   value: res.completed === undefined ? "0" : res.deactivated,
      // },
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
  getListData(
    urlname: string,
    event: any,
    itsId: number,
    status: number,
    search: string
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("startDate", (event)?event.startDate:'2002-09-27');
    params = params.append("endDate", (event)?event.endDate:'2002-09-27');

    if (itsId > 0) {
      params = params.append("itsId", itsId);
    }
    if (status !== 4) {
      params = params.append("status", status);
    }
    params = params.append("search", search);

    return this.http
      .get<any>(`${environment.serverUrl}/api/` + urlname, { params: params })
      .pipe(
        map((data: any) => {
          if (data.data) {
            return data.data;
          }
          return [];
        })
      );
  }

    /******************************************************************************
   *
   * @brief Complate Niyat
   * @param niyatid
   * @param completedValue
   * @return Observable<any>
   *
   ******************************************************************************/
    completeNiyat(niyatId: number,completedValue: number): Observable<any> {
      let body:any = {
        'niyatId': niyatId,
        'completedValue': completedValue
      };
      
      return this.http
        .put<any>(`${environment.serverUrl}/api/completeNiyat`, body)
        .pipe(
          map((data: any) => {
            return data;
          })
          // catchError(err => of([]))
        );
    }

  /******************************************************************************
   *
   * @brief GetApproverDetails
   * @param niyatid
   * @param approverRole
   * @return Observable<any>
   *
   ******************************************************************************/
   getApproverDetails(niyatId: number,approverRole: string): Observable<any> {
    let body:any = {
      'niyatId': niyatId,
      'roleName': approverRole
    };
    
    return this.http
      .post<any>(`${environment.serverUrl}/api/getApproverDetails`, body)
      .pipe(
        map((data: any) => {
          return data;
        })
        // catchError(err => of([]))
      );
  }


     /******************************************************************************
  *
  * @brief Approve Niyat By Niyat ID
  * @param any id
  * @return Observable<any>
  *
  ******************************************************************************/
  approveNiyatByNID(id: any, userrole:string,itsId:number): Observable<any> {
 
    let body:any = {
      'niyatId': id,
      'roleName': userrole,
      "itsId":itsId
    };

    return this.http
      .put<any>(`${environment.serverUrl}/api/approveNiyat/`, body)
      .pipe(
        map((data: any) => {
          if (data != null) {
            return data;
          }
          return null;
        }),
        catchError(err => of([]))
      )
  }


     /******************************************************************************
  *
  * @brief getApprover Niyat By Niyat ID
  * @param any id
  * @return Observable<any>
  *
  ******************************************************************************/
      getApprover(data:any){
         return this.http.post(`${environment.serverUrl}/api/getApprover`,data).toPromise();          
      }

      /******************************************************************************
    *
    * @brief Send Message Request
    * @param data
    * @return Observable<any>
    *
    ******************************************************************************/
    sendMessage(messageData: any, role: string, niyatId: number, userItsId:any ): Observable<any> {
      let api = (role == 'Mumin') ? '/api/requestForUpdateNiyat/'+niyatId : '/api/messageToMumin/'+ niyatId ;

      messageData['itsId'] = userItsId;
      return this.http
        .post<any>(`${environment.serverUrl}`+ api, messageData)
        .pipe(
          map((data: any) => {
            if (data.error) { return data }
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
   * @brief Get login details of mumin
   * @param itsId
   * @return Observable<any>
   *
   ******************************************************************************/
     getMuminLoginDetails(itsId: number): Observable<any> {
      let params = new HttpParams();
      params = params.append("itsId", itsId);
      return this.http
        .get<any>(`${environment.serverUrl}/api/getMuminLoginDetails`, {params: params})
        .pipe(
          map((data: any) => {
            return data.data;
          })
        );
    }

    /******************************************************************************
   *
   * @brief Get total niyats in 
   * @param none
   * @return Observable<any>
   *
   ******************************************************************************/
  getTotalNiyats(event:any): Observable<any> {
    let params = new HttpParams();
    params = params.append("startDate", event.startDate);
    params = params.append("endDate", event.endDate);

    return this.http
      .get<any>(`${environment.serverUrl}/api/totalNiyat`, { params: params })
      .pipe(
        map((data: any) => {
          return data.data;
        })
      );
  }


   /******************************************************************************
   *
   * @brief sendReward
   * @return Observable<any>
   *
   ******************************************************************************/
    sendReward(body:any): Observable<any> {   
      
      return this.http
        .post<any>(`${environment.serverUrl}/api/giftReward`, body)
        .pipe(
          map((data: any) => {
            return data;
          })
          // catchError(err => of([]))
        );
    }
  
      /******************************************************************************
    *
    * @brief Send revert niyat remarks
    * @param data
    * @return Observable<any>
    *
    ******************************************************************************/
       sendNiyatRevertRemarks(remarksData: any, role: string, niyatId: number ): Observable<any> {
        let body:any = {
          'niyatId': niyatId,
          'remarks':remarksData.remarks,
          'roleName': role
        };
        return this.http
          .put<any>(`${environment.serverUrl}/api/revertNiyat`, body)
          .pipe(
            map((data: any) => {
              if (data.error) { return data }
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
   * @brief Get login details of mumin
   * @param itsId
   * @return Observable<any>
   *
   ******************************************************************************/
  getMuminCatalgoExcel(itemId: number,catalogueType:any): Observable<any> {
    let params = new HttpParams();
    params = params.append("catalogueType", catalogueType);
    params = params.append("itemId", itemId);
    return this.http
      .get<any>(`${environment.serverUrl}/api/getListOfAllMuminByCatalogueId`, {params: params})
      .pipe(
        map((data: any) => {
          return data.data;
        })
      );
  }
  acknowRedeemTrophies(body:any): Observable<any> { 
    return this.http
      .put<any>(`${environment.serverUrl}/api/acknowledgeRedeemTrophies`, body)
      .pipe(
        map((data: any) => {
          return data;
        })
        
      );
  }

}
