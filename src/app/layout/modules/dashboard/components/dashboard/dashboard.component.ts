import { LocalStorageService } from './../../../../../auth/service/storage/localstorage.service';
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil, finalize } from "rxjs/operators";
import { DashboardService } from "../../service/dashboard.service";
import { MatDialog } from '@angular/material/dialog';
import { SharedataService } from 'src/app/shared/services/sharedata.service';
import { log } from 'console';
import { ApproverCatalogueService } from '../../../approver-catalogue/service/approver-catalogue.service';
import { ToastrService } from 'ngx-toastr';
import { SmartDialogDeleteComponent } from 'src/app/shared/componets/smart-dialog/smart-dialog-delete.component';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {

  niyatStatusList$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  selectedIndex$: Subject<any> = new Subject<any>();
  rolename$: Subject<any> = new Subject<any>();
  getChartData$: Subject<any> = new Subject<any>();
  
  private destroy$ = new Subject();

  niyatStatus: number = 4;
  dateDetails: any;
  labelTab: any = 'Jamiat';
  selectedTabIndex: any = 1;
  niyatStatusName: string = 'Total';
  rolename: any;
  userRole: any;
  onLoading: boolean = true;
  // Suppress initial MatTabGroup selectedTabChange emissions during programmatic selection
  private suppressTabChangeCount: number = 0;
  private suppressNextTabChange: boolean = false;

  // Properties from backup for direct data handling
  getListData: any[] = [];
  searchList: any[] = [];
  columnsHeader: any[] = [];
  centerFocusLabel: string = '';
  isServerSide: boolean = false;

  // Table+Search integration inputs
  tableFilterationData: any = {};
  tableStateData: any = {};
  tableSelfSearch: boolean = true;
  // Track selected month id from MonthSection for table restore coordination
  selectedMonthId: number = 5;
  // Flag to indicate month change originated from Table restore/hydration
  private isMonthChangeFromTable: boolean = false;
  // Control first-time table bootstrap to avoid double calls with initial vs computed dates
  private shouldRestoreOnFirstTableLoad: boolean = false;
  private hasBootstrappedTable: boolean = false;

  redeemTrophiesData = new BehaviorSubject<any>("");
  redeemTrophiesData$ = this.redeemTrophiesData.asObservable();

  constructor(
    private localService: LocalStorageService,
    private dashboardservice: DashboardService,
    public dialog: MatDialog,
    private approverCatservice: ApproverCatalogueService,
    private router: Router,
    private sharedataService: SharedataService,
    private changeDetection: ChangeDetectorRef,
    private toastrservice: ToastrService,
  ) { }

  ngOnInit() {
    const role: any = this.localService.get("role");
    this.userRole = JSON.parse(role);
    // Set a default date range to avoid errors on initial load
    const today = new Date();
    this.dateDetails = {
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0)
    };
    // Restore globally saved niyat status before rendering tabs/charts
    this.restoreGlobalNiyatStatus();
    this.rolesHideTabs(this.userRole);
    this.getNiyatStatus(this.dateDetails);

    // Determine whether to restore last flow or start fresh on first load
    const restoreOnLoad = this.localService.get('dashboard_loaded') === 'true';
    this.shouldRestoreOnFirstTableLoad = restoreOnLoad;
    // Defer table bootstrap to first MonthSection getDate() emission to avoid duplicate calls
    this.localService.set('dashboard_loaded', 'true');
    this.getRedeemTrophiesStat();
  }

  // ===== Table+Search helpers and handlers =====
  private mapTabToFlowKey(label: string): string {
    switch (label) {
      case 'Jamiat': return 'jamiat';
      case 'Jamaat': return 'jamaat';
      case 'Department': return 'department';
      case 'Umoor': return 'umoor';
      case 'Niyat': return 'Niyat';
      default: return 'jamiat';
    }
  }

  private mapTabLabelToIndex(label: string): number {
    // Build effective tab order based on current role and template ngIfs
    const role = this.rolename || this.userRole;
    const tabs: string[] = [];
    // Umoor hidden only for Dept Head
    if (role !== 'Dept Head') {
      tabs.push('Umoor');
    }
    // Jamiat/Jamaat hidden only for Umoor Coordinator
    if (role !== 'Umoor Coordinator') {
      tabs.push((role === 'Aamil' || role === 'Muavin Aamil' || role === 'Khidmat Ramadaniyah') ? 'Jamaat' : 'Jamiat');
    }
    // Department hidden for Umoor Head and Umoor Coordinator
    if (role !== 'Umoor Head' && role !== 'Umoor Coordinator') {
      tabs.push('Department');
    }
    // Niyat always visible
    tabs.push('Niyat');
    const idx = tabs.indexOf(label);
    // Default to the first available tab if label not found
    return idx >= 0 ? idx : 0;
  }

  private refreshTableInputs(self_search: boolean, parent_id: number = 0, filterOverride: any = undefined) {
    const tab_name = this.mapTabToFlowKey(this.labelTab);
    this.tableFilterationData = {
      startDate: this.dateDetails?.startDate,
      endDate: this.dateDetails?.endDate,
      selected_month: this.selectedMonthId,
      ...(filterOverride || {})
    };
    // Do NOT include page_number/page_size/search_text here; let Table restore these from stored flow
    this.tableStateData = {
      tab_name,
      parent_id,
      user_role: this.userRole,
      niyat_status: this.niyatStatus,
      // Provide month id ONLY when restoring/hydrating (self_search=true)
      ...(self_search ? { selected_month: this.selectedMonthId } : {})
    } as any;
    this.tableSelfSearch = self_search;
  }

  // Restore globally saved niyat status (applies across tabs)
  private restoreGlobalNiyatStatus(): void {
    const saved = this.localService.get('niyat_status_global');
    if (saved !== null && saved !== undefined) {
      const parsed = Number(saved);
      if (!isNaN(parsed)) {
        this.niyatStatus = parsed;
        this.syncNiyatStatusNameFromList();
      }
    }
  }

  // Sync selected status name from the latest status list based on current niyatStatus id
  private syncNiyatStatusNameFromList(): void {
    try {
      const list = this.niyatStatusList$.getValue() as any[];
      if (Array.isArray(list) && list.length > 0) {
        const current = list.find((d: any) => d?.id === this.niyatStatus);
        if (current && current.name) {
          this.niyatStatusName = current.name;
        }
      }
    } catch { /* noop */ }
  }

  handleNextItem(event: any) {
    // Drill down to next level from current flow step
    console.log("event", event);
    this.refreshTableInputs(false, event.parent_id, event.filteration_data);
  }

  handleBack(event: any) {
    // Component pruned deeper flow; restore previous deepest
    console.log("event", event);
    // On back, restore last niyat status from parent's stored flow before re-query
    try {
      const key = this.mapTabToFlowKey(this.labelTab);
      const raw = this.localService.get(key);
      if (raw) {
        const stored: any[] = JSON.parse(raw);
        if (Array.isArray(stored) && stored.length > 0) {
          const deepest = stored.reduce((a: any, b: any) => (a.self_id > b.self_id ? a : b));
          const savedStatus = deepest?.state_data?.niyat_status;
          if (savedStatus !== undefined && savedStatus !== null) {
            this.niyatStatus = savedStatus;
            // Persist globally and update toggle highlight
            this.localService.set('niyat_status_global', String(this.niyatStatus));
            this.syncNiyatStatusNameFromList();
          }
        }
      }
    } catch { /* noop */ }
    // Pass a transient flag so Table fully restores parent's saved filteration (month/date)
    this.refreshTableInputs(false, event.parent_id, { __back_nav: true });
  }

  handleTableMonthChange(monthIndex: number | null) {
    // If table did not provide a month (null), keep MonthSection's current selection
    if (monthIndex === null || monthIndex === undefined) {
      return;
    }
    // Ignore if same value to avoid redundant churn
    if (this.selectedMonthId === monthIndex) {
      return;
    }
    // Table emitted a month id (e.g., on restore). Drive MonthSection to compute and emit.
    // Set a guard so getDate() won't propagate to the table.
    this.isMonthChangeFromTable = true;
    this.selectedMonthId = monthIndex; // sync MonthSection dropdown via two-way binding
    this.sharedataService.setSelectedMonthValue(monthIndex); // trigger MonthSection calculation + messageEvent
  }

  ngAfterViewInit() {
    this.onLoading = false;
  }

  clearFlowOnRefresh() {
    // No-op: we persist flows across refresh; controlled via 'dashboard_loaded' flag
  }

  rolesHideTabs(userRole: any) {
    this.rolename = userRole;
    setTimeout(() => this.rolename$.next(this.rolename), 0)

    // If we have a saved dashboard_tab, prefer that over role-based defaults
    const savedTab = this.localService.get('dashboard_tab');
    if (savedTab) {
      this.labelTab = savedTab;
      this.selectedTabIndex = this.mapTabLabelToIndex(savedTab);
      // Suppress tabChange emitted by Angular Material during initial render
      this.suppressTabChangeCount = 1;
      this.suppressNextTabChange = false;
      setTimeout(() => this.selectedIndex$.next(this.selectedTabIndex), 0)
      // Use global niyat status across tabs
      this.restoreGlobalNiyatStatus();
      this.syncNiyatStatusNameFromList();
      this.getChartData(this.labelTab, this.dateDetails, 0, this.niyatStatus, null);
      return;
    }

    switch (this.rolename) {
      case 'Aamil':
      case "Muavin Aamil":
      case "Khidmat Ramadaniyah":
        this.labelTab = 'Jamaat';
        this.selectedTabIndex = 1; // Or appropriate index
        this.getRedeemTrophiesStat()
        break;
      case 'Dept Head':
        this.labelTab = 'Department';
        this.selectedTabIndex = 1; // [Jamiat, Department, Niyat]
        this.getRedeemTrophiesStat()
        break;
      case 'Umoor Head':
        this.labelTab = 'Umoor';
        this.selectedTabIndex = 0;
        this.getRedeemTrophiesStat()
        break;
      case 'Umoor Coordinator':
        this.labelTab = 'Niyat';
        this.selectedTabIndex = 1; // [Umoor, Niyat]
        this.getRedeemTrophiesStat()
        break;
      default:
        this.labelTab = 'Jamiat';
        this.selectedTabIndex = 1;
        break;
    }
    // Persist the default choice so a refresh restores this tab
    this.localService.set('dashboard_tab', this.labelTab);
    // Suppress tabChange emitted by Angular Material during initial render
    this.suppressTabChangeCount = 1;
    this.suppressNextTabChange = false;
    setTimeout(() => this.selectedIndex$.next(this.selectedTabIndex), 0)
    // Use global niyat status across tabs
    this.restoreGlobalNiyatStatus();
    this.syncNiyatStatusNameFromList();
    this.getChartData(this.labelTab, this.dateDetails, 0, this.niyatStatus, null);
  }

  tabDetails(event: any) {
    // Ignore first one or two tab change events originating from programmatic selection/rendering
    if (this.suppressTabChangeCount > 0) {
      this.suppressTabChangeCount--;
      return;
    }
    if (this.suppressNextTabChange) {
      this.suppressNextTabChange = false;
      return;
    }
    this.selectedTabIndex = event.index;
    this.labelTab = event.tab.textLabel;
    const getLocalTab = this.localService.get('dashboard_tab');
    // Persist last opened tab
    this.localService.set('dashboard_tab', this.labelTab);
    // Use global niyat status across tabs
    this.restoreGlobalNiyatStatus();
    this.syncNiyatStatusNameFromList();
    this.getChartData(this.labelTab, this.dateDetails, 0, this.niyatStatus, null);
    // On tab switch, reset to root of the selected tab to avoid stale deep-level columns
    if (getLocalTab === this.labelTab) {
      this.refreshTableInputs(true);
    }else{
      this.refreshTableInputs(false);
    } 
  }

  getDate(event: any) {
    this.dateDetails = event;
    this.getNiyatStatus(event);
    this.getChartData(this.labelTab, this.dateDetails, 0, this.niyatStatus, null);
    // On first date emission, bootstrap the table with the fresh date to avoid an initial stale call
    if (!this.hasBootstrappedTable) {
      this.refreshTableInputs(this.shouldRestoreOnFirstTableLoad);
      this.hasBootstrappedTable = true;
    } else {
      // Subsequent date changes only update the table's filteration data
      this.propagateDateToTable();
    }
    // Clear the table-origin flag after processing
    this.isMonthChangeFromTable = false;
  }

  // Update only the table filteration date range to keep current API level and pagination intact
  private propagateDateToTable(): void {
    this.tableFilterationData = {
      ...(this.tableFilterationData || {}),
      startDate: this.dateDetails?.startDate,
      endDate: this.dateDetails?.endDate,
      // Carry selected month id so Table can persist it into flow state on save
      selected_month: this.selectedMonthId,
    };
  }

  getniyatDataBx(data: any) {
    this.niyatStatus = data.id;
    // Keep name exactly as in toggle-box items to drive active highlight
    this.niyatStatusName = data.name;
    // Persist globally so tab switches and back navigation restore this selection
    this.localService.set('niyat_status_global', String(this.niyatStatus));
    // Update charts to reflect the selected status
    this.getChartData(this.labelTab, this.dateDetails, 0, this.niyatStatus, null);
    // Re-query the table with the new status, restoring current flow
    this.refreshTableInputs(true);
  }

  onSearch(event: any) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.getDataList(this.labelTab, this.dateDetails, 0, this.niyatStatus, searchValue, null);
  }


  getNiyatStatus(event: any): void {
    this.dashboardservice.getNiyatStatus(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.niyatStatusList$.next(data);
        // When status list arrives, set the selectedName for toggle-box based on saved niyatStatus
        const current = Array.isArray(data) ? data.find((d: any) => d?.id === this.niyatStatus) : null;
        if (current && current.name) {
          this.niyatStatusName = current.name;
        } else if (Array.isArray(data) && data.length > 0 && (this.niyatStatusName === null || this.niyatStatusName === undefined)) {
          this.niyatStatusName = data[0].name;
        }
      });
  }

  // Receive row-level events from app-table-and-search (re-emitted from app-smart-table)
  fetchedRecord(event: any) {
    if (this.userRole === 'Khidmat Ramadaniyah') {
      return;
    }
    if (event?.niyatDeactivateBtn) {
      this.openDeactivateDialog(event, 'raise');
      return;
    }
    if (event?.confirmNiyatDeactivateBtn) {
      this.openDeactivateDialog(event, 'confirm');
      return;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Open confirm dialog and execute Deactivate actions
  openDeactivateDialog(event: any, mode: 'raise' | 'confirm') {
    const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
      data: {
        form2: 'rejectForm',
        mode,
        niyatDetails: event,
      }
    });

    dialogRef.afterClosed().subscribe((dialogData: any) => {
      if (!dialogData) return;
      const itsId = Number(this.localService.get('itsId'));
      this.onLoading = true;

      if (mode === 'raise') {
        this.dashboardservice.setDeactivationNiyat(dialogData, itsId)
          .pipe(finalize(() => {
            // Recall the last API of the table after submit closes
            this.refreshTableInputs(true);
          }))
          .subscribe({
          next: (res: any) => {
            if (res) {
              this.toastrservice.success(res?.message || 'Acknowledged successfully');
              // Refresh charts on success
              this.getChartData(this.labelTab, this.dateDetails, 0, this.niyatStatus, null);
            } else {
              this.toastrservice.error(res?.errorMessage || 'An error occurred');
            }
            this.onLoading = false;
          },
          error: (err: any) => {
            console.error(err);
            this.onLoading = false;
            this.toastrservice.error('Failed to acknowledge. Please try again.');
          }
        });
      } else {
        this.dashboardservice.confirmDeactivationNiyat(dialogData, itsId)
          .pipe(finalize(() => {
            // Recall the last API of the table after submit closes
            this.refreshTableInputs(true);
          }))
          .subscribe({
          next: (res: any) => {
            if (res) {
              this.toastrservice.success(res?.message || 'Acknowledged successfully');
              // Refresh charts on success
              this.getChartData(this.labelTab, this.dateDetails, 0, this.niyatStatus, null);
            } else {
              this.toastrservice.error(res?.errorMessage || 'An error occurred');
            }
            this.onLoading = false;
          },
          error: (err: any) => {
            console.error(err);
            this.onLoading = false;
            this.toastrservice.error('Failed to acknowledge. Please try again.');
          }
        });
      }
    });
  }

  // Helper: compute date range from MonthSection selection id
  private computeDateRangeFromMonth(id: number): { startDate: Date; endDate: Date } {
    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDate = new Date(endDate);
    switch (id) {
      case 1:
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 2:
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 3:
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case 4:
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case 5:
        startDate.setFullYear(startDate.getFullYear() - 20);
        break;
      default:
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }
    return { startDate, endDate };
  }

  // Restored methods from backup
  getDataList(label: string, dateDetails: any, departmentId: number, status: number, search: string, id: any): void {
    this.isServerSide = false;
    this.getListData = [];
    switch (label) {
      case 'Umoor':
        this.dashboardservice.getListData('getUmoorActiveNiyatList', dateDetails, departmentId, status, search, id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.dynamicColumns(this.centerFocusLabel = 'umoor');
            this.getListData = this.searchList = data;
          });
        break;
      case 'Jamiat':
        this.dashboardservice.getListData('getJamiatActiveNiyatList', dateDetails, departmentId, status, search, id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.dynamicColumns(this.centerFocusLabel = 'jamiat');
            this.getListData = this.searchList = data;
          });
        break;
      case 'Jamaat':
        this.dashboardservice.getListData('getJamaatActiveNiyatList', dateDetails, departmentId, status, search, id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.dynamicColumns(this.centerFocusLabel = 'jamiat');
            this.getListData = this.searchList = data;
          });
        break;
      case 'Department':
        this.dashboardservice.getListData('getDepartmentActiveNiyatList', dateDetails, departmentId, status, search, id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.dynamicColumns(this.centerFocusLabel = 'department');
            this.getListData = this.searchList = data;
          });
        break;
      case 'Niyat':
        this.dashboardservice.getListData('getNiyatListData', dateDetails, departmentId, status, search, id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.dynamicColumnsAction();
            this.getListData = this.searchList = data;
          });
        break;
    }
    this.changeDetection.detectChanges();
  }

  getChartData(label: string, dateDetails: any, departmentId: number, status: number, id: any): void {
    this.isServerSide = true;
    this.getListData = [];
    switch (label) {
      case 'Jamiat':
      case 'Jamaat':
        this.dashboardservice.getDataChart('getJamiatData', dateDetails, status, departmentId, id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.dynamicColumns(this.centerFocusLabel = 'jamiat');
            this.getListData = this.searchList = data;
            this.getChartData$.next(data);
          });
        break;
      case 'Department':
        this.dashboardservice.getDataChart('getDepartmentData', dateDetails, status, departmentId, id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.dynamicColumns(this.centerFocusLabel = 'department');
            this.getListData = this.searchList = data;
            const chartdata = this.setBarChart(data);
            this.getChartData$.next(chartdata);
          });
        break;
      case 'Umoor':
        this.dashboardservice.getDataChart('getUmoorData', dateDetails, status, departmentId, id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.dynamicColumns(this.centerFocusLabel = 'umoor');
            this.getListData = this.searchList = data;
            const chartdata = this.setBarChart(data);
            this.getChartData$.next(chartdata);
          });
        break;
      case 'Niyat':
        // Donut chart expects raw counts object { totalNiyat, active, approvalPending, completed, deactivated }
        this.dashboardservice.getDataChart('getNiyatData', dateDetails, status, departmentId, id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            // Table columns remain as per current centerFocus; do not alter list here
            this.getChartData$.next(data);
          });
        break;
    }
  }

  /******************************************************************************
   *
   * @brief Transform API list into bar chart dataset
   * @param res any[]
   * @return { activebar, pendingbar, completedbar, totalbar, deactivatedbar, xaxis }
   *
   ******************************************************************************/
  private setBarChart(res: any): any {
    const resultactive: number[] = [];
    const resultapprovalPending: number[] = [];
    const resultcompleted: number[] = [];
    const resulttotal: number[] = [];
    const resultxaxis: string[] = [];
    const resultdeactivated: number[] = [];

    (res || []).forEach((response: any) => {
      const name = (response?.name || '').toString();
      resultxaxis.push(name.length > 0 ? name.substring(0, 20) : '-');

      const series = Array.isArray(response?.series) ? response.series : null;

      if (series && series.length > 0) {
        series.forEach((s: any) => {
          const key = (s?.name || '').toString().toLowerCase();
          const value = Number(s?.value || 0);
          switch (key) {
            case 'active':
              resultactive.push(value);
              break;
            case 'approval pending':
            case 'pending':
              resultapprovalPending.push(value);
              break;
            case 'completed':
              resultcompleted.push(value);
              break;
            case 'total':
              resulttotal.push(value);
              break;
            case 'deactivated':
              resultdeactivated.push(value);
              break;
            default:
              break;
          }
        });
      } else {
        const counts = response?.statusCountDto || response || {};
        resultactive.push(Number(counts.active || 0));
        resultapprovalPending.push(Number(counts.approvalPending || counts.pending || 0));
        resultcompleted.push(Number(counts.completed || 0));
        resulttotal.push(Number(counts.totalNiyat || counts.total || 0));
        resultdeactivated.push(Number(counts.deactivated || 0));
      }
    });

    return {
      activebar: resultactive.length === 0 ? null : resultactive,
      pendingbar: resultapprovalPending.length === 0 ? null : resultapprovalPending,
      completedbar: resultcompleted.length === 0 ? null : resultcompleted,
      totalbar: resulttotal.length === 0 ? null : resulttotal,
      deactivatedbar: resultdeactivated.length === 0 ? null : resultdeactivated,
      xaxis: resultxaxis,
    };
  }

  dynamicColumns(centerFocus: string) {
    this.columnsHeader = [
      {
        columnDef: 'name',
        header: 'Name',
        dataName: (row: any) => `${row.name || '-'}`,
      },
      {
        columnDef: 'totalNiyats',
        header: 'Total Niyats',
        dataName: (row: any) => `${row.totalNiyats || '0'}`,
      },
      {
        columnDef: 'pendingNiyats',
        header: 'Pending',
        dataName: (row: any) => `${row.pendingNiyats || '0'}`,
      },
      {
        columnDef: 'completedNiyats',
        header: 'Completed',
        dataName: (row: any) => `${row.completedNiyats || '0'}`,
      },
      {
        columnDef: 'rejectedNiyats',
        header: 'Rejected',
        dataName: (row: any) => `${row.rejectedNiyats || '0'}`,
      },
    ];
  }

  dynamicColumnsAction() {
    this.columnsHeader = [
      {
        columnDef: 'niyatId',
        header: 'Niyat Id',
        dataName: (row: any) => `${row.niyatId || '-'}`,
      },
      {
        columnDef: 'niyatDate',
        header: 'Niyat Date',
        dataName: (row: any) => `${new Date(row.niyatDate).toLocaleDateString() || '-'}`,
      },
      {
        columnDef: 'departmentName',
        header: 'Department Name',
        dataName: (row: any) => `${row.departmentName || '-'}`,
      },
      {
        columnDef: 'niyatName',
        header: 'Niyat Name',
        dataName: (row: any) => `${row.niyatName || '-'}`,
      },
      {
        columnDef: 'status',
        header: 'Status',
        dataName: (row: any) => `${this.checkStatus(row.status) || '-'}`,
      },
      {
        columnDef: 'action',
        header: 'Action',
        dataName: (row: any) => `${'-'}`,
      },
    ];
  }

  checkStatus(status: number) {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Completed';
      case 2:
        return 'Rejected';
      default:
        return 'All';
    }
  }


/******************************************************************************
 *
 * @brief Get redeem trophies statistic data from api
 * @param start and end date
   * @return none
   *
   ******************************************************************************/
getRedeemTrophiesStat(): void {
  const itsId: any = this.localService.get("itsId");
  this.approverCatservice.getRedeemStatusTrophies(itsId)
  .pipe(takeUntil(this.destroy$))
  .subscribe((data) => {
    this.redeemTrophiesData.next(data);
  });
}

}