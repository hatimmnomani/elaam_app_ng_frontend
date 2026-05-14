import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UmoorService {

  constructor(private http: HttpClient) { }

  /******************************************************************************
  *
  * @brief Fetch  Get All Umoor Data
  * @param any id
  * @return Observable
  *
  ******************************************************************************/
 getUmoorList(): Observable<any> {
  return this.http
    .get<any>(`${environment.serverUrl}/api/getAllUmoor`, {})
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
  * @brief Fetch  Get All Active Umoor Data
  * @param any id
  * @return Observable
  *
  ******************************************************************************/
    getActiveUmoorList(): Observable<any> {
      return this.http
        .get<any>(`${environment.serverUrl}/api/getAllActiveUmoor`, {})
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
  * @brief Fetch Add Umoor
  * @param any id
  * @return Observable
  *
  ******************************************************************************/
 createUmoor(umoor: any, file: any): Observable<any> {
  let headers = new HttpHeaders();
  headers = headers.append('Content-Type', 'multipart/form-data');
  headers = headers.append('enctype', 'multipart/form-data');

  const formData = new FormData();
     formData.append('file', file);
     formData.append('umoor', JSON.stringify(umoor));




  return this.http
    .post<any>(`${environment.serverUrl}/api/addUmoor`, formData)
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
  * @brief Fetch Umoor By ID
  * @param any id
  * @return Observable<any>
  *
  ******************************************************************************/
    getUmoorByID(id: any): Observable<any> {
      return this.http
        .get<any>(`${environment.serverUrl}/api/getUmoorById/${id}`, {})
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
  * @brief Edit umoor post request
  * @param any umoorId
  * @param any umoor
  * @return Observable<any>
  *
  ******************************************************************************/
     editUmoor(umoorId: any, umoor: any, file: any): Observable<any> {
      let headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'multipart/form-data');
      headers = headers.append('enctype', 'multipart/form-data');
  
      const formData = new FormData();
         formData.append('file', file);
         formData.append('umoor', JSON.stringify(umoor));
  
  
  
      return this.http
        .put<any>(`${environment.serverUrl}/api/updateUmoors/` + umoorId, formData)
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
  * @brief Change Umoor Status By ID
  * @param any id
  * @return Observable<any>
  *
  ******************************************************************************/
      changeUmoorStatusByID(id: any): Observable<any> {
        return this.http
          .get<any>(`${environment.serverUrl}/api/deleteUmoor/${id}`, {})
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


}
