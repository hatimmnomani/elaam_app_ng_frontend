import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeScanComponent } from './qrcode-scan.component';

describe('QrcodeScanComponent', () => {
  let component: QrcodeScanComponent;
  let fixture: ComponentFixture<QrcodeScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodeScanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodeScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
