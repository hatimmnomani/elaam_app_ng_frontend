import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiyatQuestionListComponent } from './niyat-question-list.component';

describe('NiyatQuestionListComponent', () => {
  let component: NiyatQuestionListComponent;
  let fixture: ComponentFixture<NiyatQuestionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NiyatQuestionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NiyatQuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
