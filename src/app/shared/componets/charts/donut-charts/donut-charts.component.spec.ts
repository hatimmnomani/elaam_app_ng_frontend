
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { donutChartsComponent } from "./donut-charts.component";

describe("donutChartsComponent", () => {
  let component: donutChartsComponent;
  let fixture: ComponentFixture<donutChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [donutChartsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(donutChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
