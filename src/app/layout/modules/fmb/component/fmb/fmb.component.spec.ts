import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FmbComponent } from './fmb.component';

describe('FmbComponent', () => {
  let component: FmbComponent;
  let fixture: ComponentFixture<FmbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FmbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FmbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
