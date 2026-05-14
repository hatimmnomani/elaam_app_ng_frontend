/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UmoorListComponent } from './umoor-list.component';

describe('UmoorListComponent', () => {
  let component: UmoorListComponent;
  let fixture: ComponentFixture<UmoorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UmoorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UmoorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
