import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFilesButtonComponent } from './download-files-button.component';

describe('DownloadFilesButtonComponent', () => {
  let component: DownloadFilesButtonComponent;
  let fixture: ComponentFixture<DownloadFilesButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadFilesButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadFilesButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
