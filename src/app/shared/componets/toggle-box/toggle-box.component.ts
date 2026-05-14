import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-toggle-box',
  templateUrl: './toggle-box.component.html',
  styleUrls: ['./toggle-box.component.scss']
})
export class ToggleBoxComponent implements OnInit, OnChanges {

  @Output() cardEvent = new EventEmitter<number>();

  @Input("status") status!: Observable<any[]>;
  @Input() selectedName: string | null = null;

  private eventsSubscription!: Subscription;
  boxstatus:string = 'total niyats';
  private destroy$ = new Subject();


  statusList$ = new BehaviorSubject<any>([]);
  statusList = this.statusList$.asObservable();


  constructor(
    private changeDetection: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getstationData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedName && changes.selectedName.currentValue !== undefined) {
      const nextName = changes.selectedName.currentValue;
      if (typeof nextName === 'string' && nextName.length > 0) {
        this.boxstatus = nextName;
        this.changeDetection.detectChanges();
      }
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();  // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

  /******************************************************************************
   *
   * @brief status list 
   * @param none
   * return none
   *
   ******************************************************************************/

  getstationData() {
    if (this.status !== undefined) {
      this.status.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        this.statusList$.next(data);
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

  cardAction(event: any) {
    this.cardEvent.emit(event);
    this.boxstatus = event.name;
    this.changeDetection.detectChanges();
  }

  
}
