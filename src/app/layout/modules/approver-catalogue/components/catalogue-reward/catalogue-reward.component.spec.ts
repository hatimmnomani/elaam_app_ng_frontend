import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueRewardComponent } from './catalogue-reward.component';

describe('CatalogueRewardComponent', () => {
  let component: CatalogueRewardComponent;
  let fixture: ComponentFixture<CatalogueRewardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogueRewardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
