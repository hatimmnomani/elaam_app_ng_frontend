import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable,of } from "rxjs";
import { environment } from "src/environments/environment";
import { catchError, map } from 'rxjs/operators';
import { LocalStorageService } from "src/app/auth/service/storage/localstorage.service";

@Injectable({
  providedIn: 'root'
})
export class ApproverCatalogueService {
  constructor(private http: HttpClient,private LocalService: LocalStorageService,) {}


  /******************************************************************************
   *
   * @brief Redeem Blue Trophies
   * @param itsId
   * @param catalogueId
   * @return Observable<any>
   *
   ******************************************************************************/
   redeemBlueTrophies(itsId: number,catalogueId: number): Observable<any> {
    
    return this.http
      .post<any>(`${environment.serverUrl}/api/redeemBlueTrophies` + `/${itsId}` + `/${catalogueId}` , { "itsId": itsId, "catalogueId": catalogueId })
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
        .get<any>(`${environment.serverUrl}/api/getTotalRedeemedAndBalancedBlueTrophies`, {params: params})
        .pipe(
          map((data: any) => {
            return data.data;
          })
        );
    }

     /******************************************************************************
  *
  * @brief Fetch approver catalogue list
  * @param any catalogueList
  * @return Observable<any>
  *
  ******************************************************************************/
      getAllActiveCatalogues(): Observable<any> {
        let itsId:any=this.LocalService.get('itsId');
      let url:any;
      url = '/api/getAllActiveApproverCatalogues/'+itsId;
     return this.http
      .get<any>(`${environment.serverUrl}`+url, {})
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
  * @brief Fetch rewardList list
  * @param any rewardList
  * @return Observable<any>
  *
  ******************************************************************************/
    approveRewardList(itsId: number, searchQ:string): Observable<any> {
      let params = new HttpParams();
      params = params.append("itsId", itsId);
      if(searchQ) params = params.append("search", searchQ);
      let url:any;
      url = '/api/approveRewardList';
     return this.http
      .get<any>(`${environment.serverUrl}`+url, {params:params})
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
