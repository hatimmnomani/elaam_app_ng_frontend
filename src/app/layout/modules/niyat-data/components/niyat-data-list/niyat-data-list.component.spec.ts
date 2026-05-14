import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiyatDataListComponent } from './niyat-data-list.component';

describe('NiyatDataListComponent', () => {
  let component: NiyatDataListComponent;
  let fixture: ComponentFixture<NiyatDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NiyatDataListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NiyatDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
