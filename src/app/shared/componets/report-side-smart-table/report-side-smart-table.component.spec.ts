import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSideSmartTableComponent } from './report-side-smart-table.component';

describe('ReportSideSmartTableComponent', () => {
  let component: ReportSideSmartTableComponent;
  let fixture: ComponentFixture<ReportSideSmartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportSideSmartTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSideSmartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
