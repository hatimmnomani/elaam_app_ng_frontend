import { environment } from './../../../../../environments/environment';
import { LocalStorageService } from "src/app/auth/service/storage/localstorage.service";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { catchError , map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  itsId: any;

  constructor(private localstorage: LocalStorageService, private http: HttpClient,) {
    this.itsId = this.localstorage.get("itsId");
   }

/******************************************************************************
*
* @brief Fetch all notification By itsid
* @param any itsid
* @return Observable<any>
*
******************************************************************************/
getNotification(itsId: any, status?: string): Observable<any> {
  let params = new HttpParams();
  params = params.append("itsId", itsId);
  params = params.append("pageSize", 10);
  params = params.append("pageNo", 0);
  
  if(status) { params = params.append("status", status) }

  return this.http
    .get<any>(`${environment.serverUrl}/api/get-notification`, {params})
    .pipe(
      map((data: any) => {
        if (data != null) {
          return data.data;
        }
        return [];
      }),
      // catchError(err => of([]))
    )
}

getNotificationPaginated(itsId: any, status?: string): Observable<any> {
  let params = new HttpParams();
  params = params.append("itsId", itsId);
  params = params.append("pageSize", 10);
  params = params.append("pageNo", 0);
  
  if(status) { params = params.append("status", status) }

  return this.http
    .get<any>(`${environment.serverUrl}/api/get-notificationWithPagination`, {params})
    .pipe(
      map((data: any) => {
        if (data != null) {
          return data.data;
        }
        return [];
      }),
      // catchError(err => of([]))
    )
}


  /******************************************************************************
  *
  * @brief Fetch  Get  Niyat Data List
  * @param any page and pageSize
  * @return Observable
  *
  ******************************************************************************/
   getList(data:any): Observable<any> {
    data = {...data, "itsId":this.itsId}
    return this.http
      .get<any>(`${environment.serverUrl}/api/get-notificationWithPagination`, {params:data})
      .pipe(
        map(data => {
          if (data.data) {
            const result = this.filteredData(data.data);
            return result;
          }
          return [];
        }),
        catchError(err => of("error", err))
      );
  }

  filteredData(data:any) {
    const result = {
      list: data.notificationData,
      totalSize: data.pagination.totalRecords
    };
    return result;
  }


/******************************************************************************
*
* @brief  Read notification
* @param notificationId
* @return Observable<any>
*
******************************************************************************/
getReadNotification(notificationId: any): Observable<any> {
  return this.http
    .post<any>(`${environment.serverUrl}/api/read-notification` + `/${notificationId}`, {})
    .pipe(
      map((data: any) => {
        
        if (data != null) {
          return data.data;
        }
        return null;
      }),
      // catchError(err => of([]))
    )
}
}

