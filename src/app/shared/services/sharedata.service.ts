import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DashboardState {
  selectedTabIndex?: number;
  labelTab?: string;
  centerFocusLabel?: string; // 'jamiat' | 'jamaat' | 'niyat' | 'umoor' | 'department' | 'Niyat'
  tableType?: string; // 'all' | 'JamaatList' | 'niyatDefault' | 'niyatJamitList'
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  dateDetails?: any;
  fetchJaamat?: boolean;
  // IDs at current drill level (optional)
  jamaatId?: any;
  jamiatId?: any;
  // Per-table state snapshot keyed by label:centerFocus:tableType
  perTableState?: { [key: string]: { pageNumber: number; pageSize: number; search: string } };
  // Linear drill navigation stack
  drillStack?: DrillState[];
  isNavigatingFromDashboard?: boolean;
}

export interface DrillState {
  selectedTabIndex: number;
  labelTab: string;
  centerFocusLabel: string;
  tableType: string;
  pageNumber: number;
  pageSize: number;
  search: string;
  dateDetails: any;
  fetchJaamat: boolean;
  jamaatId?: any;
  jamiatId?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SharedataService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  // Store selected tab index
  private selectedTabIndexSource = new BehaviorSubject<number | null>(null);
  currentSelectedTabIndex = this.selectedTabIndexSource.asObservable();

  // Store label tab
  private labelTabSource = new BehaviorSubject<string | null>(null);
  currentLabelTab = this.labelTabSource.asObservable();
  
  // Store selected month value
  public selectedMonthValueSource = new BehaviorSubject<number | null>(null);
  currentSelectedMonthValue = this.selectedMonthValueSource.asObservable();

  // Centralized Dashboard State (persisted in sessionStorage)
  private readonly DASHBOARD_STATE_KEY = 'dashboard_state';

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  // Set selected tab index
  setSelectedTabIndex(index: number) {
    this.selectedTabIndexSource.next(index);
  }

  // Set label tab
  setLabelTab(label: string) {
    this.labelTabSource.next(label);
  }
  
  // Set selected month value
  setSelectedMonthValue(value: number) {
    this.selectedMonthValueSource.next(value);
  }

  // Clear selected month value (e.g., on logout)
  clearSelectedMonthValue() {
    this.selectedMonthValueSource.next(null);
  }

  // Dashboard state helpers
  setDashboardState(state: DashboardState | null) {
    if (state) {
      sessionStorage.setItem(this.DASHBOARD_STATE_KEY, JSON.stringify(state));
    } else {
      sessionStorage.removeItem(this.DASHBOARD_STATE_KEY);
    }
  }

  getDashboardState(): DashboardState | null {
    try {
      const raw = sessionStorage.getItem(this.DASHBOARD_STATE_KEY);
      return raw ? JSON.parse(raw) as DashboardState : null;
    } catch {
      return null;
    }
  }

  // Drill stack helpers
  pushDrillState(state: DrillState) {
    const current = this.getDashboardState();
    let next: DashboardState;
    if (current) {
      next = { ...current };
    } else {
      // Initialize a minimal dashboard state from the provided drill state
      next = {
        selectedTabIndex: state.selectedTabIndex,
        labelTab: state.labelTab,
        centerFocusLabel: state.centerFocusLabel,
        tableType: state.tableType,
        pageNumber: state.pageNumber,
        pageSize: state.pageSize,
        search: state.search,
        dateDetails: state.dateDetails,
        fetchJaamat: state.fetchJaamat,
        jamaatId: state.jamaatId,
        jamiatId: state.jamiatId,
        perTableState: {}
      };
    }
    const stack = next.drillStack ? [...next.drillStack] : [];
    stack.push(state);
    next.drillStack = stack;
    this.setDashboardState(next);
  }

  popDrillState(): DrillState | null {
    const current = this.getDashboardState();
    if (!current?.drillStack || current.drillStack.length === 0) {
      return null;
    }
    const stack = [...current.drillStack];
    const popped = stack.pop()!;
    const next: DashboardState = { ...current, drillStack: stack };
    this.setDashboardState(next);
    return popped;
  }

  peekDrillState(): DrillState | null {
    const current = this.getDashboardState();
    if (!current?.drillStack || current.drillStack.length === 0) {
      return null;
    }
    return current.drillStack[current.drillStack.length - 1];
  }

  clearDrillStack() {
    const current = this.getDashboardState();
    if (!current) { return; }
    if (!current.drillStack || current.drillStack.length === 0) { return; }
    const next: DashboardState = { ...current, drillStack: [] };
    this.setDashboardState(next);
  }

  clearDashboardState() {
    this.setDashboardState(null);
  }

}
