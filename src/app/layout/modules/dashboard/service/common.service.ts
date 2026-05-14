import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})

export class CommonService {

  constructor() {}

  /********
   * 
   *  Function for transform response messages in title case
   * 
   */
  toTitleCase(str:string): string {
    return str.replace(/\w\S*/g, function(txt:any){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }



}
