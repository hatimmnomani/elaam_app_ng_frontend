import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartDialogDeleteComponent } from './smart-dialog-delete.component';

describe('SmartDialogDeleteComponent', () => {
  let component: SmartDialogDeleteComponent;
  let fixture: ComponentFixture<SmartDialogDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartDialogDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartDialogDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
