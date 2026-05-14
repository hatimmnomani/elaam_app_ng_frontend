import { Observable } from "rxjs";

export interface Searchable<T> {
  getList(parameters: any): Observable<T[]>;
}