import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiyatQuestionCountComponent } from './niyat-question-count.component';

describe('NiyatQuestionCountComponent', () => {
  let component: NiyatQuestionCountComponent;
  let fixture: ComponentFixture<NiyatQuestionCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NiyatQuestionCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NiyatQuestionCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
