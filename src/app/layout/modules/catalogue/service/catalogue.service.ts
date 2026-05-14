import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable , of} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/auth/service/storage/localstorage.service';


@Injectable({
  providedIn: 'root'
})

export class CatalogueService {
  constructor(
    private http: HttpClient,
    private LocalService: LocalStorageService,
  ) { }

  /******************************************************************************
  *
  * @brief Add catalogue post request
  * @param any catalogue
  * @return Observable<any>
  *
  ******************************************************************************/
    addCatalogue(catalogue:any,file:any): Observable<any> {
      let headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'multipart/form-data');
      headers = headers.append('enctype', 'multipart/form-data');
  
      const formData = new FormData();
         formData.append('file', file);
         formData.append('catalogue', JSON.stringify(catalogue));
        return this.http
        .post<any>(`${environment.serverUrl}/api/addCatalogue`, formData)
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
  * @brief Edit catalogue put request
  * @param any catalogueId
  * @param any catalogue
  * @return Observable<any>
  *
  ******************************************************************************/
   editCatalogue(catalogueId: any, catalogue: any,file:any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'multipart/form-data');
    headers = headers.append('enctype', 'multipart/form-data');

    const formData = new FormData();
      if(typeof file != 'string'){
        formData.append('file', file);
      } 
       formData.append('catalogue', JSON.stringify(catalogue));
    return this.http
    .put<any>(`${environment.serverUrl}/api/updateCatalogue/`+ catalogueId, formData)
    .pipe(
      map((data: any) => {
        if (data != null) {
          return data.data;
        }
        return null;
      })
    )
  }
  /******************************************************************************
  *
  * @brief Fetch catalogue list
  * @param any catalogueList
  * @return Observable<any>
  *
  ******************************************************************************/
     getCatalogueList(): Observable<any> {
      let role: any = this.LocalService.get('role');
      let itsId:any=this.LocalService.get('itsId');
      let url:any;
      if(JSON.parse(role)  === "Mumin") {
        url = '/api/getAllActiveMuminCatalogues/'+itsId;
      } else {
        url = '/api/getAllCatalogues';
      } 

      return this.http
      .get<any>(`${environment.serverUrl}`+url, {})
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
  * @brief Fetch catalogue By ID
  * @param any id
  * @return Observable<any>
  *
  ******************************************************************************/
   getCatalogueByID(id: any): Observable<any> {
    return this.http
      .get<any>(`${environment.serverUrl}/api/getCatalogueById/${id}`, {})
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
   * @brief Status catalogue By ID
   * @param any id
   * @return Observable<any>
   *
  ******************************************************************************/
    changeStatusByID(id: any): Observable<any> {
      return this.http
        .get<any>(`${environment.serverUrl}/api/deleteCatalogue/${id}`, {})
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
   * @brief List of mumin by catalogue
   * @param any id
   * @return Observable<any>
   *
  ******************************************************************************/
     getMuminInfoByCatalogue(catalogueType: any, itemId: any): Observable<any> {
      let params = new HttpParams();
      params = params.append("catalogueType", catalogueType);
      params =params.append("itemId",itemId)
      return this.http
        .get<any>(`${environment.serverUrl}/api/getListOfMuminByCatalogueId`, {params:params})
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
  * @brief Fetch  Get  Niyat Data List
  * @param any page and pageSize
  * @return Observable
  *
  ******************************************************************************/
  getList(data:any): Observable<any> {
    return this.http
      .get<any>(`${environment.serverUrl}/api/getListOfMuminByCatalogueId`, {params:data})
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
      list: data.response,
      totalSize: data.paginationDto.totalRecords
    };
    return result;
  }

}
