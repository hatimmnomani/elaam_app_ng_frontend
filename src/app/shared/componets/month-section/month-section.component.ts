import { Component, OnInit ,Output, EventEmitter, Input} from '@angular/core';
import * as moment from 'moment';
import { SharedataService } from 'src/app/shared/services/sharedata.service';
import { LocalStorageService } from 'src/app/auth/service/storage/localstorage.service';

@Component({
  selector: 'app-month-section',
  templateUrl: './month-section.component.html',
  styleUrls: ['./month-section.component.scss'],
  

})
export class MonthSectionComponent implements OnInit {
  
  date_formate: any= "YYYY-MM-DD";
  startDate = moment().format(this.date_formate);

  @Output() messageEvent = new EventEmitter<any>();
  @Output() selectedChange = new EventEmitter<number>(); // For two-way binding

  @Input() reportmonth:any;
  @Input() selected: number = 5; // Default value is 5, will be set to 2 if reportmonth is defined
  dropDownSelection:any;

  constructor(
    private sharedataService: SharedataService,
    private localstorage: LocalStorageService
  ) { 
     
  }
  ngOnInit(): void {
    // Check if there's a saved selection value from navigation
    this.sharedataService.currentSelectedMonthValue.subscribe(value => {
      if (value !== null && value !== this.selected) {
        this.selected = value;
        this.selectedChange.emit(this.selected);
        // Trigger the same calculation and date emission as a user selection
        this.onSelectionChange({ value: this.selected });
      }
    });
    
    let role: any = this.localstorage.get("role");
    let userrole = JSON.parse(role);

    if(this.reportmonth == undefined || userrole === 'Khidmat Ramadaniyah'){
      // For regular mode or Khidmat role - default is 5 (ALL)
      this.dropDownSelection = [
        { id: 1, name: "Last 1 Month" },
        { id: 2, name: "Last 3 Months" },
        { id: 3, name: "Last 6 Months" },
        { id: 4, name: "1 year" },
        { id: 5, name: "ALL" },
      ];
      
      // If we have a saved selection, use it
      if (this.selected !== 5) {
        this.onSelectionChange({ value: this.selected });
      } else {
        // Default selection is 5 (ALL)
        this.getDate(moment().subtract(20, 'years').format(this.date_formate));
      }
    } else {
      // For report mode - default is 2 (Last 3 Months)
      this.dropDownSelection = [
        { id: 1, name: "Last 1 Month" },
        { id: 2, name: "Last 3 Months" },
      ];
      
      // If no saved selection for report mode or if the current selection is 5 (ALL),
      // set the default to 2 (Last 3 Months) since ALL is not available in report mode
      if (this.selected === 5 || !this.dropDownSelection.some((item: {id: number; name: string}) => item.id === this.selected)) {
        this.selected = 2; // Default to Last 3 Months for report mode
        this.selectedChange.emit(this.selected);
      }
      
      this.onSelectionChange({ value: this.selected });
    }
  }
  
  getDate(endDate:string) {
    const data = {startDate: endDate, endDate: moment().format(this.date_formate)}
    this.messageEvent.emit(data);
  }



   /******************************************************************************
   *
   * @brief set blank date
   * @param null
   * @return none
   *
   ******************************************************************************/
    blankDate() {
      const data = {startDate: '', endDate: ''}
      this.messageEvent.emit(data);
    }

  onSelectionChange(event: any){ 
    console.log(event.value+'ds')
    this.selected = event.value;
    // Emit the selected value for two-way binding
    this.selectedChange.emit(this.selected);
    // Save the selected value to the shared service
    this.sharedataService.setSelectedMonthValue(event.value);
    
    switch (event.value) {
      case 1:
        this.getDate(moment().subtract(1, 'months').format(this.date_formate));
        break;
      case 2:
        this.getDate(moment().subtract(3, 'months').format(this.date_formate));
        break;
      case 3:
        this.getDate(moment().subtract(6, 'months').format(this.date_formate));
        break;
      case 4:
          this.getDate(moment().subtract(1, 'years').format(this.date_formate));
          break;
      case 5:
          // this.blankDate();
          this.getDate(moment().subtract(20, 'years').format(this.date_formate));
          break;
      default:
        this.getDate(moment().subtract(1, 'years').format(this.date_formate));
        break;
    }
   
  }
 
 

}
