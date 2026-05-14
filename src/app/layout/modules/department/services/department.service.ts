import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient,) { }

  /******************************************************************************
  *
  * @brief Add Department post request
  * @param any department
  * @return Observable<any>
  *
  ******************************************************************************/
  addDepartment(department: any,file:any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'multipart/form-data');
    headers = headers.append('enctype', 'multipart/form-data');

    const formData = new FormData();
       formData.append('file', file);
       formData.append('department', JSON.stringify(department));

    return this.http
      .post<any>(`${environment.serverUrl}/api/addDepartment`, formData)
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
  editDepartment(file: any,departmentId: any, department: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'multipart/form-data');
    headers = headers.append('enctype', 'multipart/form-data');
    const formData = new FormData();
       formData.append('file', file);
       formData.append('department', JSON.stringify(department));


    return this.http
      .put<any>(`${environment.serverUrl}/api/updateDepartment/` + departmentId, formData)
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
  * @brief Fetch  Get All Department Data
  * @return Observable
  *
  ******************************************************************************/
  getDepartmentList(): Observable<any> {
    return this.http
      .get<any>(`${environment.serverUrl}/api/getAllDepartment`, {})
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
  * @brief Fetch  Get All Active Department Data
  * @return Observable
  *
  ******************************************************************************/
     getAllActiveDpartments(): Observable<any> {
      return this.http
        .get<any>(`${environment.serverUrl}/api/getAllActiveDepartments`, {})
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
* @brief Status Department By ID
* @param any id
* @return Observable<any>
*
******************************************************************************/
  getStatusDepartment(id: any): Observable<any> {
    return this.http
      .get<any>(`${environment.serverUrl}/api/deleteDepartment/${id}`, {})
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
getDepartmentByID(id: any): Observable<any> {
  return this.http
    .get<any>(`${environment.serverUrl}/api/getDepartmentById/${id}`, {})
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
