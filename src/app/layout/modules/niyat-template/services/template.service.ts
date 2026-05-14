import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TemplateService {

  constructor(
    private http: HttpClient
  ) { }


    /******************************************************************************
    *
    * @brief Add Department post request
    * @param any department
    * @return Observable<any>
    *
    ******************************************************************************/
     addTemplate(template: any): Observable<any> {
      return this.http
        .post<any>(`${environment.serverUrl}/api/addTemplate`, template)
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
  * @brief Edit department post request
  * @param any departmentId
  * @param any department
  * @return Observable<any>
  *
  ******************************************************************************/
   editTemplate(templateId: any, templateData: any): Observable<any> {
    return this.http
      .put<any>(`${environment.serverUrl}/api/updateTemplate/` + templateId, templateData)
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
  * @brief Fetch  Get All Templates Data
  * @param any id
  * @return Observable
  *
  ******************************************************************************/
    getTemplateList(): Observable<any> {
      return this.http
        .get<any>(`${environment.serverUrl}/api/getAllTemplates`, {})
        .pipe(
          map((data: any) => {
            
            if (data != null) {
              return data.data.filter((status: any) => { return status.userStatus === 'ACTIVE'});
              ;
            }
            return null;
          }),
          // catchError(err => of([]))
        )
    }

     /******************************************************************************
  *
  * @brief Status template By ID
  * @param any id
  * @return Observable<any>
  *
  ******************************************************************************/
  getStatusTemplate(id: any): Observable<any> {
    return this.http
      .delete<any>(`${environment.serverUrl}/api/deleteTemplate/${id}`, {})
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
  * @brief Fetch Department By ID
  * @param any id
  * @return Observable<any>
  *
  ******************************************************************************/
  getTemplateByID(id: any): Observable<any> {
    return this.http
      .get<any>(`${environment.serverUrl}/api/getTemplateById/${id}`, {})
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

  getQuestionsList(): Observable<any> {
    return this.http
      .get<any>(`${environment.serverUrl}/api/get-all-niyat-question`, {})
      .pipe(
        map((data: any) => {
          
          if (data != null) {
            return data.data.sort((a: any, b: any) => parseFloat(a.id) - parseFloat(b.id));
          }
          return null;
        }),
        catchError(err => of([]))
      )
  }
 /******************************************************************************
  *
  * @brief Generate QR Code
  * @param any id
  * @return Observable<any>
  *
  ******************************************************************************/
  generateQRCode(id: any): Observable<any> {
    return this.http
      .put<any>(`${environment.serverUrl}/api/generateQRCode/${id}`, {})
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
  * @brief Generate QR Code
  * @param any id
  * @return Observable<any>
  *
  ******************************************************************************/
expireQRCode(id: any): Observable<any> {
  return this.http
    .put<any>(`${environment.serverUrl}/api/expireQRCode/${id}`, {})
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
