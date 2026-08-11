import { Component, HostListener, OnInit } from '@angular/core';
import { LocalStorageService } from './auth/service/storage/localstorage.service';
import { SharedataService } from './shared/services/sharedata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'aelaam';

  constructor(
    private localService: LocalStorageService,
    private sharedataService: SharedataService
  ) {}

  ngOnInit(): void {
    // On hard app bootstrap, ensure we don't restore the previous dashboard flow/month
    try {
      this.localService.remove('dashboard_loaded');
      // Also clear centralized dashboard_state in sessionStorage
      this.sharedataService.clearDashboardState();
    } catch { /* noop */ }
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(_event: any) {
    // Ensure next load is treated as fresh by removing restore flag
    try { this.localService.remove('dashboard_loaded'); } catch { /* noop */ }
  }
}
