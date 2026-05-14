import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiyatQuestionAddEditComponent } from './niyat-question-add-edit.component';

describe('NiyatQuestionAddEditComponent', () => {
  let component: NiyatQuestionAddEditComponent;
  let fixture: ComponentFixture<NiyatQuestionAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NiyatQuestionAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NiyatQuestionAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
