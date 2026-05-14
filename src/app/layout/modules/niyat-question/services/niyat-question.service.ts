import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NiyatQuestionService {

  constructor(private http: HttpClient) { }

    /******************************************************************************
  *
  * @brief Fetch  Get All Question Data
  * @param any id
  * @return Observable
  *
  ******************************************************************************/
 getQuestionList(): Observable<any> {
  return this.http
    .get<any>(`${environment.serverUrl}/api/get-all-niyat-question`, {})
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
  * @brief Add question post request
  * @param any question
  * @return Observable<any>
  *
  ******************************************************************************/
    addNiyatQuestion(question:any): Observable<any> {
      return this.http
        .post<any>(`${environment.serverUrl}/api/add-niyat-question`, question)
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
  * @brief Edit question post request
  * @param any questionId
  * @param any question
  * @return Observable<any>
  *
  ******************************************************************************/
   editNiyatQuestion(questionId: any, question: any): Observable<any> {
    return this.http
      .put<any>(`${environment.serverUrl}/api/edit-niyat-question/` + questionId, question)
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
  * @brief Fetch Question By ID
  * @param any id
  * @return Observable<any>
  *
  ******************************************************************************/
     getQuestionByID(id: any): Observable<any> {
      return this.http
        .get<any>(`${environment.serverUrl}/api/getNiyatQuestionById/${id}`, {})
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
      * @brief Status Niyat Question By ID
      * @param any id
      * @return Observable<any>
      *
      ******************************************************************************/
        getStatusNiyatQuestion(id: any): Observable<any> {
          return this.http
            .get<any>(`${environment.serverUrl}/api/action-niyat-question/${id}`, {})
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
