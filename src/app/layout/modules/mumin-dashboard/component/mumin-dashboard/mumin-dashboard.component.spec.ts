import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuminDashboardComponent } from './mumin-dashboard.component';

describe('MuminDashboardComponent', () => {
  let component: MuminDashboardComponent;
  let fixture: ComponentFixture<MuminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MuminDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MuminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
