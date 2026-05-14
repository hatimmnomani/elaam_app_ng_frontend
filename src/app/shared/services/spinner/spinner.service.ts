
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  visibility: any;

  constructor() {
    this.visibility = new BehaviorSubject(false);
  }


/******************************************************************************
 *
 * @brief show we using this function to show the spinner
 * @param none
 * return true and false
 *
 ******************************************************************************/
  show() {
    this.visibility.next(true);

  }

/******************************************************************************
 *
 * @brief show we using this function to hide the spinner
 * @param none
 * return true and false
 *
 ******************************************************************************/
  hide() {
    this.visibility.next(false);
  }
}
