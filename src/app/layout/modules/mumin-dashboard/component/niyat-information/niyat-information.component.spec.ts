import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiyatInformationComponent } from './niyat-information.component';

describe('NiyatInformationComponent', () => {
  let component: NiyatInformationComponent;
  let fixture: ComponentFixture<NiyatInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NiyatInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NiyatInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
