import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DashboardService } from 'src/app/layout/modules/dashboard/service/dashboard.service';
import { LocalStorageService } from 'src/app/auth/service/storage/localstorage.service';
import { Router } from '@angular/router';
import { number } from 'echarts';

@Component({
  selector: 'app-table-and-search',
  templateUrl: './table-and-search.component.html',
  styleUrls: ['./table-and-search.component.scss']
})
export class TableAndSearchComponent implements OnInit {

  @Input() filteration_data: any;
  @Input() state_data: any;
  @Input() self_search: boolean = true;

  @Output() onNextItem = new EventEmitter<any>();
  @Output() onBack = new EventEmitter<any>();
  @Output() onMonthChange = new EventEmitter<number | null>();
  // Re-emit row action events (e.g., niyatDeactivateBtn) from SmartTable to parent (Dashboard)
  @Output() tableRecord = new EventEmitter<any>();

  // Component state
  columnsHeader: any[] = [];
  tableData: any[] = [];
  searchList: any[] = [];
  totalRecords: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  alltogether:number=40000; // >0 then apply
  searchText: string = '';
  previousSearchText: string = '';
  searchPlaceholder: string = 'Search';
  searchControl = new FormControl();
  
  self_id: number = 0;
  parent_id: number = 0;
  current_api_type: string = '';
  // UI flags for child smart-table actions
  showCenterFocus: boolean = false;
  showQrCodeScan: boolean = false;
  showCenterFocusInfo: boolean = false;
  // Smart-table mode: server-side for Niyat rows; client-side for aggregates
  isServerSide: boolean = false;
  // request guard
  private isPageLoading: boolean = false;
  // Deduplicate successive identical loads (same api, ids, dates, page, search)
  private lastRequestKey: string = '';
  // If a date change arrives while a request is in-flight, queue a reload
  private pendingReload: boolean = false;
  
  private flow_rule = [
    { tab_name: 'jamiat', flow: ['getJamiatActiveNiyatList', 'getJamaatActiveNiyatList', 'getNiyatListV2'] },
    { tab_name: 'jamaat', flow: ['getJamaatActiveNiyatList', 'getNiyatListV2'] },
    { tab_name: 'umoor', flow: ['getUmoorActiveNiyatList', 'getNiyatListV2'] },
    { tab_name: 'Niyat', flow: ['getNiyatListData', 'getNiyatListV2'] },
    { tab_name: 'department', flow: ['getDepartmentActiveNiyatList', 'getNiyatListV2'] }
  ];

  // Central mapping for the first column header for aggregate levels
  private readonly columnHeaderMap: { [key: string]: string } = {
    getNiyatListData: 'Niyat',
    getJamiatActiveNiyatList: 'Jamiat',
    getJamaatActiveNiyatList: 'Jamaat',
    getUmoorActiveNiyatList: 'Umoor',
    getDepartmentActiveNiyatList: 'Department'
  };

  constructor(
    private dashboardService: DashboardService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Defer initialization to ngOnChanges when inputs are bound to avoid double calls
    this.searchControl = new FormControl(this.searchText);
    this.searchControl.valueChanges.subscribe(value => {
      this.onSearch(value, false);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Fast-path: if only date range changed in filteration_data (no structural flow change),
    // then reload with existing state to avoid re-initializing the whole flow.
    if (changes.filteration_data && changes.filteration_data.previousValue && changes.filteration_data.currentValue) {
      const prev = changes.filteration_data.previousValue;
      const curr = changes.filteration_data.currentValue;
      const prevStart = prev?.startDate ? new Date(prev.startDate).getTime() : null;
      const prevEnd = prev?.endDate ? new Date(prev.endDate).getTime() : null;
      const currStart = curr?.startDate ? new Date(curr.startDate).getTime() : null;
      const currEnd = curr?.endDate ? new Date(curr.endDate).getTime() : null;
      const dateChanged = (prevStart !== currStart) || (prevEnd !== currEnd);
      // Do not use fast-path on back navigation; let initComponent handle full restore
      const isBackNav = !!curr?.__back_nav;
      if (dateChanged && !isBackNav) {
        this.filteration_data = curr;
        if (curr.selected_month !== undefined) {
          this.state_data = this.state_data || {};
          this.state_data.selected_month = curr.selected_month;
        }
        console.log('[TableAndSearch] ngOnChanges:date-fastpath', {
          from: { start: prevStart, end: prevEnd },
          to: { start: currStart, end: currEnd },
          api: this.current_api_type
        });
        // If a request is in-flight, queue a reload and return
        if (this.isPageLoading) {
          this.pendingReload = true;
          return;
        }
        // Allow fresh request: clear last signature
        this.lastRequestKey = '';
        // Ensure API type reflects current flow for aggregates before calling
        if (this.state_data?.tab_name) {
          const tab_flow_rule = this.flow_rule.find(r => r.tab_name === this.state_data.tab_name);
          const idx = (this.self_id || this.getSelfIdFromParent(this.state_data.tab_name, this.parent_id)) - 1;
          if (tab_flow_rule && idx >= 0) {
            this.current_api_type = tab_flow_rule.flow[idx] || this.current_api_type;
          }
        }
        // If API type still isn't resolved (e.g., first paint on a tab), run full init
        if (!this.current_api_type) {
          this.initComponent();
        } else {
          this.loadData();
          this.saveState();
        }
        return;
      }
    }
    if (changes.filteration_data || changes.state_data || changes.self_search) {
      this.initComponent();
    }
  }

  private initComponent(): void {
    let flow_item = null;
    const tab_name = this.state_data?.tab_name;

    if (!tab_name) {
      return; // Not ready to initialize
    }

    const stored_flow = this.getStoredFlow(tab_name);
    const tab_flow_rule = this.flow_rule.find(r => r.tab_name === tab_name);
    if (!tab_flow_rule) { this.handleBack(); return; }

    if (this.self_search && stored_flow.length > 0) {
      // Restore the deepest item from the stored flow
      flow_item = stored_flow.reduce((prev, current) => (prev.self_id > current.self_id) ? prev : current);
      this.self_id = flow_item.self_id;
      this.parent_id = flow_item.parent_id;
      this.current_api_type = tab_flow_rule.flow[this.self_id - 1 ]; // index is 1 minus the number
    } else {
      // Determine current level from parent using rule: self_id = parent_id + 1
      this.parent_id = (this.state_data.parent_id !== undefined && this.state_data.parent_id !== null)
        ? this.state_data.parent_id
        : -1; // root sentinel so self_id becomes 0
      this.self_id = this.getSelfIdFromParent(tab_name, this.parent_id);
      this.current_api_type = tab_flow_rule.flow[this.self_id -1]; // index is 1 minus the number
      if (!this.current_api_type) { this.handleBack(); return; }

      // Try to find an existing state for this level
      flow_item = stored_flow.find(f => f.self_id === this.self_id) || null;
    }

    if (flow_item) {
      // Restore state from the found flow item, but preserve incoming overrides (e.g., niyat_status)
      const incomingState = this.state_data || {};
      this.state_data = { ...flow_item.state_data, ...incomingState };
      // Preserve incoming date range from parent input, but keep other restored filters
      const incoming = this.filteration_data || {};
      const isBackNav = !!incoming.__back_nav;
      if (isBackNav) {
        // On back navigation, fully restore the parent's saved filters (including month and date range)
        this.filteration_data = { ...flow_item.filteration_data };
        // Clean transient flag if it leaked
        if ((this.filteration_data as any).__back_nav !== undefined) {
          delete (this.filteration_data as any).__back_nav;
        }
      } else {
        // Prefer incoming dates when properties are present (even if falsy-like),
        // falling back to stored flow's dates otherwise.
        const hasIncomingStart = Object.prototype.hasOwnProperty.call(incoming, 'startDate');
        const hasIncomingEnd = Object.prototype.hasOwnProperty.call(incoming, 'endDate');
        const mergedFilter = {
          ...flow_item.filteration_data,
          ...(hasIncomingStart ? { startDate: incoming.startDate } : {}),
          ...(hasIncomingEnd ? { endDate: incoming.endDate } : {}),
        };
        this.filteration_data = mergedFilter;
        console.log('[TableAndSearch] initComponent:merged-dates', {
          fromFlow: {
            startDate: flow_item?.filteration_data?.startDate,
            endDate: flow_item?.filteration_data?.endDate,
          },
          incoming: {
            hasIncomingStart,
            hasIncomingEnd,
            startDate: incoming?.startDate,
            endDate: incoming?.endDate,
          },
          result: {
            startDate: this.filteration_data?.startDate,
            endDate: this.filteration_data?.endDate,
          }
        });
        }
        // Clean transient flag if present
        if ((this.filteration_data as any).__back_nav !== undefined) {
          delete (this.filteration_data as any).__back_nav;
        }
        this.parent_id = flow_item.parent_id;
        this.self_id = flow_item.self_id;
        this.current_api_type = tab_flow_rule.flow[this.self_id -1]; // index is 1 minus the number
        // On back navigation, emit last selected_month if available; otherwise emit null
        if (isBackNav) {
          const monthToEmit = (this.state_data && this.state_data.selected_month !== undefined)
            ? this.state_data.selected_month
            : (this.filteration_data && this.filteration_data.selected_month !== undefined)
              ? this.filteration_data.selected_month
              : null;
          this.onMonthChange.emit(monthToEmit);
        }
      } else {
      // If starting a new flow for a restricted role, apply filters
      if (this.state_data.user_role === 'Aamil' || this.state_data.user_role === 'Muavin Aamil' || this.state_data.user_role === 'Khidmat Ramadaniyah') {
        // Enforce jamaat scoping from canonical key used across the app
        const jamaatIdStr = this.localStorageService.get('JamaatId');
        if (jamaatIdStr) {
          try {
            this.filteration_data.jamaat_id = JSON.parse(jamaatIdStr);
          } catch {
            this.filteration_data.jamaat_id = +jamaatIdStr;
          }
        }
      }

        // If no flow item, reset pagination and search
        this.state_data.page_number = 0;
        this.state_data.page_size = 10;
        this.state_data.search_text = '';
    }

    // Always sync component state from state_data
    this.pageNumber = this.state_data.page_number || 0;
    this.pageSize = this.state_data.page_size || 10;
    this.searchText = this.state_data.search_text || '';
    this.previousSearchText = this.state_data.search_text || '';
    this.searchControl.setValue(this.searchText, { emitEvent: false });
    // Restore total records to keep paginator length stable until data refreshes
    if (this.state_data.total_records !== undefined) {
      this.totalRecords = this.state_data.total_records;
    }
    // If incoming filteration has a selected_month, reflect it into state for persistence and emission
    if (this.filteration_data && this.filteration_data.selected_month !== undefined) {
      this.state_data.selected_month = this.filteration_data.selected_month;
    }

    // Emit month only when we're restoring/hydrating our own flow (self_search=true)
    // to avoid echoing back the parent's month change and creating a feedback loop.
    if (this.self_search && this.state_data.selected_month !== undefined) {
      this.onMonthChange.emit(this.state_data.selected_month);
    }

    console.log('[TableAndSearch] initComponent:header-resolution', { 
      current_api_type: this.current_api_type, 
      firstHeader: this.getAggregateFirstColumnHeader(), 
      isServerSide: this.isServerSide 
    });

    // Force a fresh request on explicit init to capture backend changes even when
    // request parameters (dates, ids, page, search) haven't changed.
    this.lastRequestKey = '';
    this.loadData();
    this.saveState();
    console.log('[TableAndSearch] initComponent:end', {
      self_id: this.self_id,
      parent_id: this.parent_id,
      current_api_type: this.current_api_type,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchText: this.searchText
    });
  }

  private getSelfIdFromParent(tab_name: string, parent_id: number): number {
    // Enforce rule: self_id is always parent_id + 1.
    // Root sentinel parent_id = -1 should yield first level self_id = 1 (so indexing with self_id - 1 works)
    if (parent_id === undefined || parent_id === null) return 1;
    if (parent_id === -1) return 1;
    return parent_id + 1;
  }

  private loadData(): void {
    // Build event date range expected by service
    const event = {
      startDate: this.filteration_data?.startDate,
      endDate: this.filteration_data?.endDate
    };

    // Map api_type to service 'name' switch to ensure correct server filtering
    const name = this.mapServiceName(this.current_api_type);

    const status = this.state_data?.niyat_status ?? 4;
    // Derive ID parameters based on current name mapping and drill-down context
    // The service interprets the first id param as a generic id (e.g., jamaatId/umoorId/departmentId/niyatQuestId)
    // and the second id param specifically as jamiatId when required.
    let id1 = 0; // maps to 'jamaatId' param in service signature, used generically per name
    let id2 = 0; // maps to 'jamiatId' param in service signature
    switch (name) {
      case 'Umoor':
        id1 = this.filteration_data?.umoor_id ?? 0; // service will set body.umoorId = id1
        break;
      case 'Department':
        id1 = this.filteration_data?.department_id ?? 0; // service will set body.departmentId = id1
        break;
      case 'niyatQuestion':
        id1 = this.filteration_data?.niyatQuestId ?? 0; // service will set body.niyatQuestId = id1
        break;
      case 'Jamaat':
        id1 = this.filteration_data?.jamaat_id ?? 0; // service will set body.jamaatId = id1
        id2 = this.filteration_data?.jamiat_id ?? 0; // service will also set body.jamiatId = id2
        break;
      case 'Jamiat': // Jamiat aggregate level
        id1 = this.filteration_data?.jamiat_id ?? 0; // service will also set body.jamiatId = id2
        break;
      case 'niyatList':
        id1 = this.filteration_data?.jamaat_id ?? 0; // service will set body.jamaatId = id1
        id2 = this.filteration_data?.jamiat_id ?? 0; // service will also set body.jamiatId = id2
        break;
      default:
        id2 = this.filteration_data?.jamiat_id ?? 0; // service will set body.jamiatId = id2
        break;
    }

    // Build a signature to dedupe identical consecutive requests
    const reqKey = JSON.stringify({
      api: this.current_api_type,
      name,
      status,
      ids: {
        id1,
        id2,
        umoor_id: this.filteration_data?.umoor_id ?? 0,
        department_id: this.filteration_data?.department_id ?? 0,
        niyatQuestId: this.filteration_data?.niyatQuestId ?? 0,
      },
      page: { number: this.pageNumber + 1, size: this.pageSize },
      search: this.searchText || '',
      dates: {
        start: event.startDate ? new Date(event.startDate).getTime() : null,
        end: event.endDate ? new Date(event.endDate).getTime() : null,
      }
    });
    if (reqKey === this.lastRequestKey) {
      console.log('[TableAndSearch] loadData:deduped-skip');
      return;
    }
    this.lastRequestKey = reqKey;
    console.log('[TableAndSearch] loadData:request', {
      api: this.current_api_type,
      name,
      status,
      ids: {
        id1,
        id2,
        umoor_id: this.filteration_data?.umoor_id ?? 0,
        department_id: this.filteration_data?.department_id ?? 0,
        niyatQuestId: this.filteration_data?.niyatQuestId ?? 0,
      },
      page: { number: this.pageNumber + 1, size: this.pageSize },
      search: this.searchText,
      event
    });
    // if(name == 'niyatList'){
    //   getActiveNiyatList() {
    //     this.isServerSide = true;
    //     this.tableType = 'niyatJamitList';
    //     // Guard: avoid overlapping requests
    //     if (this.isPageLoading) { return; }
    //     this.isPageLoading = true;
    //     const requestPage = (this.pageNumber ?? 0) + 1; // API expects 1-based page index
    //     this.dashboardservice.getActiveChangeList(this.dateDetails, 'Jamaat' , 'getNiyatListV2', this.niyatStatus, this.search, this.jamaatId , this.jamiatId, requestPage, this.pageSize)
    //     .pipe(takeUntil(this.destroy$), finalize(() => { this.isPageLoading = false; }))
    //     .subscribe((data: any) => {
    //       this.dynamicColoumnsAction();
    //       this.getListData = data.data;
    //       this.totalRecords = data.pagination.totalRecords;
    //       this.searchList  = data.data.filter((value:any, index:any, self:any) => index === self.findIndex((t:any) => (t.itsId === value.itsId)));
    //       // this.centerFocusLabel = 'niyat';
    //     }); 
    //   }
    //   return
    // }
    // Special handling for explicit Niyat list endpoint as per flows
    if (this.current_api_type === 'getNiyatListV2') {
      // Ensure search filters only ITS ID digits for Niyat list
      const search = (this.searchText || '').replace(/\D/g, '');
      if (search !== this.searchText) {
        this.searchText = search;
      }
      if (this.isPageLoading) { return; }
      this.isPageLoading = true;
      console.log('[TableAndSearch] loadData:getNiyatListV2:calling', { search: this.searchText });
      this.dashboardService.getNiyatList(
        event,
        'NiyatList', // service uses 'NiyatList' to default search to '' for this endpoint
        'getNiyatListV2',
        status,
        search,
        this.filteration_data?.jamaat_id ?? 0,
        this.filteration_data?.jamiat_id ?? 0,
        this.filteration_data?.umoor_id ?? 0,
        this.filteration_data?.department_id ?? 0,
        this.filteration_data?.niyatQuestId ?? 0,
        this.pageNumber + 1,
        this.pageSize
      ).subscribe(response => {
        this.tableData = response?.data;
        this.totalRecords = response?.pagination?.totalRecords ?? 0;
        console.log('[TableAndSearch] loadData:getNiyatListV2:response', { rows: this.tableData?.length || 0, totalRecords: this.totalRecords });
        // Build unique ITS list for SmartSearch suggestions
        const seen = new Set<string>();
        const itsOnly: any[] = [];
        (this.tableData || []).forEach((row: any) => {
          const its = row?.itsId ? String(row.itsId) : '';
          if (its && !seen.has(its)) {
            seen.add(its);
            itsOnly.push({ itsId: its });
          }
        });
        this.searchList = itsOnly;
        this.setDynamicColumns();
        console.log('[TableAndSearch] setDynamicColumns:after-niyat', {
          current_api_type: this.current_api_type,
          firstHeader: this.columnsHeader?.[0]?.header,
          isServerSide: this.isServerSide
        });
        // Persist updated totals and page count in flow state
        this.state_data.total_records = this.totalRecords;
        this.state_data.page_count = Math.ceil((this.totalRecords || 0) / (this.pageSize || 10));
        this.saveState();
        this.isPageLoading = false;
        if (this.pendingReload) {
          // Consume the queued reload with the latest filteration_data
          this.pendingReload = false;
          this.lastRequestKey = '';
          this.loadData();
        }
      }, _err => {
        this.isPageLoading = false;
        if (this.pendingReload) {
          this.pendingReload = false;
          this.lastRequestKey = '';
          this.loadData();
        }
      });
      return;
    }

    if (this.isPageLoading) { return; }
    this.isPageLoading = true;
    this.dashboardService.getActiveChangeList(
      event,
      name,
      this.current_api_type,
      status,
      this.searchText,
      id1,
      id2,
      this.filteration_data?.umoor_id ?? 0,
      this.filteration_data?.department_id ?? 0,
      this.filteration_data?.niyatQuestId ?? 0,
      this.pageNumber + 1,
      this.alltogether > 0 ? this.alltogether : this.pageSize
    ).subscribe(response => {
      this.tableData = response.data;
      this.totalRecords = response?.pagination?.totalRecords ?? (this.tableData?.length || 0);
      // For non-Niyat lists, keep SmartSearch suggestions equal to tableData
      this.searchList = this.tableData || [];
      this.setDynamicColumns();
      // Persist updated totals and page count in flow state
      this.state_data.total_records = this.totalRecords;
      this.state_data.page_count = Math.ceil((this.totalRecords || 0) / (this.pageSize || 10));
      this.saveState();
      this.isPageLoading = false;
      if (this.pendingReload) {
        this.pendingReload = false;
        this.lastRequestKey = '';
        this.loadData();
      }
    }, _err => {
      this.isPageLoading = false;
      if (this.pendingReload) {
        this.pendingReload = false;
        this.lastRequestKey = '';
        this.loadData();
      }
    });
  }

  private mapServiceName(apiType: string): string {
    switch (apiType) {
      case 'getUmoorActiveNiyatList': return 'Umoor';
      case 'getDepartmentActiveNiyatList': return 'Department';
      case 'getJamiatActiveNiyatList': return 'Jamiat';
      case 'getJamaatActiveNiyatList': return 'Jamaat';
      case 'getNiyatListData': return 'niyatQuestion';
      case 'getNiyatListV2': return 'Jamaat'; // use Jamaat mapping so id1/id2 are derived correctly
      default: return 'nolabel';
    }
  }

    

  private saveState(): void {
    const key = this.state_data.tab_name;
    let stored_flow = this.getStoredFlow(key);

    // Ensure latest pagination/search totals are captured in the flow state
    this.state_data.page_number = this.pageNumber;
    this.state_data.page_size = this.pageSize;
    this.state_data.search_text = this.searchText;
    this.state_data.total_records = this.totalRecords;
    this.state_data.page_count = Math.ceil((this.totalRecords || 0) / (this.pageSize || 10));
    // Ensure month id is persisted in state_data for restore emissions
    if (this.filteration_data && this.filteration_data.selected_month !== undefined) {
      this.state_data.selected_month = this.filteration_data.selected_month;
    }

    const flow_item = {
        parent_id: this.parent_id,
        self_id: this.self_id,
        state_data: this.state_data,
        filteration_data: this.filteration_data
    };

    const existing_index = stored_flow.findIndex(f => f.self_id === this.self_id);
    if (existing_index > -1) {
        stored_flow[existing_index] = flow_item;
    } else {
        stored_flow.push(flow_item);
    }

    // Delete child items
    stored_flow = stored_flow.filter(f => f.self_id <= this.self_id);

    this.localStorageService.set(key, JSON.stringify(stored_flow));
  }

  private getStoredFlow(tab_name: string): any[] {
    const data = this.localStorageService.get(tab_name);
    return data ? JSON.parse(data) : [];
  }

  handleBack(): void {
    let stored_flow = this.getStoredFlow(this.state_data.tab_name);
    stored_flow = stored_flow.filter(f => f.self_id < this.self_id);
    this.localStorageService.set(this.state_data.tab_name, JSON.stringify(stored_flow));

    // Guard: when no parent exists, emit root sentinel and stop
    if (!stored_flow.length) {
      this.onBack.emit({
        tab_name: this.state_data.tab_name,
        parent_id: -1,
        filteration_data: null
      });
      return;
    }

    // Find the immediate parent (max self_id among remaining items)
    const parent_flow = stored_flow.reduce((prev, current) => (prev.self_id > current.self_id) ? prev : current);
    this.onBack.emit({
      tab_name: this.state_data.tab_name,
      // For rule self_id = parent_id + 1, parent should receive (parent_self_id - 1)
      parent_id: parent_flow.self_id - 1,
      filteration_data: null
    });
  }

  // Re-emit SmartTable row events for actions like deactivate, while preserving existing drill-down behavior
  handleTableRecord(event: any): void {
    // If event contains row action keys, bubble up to Dashboard
    if (event?.niyatDeactivateBtn || event?.confirmNiyatDeactivateBtn) {
      this.tableRecord.emit(event);
      return;
    }
    // Otherwise treat it as a drill-down/navigation event
    this.handleNext(event);
  }
 
  handleNext(event: any): void {
    console.log('[TableAndSearch] handleNext:niyat', event);
    // Niyat information redirect action
    if (event?.centerFocusinfo) {
      
      const row = event.centerFocusinfo;
      const niyatId = row?.niyatId || row?.id;
      if (!niyatId) { return; }
      try {
        const encodedId = btoa(String(niyatId));
        // Persist current table state before navigation
        this.saveState();
        this.router.navigate(['/niyat-information', encodedId]);
      } catch (_e) {
        // Fallback without encoding if encoding fails unexpectedly
        this.router.navigate(['/niyat-information', String(niyatId)]);
      }
      return;
    }

    // SmartTable emits different payload shapes; prefer drill events
    const row = event?.centerFocus || event;
    if (!row || !row.id) { return; }

    const next_filteration_data = { ...this.filteration_data };
    const flow_rule_for_tab = this.flow_rule.find(r => r.tab_name === this.state_data.tab_name);
    if (!flow_rule_for_tab) {
      console.error(`No flow rule found for tab: ${this.state_data.tab_name}`);
      return;
    }
    const current_flow = flow_rule_for_tab.flow[this.self_id -1]; // index is 1 minus the number 

    if (current_flow === 'getJamiatActiveNiyatList') next_filteration_data.jamiat_id = row.id;
    if (current_flow === 'getJamaatActiveNiyatList') next_filteration_data.jamaat_id = row.id;
    if (current_flow === 'getUmoorActiveNiyatList') next_filteration_data.umoor_id = row.id;
    if (current_flow === 'getDepartmentActiveNiyatList') next_filteration_data.department_id = row.id;
    if (current_flow === 'getNiyatListData') next_filteration_data.niyatQuestId = row.id;
    if (current_flow === 'getNiyatListV2') next_filteration_data.niyat_id = row.id;

    this.onNextItem.emit({
      tab_name: this.state_data.tab_name,
      // For rule self_id = parent_id + 1, next level should receive parent_id = current self_id
      parent_id: this.self_id,
      filteration_data: next_filteration_data
    });
  }
  
  onPageChange(event: any): void {
    // Only act when a real change occurs
    const changed = (event.pageIndex !== this.pageNumber) || (event.pageSize !== this.pageSize);
    if (!changed) { return; }
    const prevSize = this.pageSize;
    console.log('[TableAndSearch] onPageChange', { from: { pageNumber: this.pageNumber, pageSize: this.pageSize }, event, current_api_type: this.current_api_type });
    // Apply new page size first
    this.pageSize = event.pageSize;
    // If page size changed, reset to first page
    this.pageNumber = (event.pageSize !== prevSize) ? 0 : event.pageIndex;
    this.state_data.page_number = this.pageNumber;
    this.state_data.page_size = this.pageSize;
    if (this.isServerSide) {
      this.loadData();
      this.setDynamicColumns();
    }
    this.saveState();
  }

  onSearch(searchText: any, isEnter?: boolean): void {
    // SmartSearch emits arrays (selected option) or empty arrays; also support raw strings
    let nextSearch = '';
    if (Array.isArray(searchText)) {
      if (!searchText.length || searchText[0] === '' || searchText[0] === undefined || searchText[0] === null) {
        nextSearch = '';
      } else {
        const first = searchText[0];
        if (typeof first === 'string' || typeof first === 'number') {
          nextSearch = String(first);
        } else if (typeof first === 'object') {
          nextSearch = first.name || first.itsId || first.niyatId || first.question_eng || first.itemTitle || '';
        }
      }
    } else if (typeof searchText === 'string' || typeof searchText === 'number') {
      nextSearch = String(searchText);
    }

    // For Niyat list, enforce search on ITS ID only (digits)
    if (this.current_api_type === 'getNiyatListV2') {
      nextSearch = (nextSearch || '').replace(/\D/g, '');
      // next search is empty or 8 digit its then only search
      if (nextSearch.length === 8 || nextSearch.length === 0) {
        console.log('nextSearch', nextSearch.length);
        console.log('previousSearchText', this.previousSearchText.length);
        console.log('isEnter', isEnter);
        if((this.previousSearchText.length === nextSearch.length && !isEnter)
        && !(this.previousSearchText.length === 8 && this.previousSearchText != nextSearch)  ){
          return;
        }
        this.searchText = nextSearch;
        this.previousSearchText = nextSearch;
      }else{
        this.searchText = '';
        return;
      }
    }else{
      this.searchText = nextSearch;
    }
    this.pageNumber = 0;
    this.state_data.search_text = this.searchText;
    this.state_data.page_number = this.pageNumber;
    this.loadData();
    this.saveState();
  }

  emptySearch(): void {
    this.searchControl.setValue('', { emitEvent: false });
    this.onSearch('', false);
  }

  onEnter(eventOrValue: any, isEnter: boolean) {
    if (typeof eventOrValue === 'object' && eventOrValue.target) {
      console.log('eventOrValue', eventOrValue.target.value);
      if(eventOrValue.target.value==='Enter'){
        this.onSearch(eventOrValue.target.value, true);
        
      }else{
        this.onSearch(eventOrValue.target.value, false);
      }
    } else {
      console.log('eventOrValue ---', eventOrValue);
      this.onSearch(eventOrValue, isEnter);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'Enter', 'Shift', 'Control', 'Alt', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete'];
    // if (allowedKeys.includes(event.key) || /^\d$/.test(event.key)) {
    //   return;
    // }
    // event.preventDefault();
    return;
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
  
    // Allow: Backspace, Delete, Arrow keys
    if ([8, 46, 37, 39].includes(charCode)) {
      return;
    }
  
    // Block if not a number (0–9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  private setDynamicColumns(): void {
    let columns: any[] = [];
    // Default flags
    this.showCenterFocus = false;
    this.showQrCodeScan = false;
    this.showCenterFocusInfo = false;
    // Default to client-side; will enable server-side for Niyat list below
    this.isServerSide = false;
    this.searchPlaceholder = 'Search';
    const column_name = this.getAggregateFirstColumnHeader();

    switch (this.current_api_type) {
      case 'getNiyatListData':        
      case 'getJamiatActiveNiyatList':          
      case 'getJamaatActiveNiyatList':        
      case 'getUmoorActiveNiyatList':        
      case 'getDepartmentActiveNiyatList':
        // Use a unique columnDef per api type to ensure Angular Material rebuilds the header when switching flows
        columns = [
          { columnDef: `name_${this.current_api_type}`, header: column_name, dataName: (row: any) => `${row.name || '-'}` },
          { columnDef: 'totalNiyat', header: 'Total NIYATS', dataName: (row: any) => `${row.statusCountDto.totalNiyat || 0}` },
          { columnDef: 'active', header: 'ACTIVE NIYATS', dataName: (row: any) => `${row.statusCountDto.active || '-'}` },
          { columnDef: 'completed', header: 'Completed Niyats', dataName: (row: any) => `${row.statusCountDto.completed || '-'}` },
          { columnDef: 'pending', header: 'Approval Pending', dataName: (row: any) => `${row.statusCountDto.approvalPending || '-'}` },
          { columnDef: 'deactivated', header: 'Deactivated', dataName: (row: any) => `${row.statusCountDto.deactivated || '-'}` },
          { columnDef: 'action', header: 'Action', dataName: (_row: any) => '-' },
        ];
        this.showCenterFocus = true; // enable drill-down on aggregate rows
        break;
      case 'getNiyatListV2':
        columns = [
          // { columnDef: 'niyatName', header: 'Niyat', dataName: (row: any) => `${row.niyatName || row.name || '-'}` },
          { columnDef: 'niyatId', header: 'Niyat ID', dataName: (row: any) => `${row.niyatId ?? row.id ?? '-'}` },
          { columnDef: 'niyatDate', header: 'Niyat Date', dataName: (row: any) => `${row.niyatDate ? new Date(row.niyatDate).toLocaleDateString() : '-'}` },
          { columnDef: 'questionI', header: 'Niyat Question', dataName: (row: any) => `${row.niyatQuestionEnglish	 || row.niyatQuestName || row.question || '-'}` },
          // { columnDef: 'ts', header: 'Niyat Date', dataName: (row: any) => `${row.createdAt ? new Date(row.createdAt).toLocaleString() : (row.ts ? new Date(row.ts).toLocaleString() : '-')}` },
          { columnDef: 'itsId', header: 'ITS ID', dataName: (row: any) => `${row.itsId || '-'}` },
          { columnDef: 'jamiatName', header: 'Jamiat', dataName: (row: any) => `${row.jamiat	 || '-'}` },
          { columnDef: 'jamaatName', header: 'Jamaat', dataName: (row: any) => `${row.jamaat	 || '-'}` },
          { columnDef: 'departmentName', header: 'Department', dataName: (row: any) => `${row.departmentName		 || '-'}` },
          { columnDef: 'umoorName', header: 'Umoor', dataName: (row: any) => `${row.umoorName		 || '-'}` },
          { columnDef: 'status', header: 'Status', dataName: (row: any) => `${this.displayStatus(row.status, row)}` },
          { columnDef: 'action', header: 'Action', dataName: (_row: any) => '-' },
        ];
        this.showQrCodeScan = true; // show QR actions on niyat rows
        this.showCenterFocusInfo = true; // enable info redirect for niyat rows
        this.isServerSide = true; // enable server-side pagination for Niyat rows
        this.searchPlaceholder = 'Search ITS ID';
        break;
      default:
        columns = [{ columnDef: 'name', header: 'Name', dataName: (row: any) => `${row.name}` }];
        break;
    }
    this.columnsHeader = columns;
  }

  private getAggregateFirstColumnHeader(): string {
    return this.columnHeaderMap[this.current_api_type] || 'Name';
  }

  private displayStatus(status: any, data: any): string {
    if (status === null || status === undefined || status === '') return '-';
    // Coerce numeric strings
    if (typeof status === 'string' && /^\d+$/.test(status)) {
      status = parseInt(status, 10);
    }
    if (typeof status === 'number') {
      // Align with FMB mapping for consistent colors
      switch (status) {
        case 1: 
        if(data.isDeactivationRequested){
          return 'DEACTIVATION REQUESTED';
        }
        return 'ACTIVE';
        case 2: return 'PENDING';
        case 3: return 'COMPLETED';
        case 0: return 'DEACTIVATED';
        default: return '-';
      }
    }
    // If already a string, normalize to uppercase and replace underscores for SmartTable's classes
    return String(status).toUpperCase().replace(/_/g, ' ');
  }
}
