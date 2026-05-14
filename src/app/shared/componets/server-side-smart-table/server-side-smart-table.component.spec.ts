import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerSideSmartTableComponent } from './server-side-smart-table.component';

describe('ServerSideSmartTableComponent', () => {
  let component: ServerSideSmartTableComponent;
  let fixture: ComponentFixture<ServerSideSmartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerSideSmartTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerSideSmartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
