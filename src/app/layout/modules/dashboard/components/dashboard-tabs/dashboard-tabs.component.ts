import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpinnerService } from 'src/app/shared/services/spinner/spinner.service';

@Component({
  selector: 'app-dashboard-tabs',
  templateUrl: './dashboard-tabs.component.html',
  styleUrls: ['./dashboard-tabs.component.scss']
})
export class DashboardTabsComponent implements OnInit {

  @Output() tabEvent = new EventEmitter<any>();

  @Input("selectedIdx") selectedIdx: Observable<any>;

  @Input('rolenamedata') rolenamedata: Observable<any>;

  @Input('getChartData') getChartData: Observable<any>;


  private eventsSubscription!: Subscription;
  private destroy$: Subject<void> = new Subject();


  selectedIndex$ = new BehaviorSubject<any>([]);
  selectedIx = this.selectedIndex$.asObservable();

  rolename$ = new BehaviorSubject<any>([]);
  rolenameX = this.rolename$.asObservable();

  getChartData$ = new BehaviorSubject<any>([]);
  getChartDataX = this.getChartData$.asObservable();


  constructor(
    public spinner: SpinnerService, 
    private changeDetection: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getselectedIndex()
    this.getrolename()
    this.getChartDatafc()

  }
  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

  /******************************************************************************
   *
   * @brief get the selected Index
   * @param none
   * return none
   *
   ******************************************************************************/

  getrolename() {
    if (this.getChartData !== undefined) {
      this.getChartData.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        this.getChartData$.next(data);
      });
    }

  }

  /******************************************************************************
   *
   * @brief get the chart data
   * @param none
   * return none
   *
   ******************************************************************************/

  getChartDatafc() {
    if (this.rolenamedata !== undefined) {
      this.rolenamedata.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        this.rolename$.next(data);
      });
    }

  }

  /******************************************************************************
   *
   * @brief get the selected Index
   * @param none
   * return none
   *
   ******************************************************************************/

  getselectedIndex() {
    if (this.selectedIdx !== undefined) {
      this.selectedIdx.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        this.selectedIndex$.next(data);
      });
    }
  }

  /******************************************************************************
   *
   * @brief Emit the Card Details to component using input 
   * @param none
   * return card details
   *
   ******************************************************************************/

  tabDetails(event: MatTabChangeEvent) {
    this.tabEvent.emit(event);
    this.changeDetection.detectChanges();
  }

  

}
