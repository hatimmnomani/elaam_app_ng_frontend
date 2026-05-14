import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueAddComponent } from './catalogue-add.component';

describe('CatalogueAddComponent', () => {
  let component: CatalogueAddComponent;
  let fixture: ComponentFixture<CatalogueAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogueAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
