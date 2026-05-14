import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiyatDataAddEditComponent } from './niyat-data-add-edit.component';

describe('NiyatDataAddEditComponent', () => {
  let component: NiyatDataAddEditComponent;
  let fixture: ComponentFixture<NiyatDataAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NiyatDataAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NiyatDataAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
