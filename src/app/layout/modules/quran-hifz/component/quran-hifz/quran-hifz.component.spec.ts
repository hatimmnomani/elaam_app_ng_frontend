import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuranHifzComponent } from './quran-hifz.component';

describe('QuranHifzComponent', () => {
  let component: QuranHifzComponent;
  let fixture: ComponentFixture<QuranHifzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuranHifzComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuranHifzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
