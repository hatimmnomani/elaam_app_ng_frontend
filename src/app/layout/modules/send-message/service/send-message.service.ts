import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { LocalStorageService } from '../../../../auth/service/storage/localstorage.service';


@Injectable()
export class SendMessageService {

    constructor(    
        private http: HttpClient,
        private localService: LocalStorageService
    ) { }

    getData(urlname: string, roleArray:any): Observable<any> {
        return this.http
        .post<any>(`${environment.serverUrl}/api/` + urlname, roleArray)
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
    * @brief Send Message Request
    * @param data
    * @return Observable<any>
    *
    ******************************************************************************/
    sendMessage(messageData: any ): Observable<any> {
        return this.http
        .post<any>(`${environment.serverUrl}/api/send-message/`, messageData)
        .pipe(map((data: any) => {
            if (data.error) { return data }
            if (data != null) {
            return data;
            }
            return null;
        }),
        // catchError(err => of([]))
        )
    }  

    getDataByID(url:string, id: any): Observable<any> {
        return this.http
          .get<any>(`${environment.serverUrl}/api/`+ url +'/'+id, {})
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
