import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Searchable } from 'src/app/shared/models/interface/searchable.interface';

@Injectable({
  providedIn: 'root'
})
export class RedeemedPrizesService implements Searchable<any> {
  constructor(private http: HttpClient) { }

  /******************************************************************************
  *
  * @brief Fetch paginated/sorted/filtered list of all redeemed prizes (all catalogue items)
  * @param any data - pageSize, pageNo, sortBy, sortDir, searchValue, isAcknowledged
  * @return Observable<any>
  *
  ******************************************************************************/
  getList(data: any): Observable<any> {
    return this.http
      .get<any>(`${environment.serverUrl}/api/getAllRedeemedPrizes`, { params: data })
      .pipe(
        map((res: any) => {
          if (res?.data) {
            return {
              list: res.data.response,
              totalSize: res.data.paginationDto.totalRecords
            };
          }
          return { list: [], totalSize: 0 };
        }),
        catchError(err => of({ list: [], totalSize: 0 }))
      );
  }

  /******************************************************************************
  *
  * @brief Fetch the full (unpaginated) list of redeemed prizes, honouring the same
  * search/sort/filter params as the list view, with Jamaat/Jamiat/Contact details for Excel export
  * @param any data - sortBy, sortDir, searchValue, isAcknowledged
  * @return Observable<any>
  *
  ******************************************************************************/
  getAllRedeemedPrizesExcel(data: any): Observable<any> {
    return this.http
      .get<any>(`${environment.serverUrl}/api/getAllRedeemedPrizesExcel`, { params: data })
      .pipe(
        map((res: any) => res?.data || []),
        catchError(err => of([]))
      );
  }
}
