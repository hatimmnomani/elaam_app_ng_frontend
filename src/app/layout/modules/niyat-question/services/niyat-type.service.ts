import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NiyatTypeService {

  constructor(private http: HttpClient) { }

  /******************************************************************************
  *
  * @brief Fetch  Get All Niyat Type Data
  * @param any id
  * @return Observable
  *
  ******************************************************************************/
 getNiyatTypeList(): Observable<any> {
  return this.http
    .get<any>(`${environment.serverUrl}/api/get-all-niyattype`, {})
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
