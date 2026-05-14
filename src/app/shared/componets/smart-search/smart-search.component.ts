import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { LocalStorageService } from "src/app/auth/service/storage/localstorage.service";
import { SharedataService } from "../../services/sharedata.service";

@Component({
  selector: "app-smart-search",
  templateUrl: "./smart-search.component.html",
  styleUrls: ["./smart-search.component.scss"],
})

export class SmartSearchComponent implements OnInit {
  

  @Input("list") list: any[] = [];
  @Input("value") value: string | undefined = undefined;
  @Input("placeholder") placeholder: string = "Search";
  filteredList: any[] = [];
  duplicateList: any[] = [];
  filteredOptions!: Observable<any[]>;
  filterValue: any;
  userrole: any;

  @Output() searchEvent = new EventEmitter<any[]>();
  @Output() textSearch = new EventEmitter<string>();

  searchControl = new FormControl();

  constructor(
    private localService: LocalStorageService,
  ) {}

  ngOnInit() {
    const data: any = this.localService.get("role");
    this.userrole = JSON.parse(data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(changes.list != undefined && changes.list.currentValue) {
      this.filteredList = this.duplicateList = changes.list.currentValue;

      this.filteredOptions = this.searchControl.valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value))
      );
    }
    if (changes.value && changes.value.currentValue !== undefined) {
      // Set the search control value without triggering valueChanges
      this.searchControl.setValue(changes.value.currentValue, { emitEvent: false });
    }
  }

  /******************************************************************************
   *
   * @brief Filter function for search
   * @param value: any
   * @return none
   *
   ******************************************************************************/
  private _filter(value: any): any[] {
    return this.duplicateList.filter(
      (data) =>{
        if(!isNaN(value)){
          return JSON.stringify(data).indexOf(value) !== -1
        }else{
          return JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1
        }
      }
    );
  }

  /******************************************************************************
   *
   * @brief Filter Question List
   * @param event: any
   * @return none
   *
   ******************************************************************************/
onSelectionChange(event: any) {
    if(!isNaN(event.option.value)){
      this.filterValue = event.option.value;
    }else{
      this.filterValue = event.option.value.toLowerCase();
  }
    if(!this.filterValue) {
      this.searchEvent.emit([""]);
    }else if(this.filterValue == "all") {
      this.searchEvent.emit([""]);
    }else {
      this.filteredList = this.duplicateList.filter(
        (data) =>{
          if(!isNaN(event.option.value)){
      return JSON.stringify(data)
        .toLowerCase()
            .indexOf(this.filterValue) !== -1
          }else{
            return JSON.stringify(data)
            .toLowerCase()
            .indexOf(this.filterValue.toLowerCase()) !== -1
          }
        }
      );
    this.searchEvent.emit(this.filteredList);
  }
}

  /******************************************************************************
   *
   * @brief Filter Question List
   * @param id
   * @return none
   *
   ******************************************************************************/
  onSelectionChangekey(event: any) {
    this.textSearch.emit(event.target.value);
    if(event.target.value === "") {
      this.searchEvent.emit([]);
    }
  }

  /******************************************************************************
   *
   * @brief Empty Search Filed
   * @param none
   * @return none
   *
   ******************************************************************************/

  emptySearch() {
    this.searchControl = new FormControl();
    this.searchEvent.emit([""]);
    this.textSearch.emit("");
  }

  resetSearch(){
    this.searchControl = new FormControl();
  }
}
