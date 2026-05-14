import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthSectionComponent } from './month-section.component';

describe('MonthSectionComponent', () => {
  let component: MonthSectionComponent;
  let fixture: ComponentFixture<MonthSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
