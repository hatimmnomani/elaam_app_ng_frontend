import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class KhidmatRamadaniyahService {
  constructor(private http: HttpClient) {}

  

  /******************************************************************************
   * @brief Get List for server-side table
   * @param data
   * @return Observable
   ******************************************************************************/
  getList(data: any): Observable<any> {
    const params = {
      limit: data.pageSize || 10,
      offset: data.pageNo || 0,
      searchKey: data.searchValue || undefined,
      sortBy: data.sortBy || undefined,
      sortDir: data.sortDir || undefined
    };
    return this.http
      .post<any>(`${environment.serverUrl}/api/getAllAssignments`, params)
      .pipe(
        map((response: any) => {
          if (response != null && response.data && response.data.ramadaniyahStudent) {
            const list = response.data.ramadaniyahStudent;
            const totalRecords = response.data.paginationDto ? response.data.paginationDto.totalRecords : list.length;
            return {
              list: list,
              totalSize: Math.max(totalRecords, list.length)
            };
          }
          return { list: [], totalSize: 0 };
        }),
        catchError((err) => of({ list: [], totalSize: 0 })),
      );
  }

  /******************************************************************************
   * @brief Assign Role to ITS ID
   * @param roleData
   * @return Observable
   ******************************************************************************/
  assignKhidmatRole(roleData: any): Observable<any> {
    return this.http
      .post<any>(`${environment.serverUrl}/api/assign-khidmat-role`, roleData)
      .pipe(
        map((data: any) => {
          if (data != null) {
            return data;
          }
          return null;
        }),
      );
  }

  /******************************************************************************
   * @brief Fetch Assigned Role By ID
   * @param id
   * @return Observable
   ******************************************************************************/
  getKhidmatRoleByID(id: any): Observable<any> {
    return this.http
      .get<any>(`${environment.serverUrl}/api/getAssignmentByIdId/${id}?itsId=${id}`, {})
      .pipe(
        map((data: any) => {
          if (data != null && data.data) {
            return data.data;
          }
          return null;
        }),
        catchError((err) => of(null)),
      );
  }

  /******************************************************************************
   * @brief Update Assigned Role
   * @param id
   * @param roleData
   * @return Observable
   ******************************************************************************/
  updateKhidmatRole(id: any, roleData: any): Observable<any> {
    return this.http
      .put<any>(
        `${environment.serverUrl}/api/update-assignment`,
        roleData,
      )
      .pipe(
        map((data: any) => {
          if (data != null) {
            return data;
          }
          return null;
        }),
      );
  }

  /******************************************************************************
   * @brief Activate/Deactivate Assignment
   * @param payload { active: boolean, itsId: number, roleId: number }
   * @return Observable
   ******************************************************************************/
  activateDeactivateAssignment(payload: any): Observable<any> {
    return this.http
      .patch<any>(`${environment.serverUrl}/api/activate-deactivate-assignment`, payload)
      .pipe(
        map((data: any) => {
          return data;
        }),
        catchError((err) => {
          console.error('API Error:', err);
          return of({ error: true, message: err?.error?.message || 'An error occurred' });
        })
      );
  }

  /******************************************************************************
   * @brief Remove Assigned Role
   * @param id
   * @return Observable
   ******************************************************************************/
  deleteKhidmatRole(id: any): Observable<any> {
    return this.http
      .delete<any>(`${environment.serverUrl}/api/deleteKhidmatRole/${id}`, {})
      .pipe(
        map((data: any) => {
          if (data != null) {
            return data;
          }
          return null;
        }),
        catchError((err) => of(null)),
      );
  }
}
