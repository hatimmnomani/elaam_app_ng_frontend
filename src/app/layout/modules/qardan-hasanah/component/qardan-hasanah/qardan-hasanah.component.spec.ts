import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QardanHasanahComponent } from './qardan-hasanah.component';

describe('QardanHasanahComponent', () => {
  let component: QardanHasanahComponent;
  let fixture: ComponentFixture<QardanHasanahComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QardanHasanahComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QardanHasanahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
