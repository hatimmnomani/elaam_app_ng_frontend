import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class NiyatApproverService {
  constructor(
    private http: HttpClient
  ) { }


   /******************************************************************************
  *
  * @brief Fetch  Get All Unapproved Niyats Data
  * @param any id
  * @return Observable
  *
  ******************************************************************************/
    getUnApprovedNiyat(id:any): Observable<any> {
      return this.http
        .get<any>(`${environment.serverUrl}/api/pendingApprovals/${id}`, {})
        .pipe(
          map((data: any) => {
            
            if (data.data) {
              return data.data;
            }
            return [];
          })
        )
    }
}