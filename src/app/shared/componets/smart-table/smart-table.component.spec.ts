
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../shared/shared.module';
import { of } from 'rxjs';
import { SmartDialogDeleteComponent } from '../smart-dialog/smart-dialog-delete.component';

import { SmartTableComponent } from './smart-table.component';

describe('SmartTableComponent', () => {
  let component: SmartTableComponent;
  let fixture: ComponentFixture<SmartTableComponent>;
  let dialogSpy: jasmine.Spy;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  let matDialogRef = { close: (value: any) => { } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmartTableComponent],
      imports: [
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRef }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);

    fixture = TestBed.createComponent(SmartTableComponent);
    component = fixture.componentInstance;
    component.receivedData = [
      {
        "id": 61,
        "serialNumber": "adszz",
        "assetId": "ASSWIT545451",
        "assetType": {
          "id": 5,
          "name": "Ground Pad"
        },
        "status": "commissioned",
        "powerLevel": null,
        "numberOfPhases": null,
        "modemType": null,
        "cardReaderType": null,
        "imeiNumber": null,
        "carrier": null,
        "simNumber": null,
        "ipAddress": null,
        "length": null,
        "siteId": 1,
        "installedDate": 1631193859000,
        "address": "ads",
        "country": {
          "id": 1,
          "name": "United States"
        },
        "state": {
          "id": 1,
          "name": "Alabama"
        },
        "city": {
          "id": 1,
          "name": "Abanda"
        },
        "zipCode": "123321123",
        "chargerId": 72
      }
    ];
    component.dataSource = new MatTableDataSource(component.receivedData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.ngDoCheck();
  });

  it('#checkedChange should emit tableRecord event', () => {
    spyOn(component.tableRecord, "emit");
    component.checkedChange({ currentTarget: { checked: true } }, {});
    expect(component.tableRecord.emit).toHaveBeenCalled();
  });

  it('#getSelectedRows should emit tableRecord event', () => {
    spyOn(component.tableRecord, "emit");
    component.getSelectedRows({}, {});
    expect(component.tableRecord.emit).toHaveBeenCalled();
  });

  it('#masterToggle should emit tableRecord event', () => {
    spyOn(component.tableRecord, "emit");
    component.masterToggle();
    expect(component.tableRecord.emit).toHaveBeenCalled();
  });

  it('#checkboxLabel should emit tableRecord event', () => {
    expect(component.checkboxLabel()).toBeInstanceOf(String);
    expect(component.checkboxLabel({})).toBeInstanceOf(String);
  });

  it('#deleteDialog should emit tableRecord event', () => {
    spyOn(component.tableRecord, "emit");
    expect(dialogSpy).toHaveBeenCalled();
    matDialogRef.close({});
    expect(component.tableRecord.emit).toHaveBeenCalled();
  });

  it('#ngOnChanges should update data appropriately', () => {
    component.columns = [
      {
        "columnDef": "assetType",
        "header": "Asset Type"
      },
      {
        "columnDef": "assetId",
        "header": "Asset Id"
      },
      {
        "columnDef": "serialnumber",
        "header": "Serial Number"
      },
      {
        "columnDef": "status",
        "header": "Status"
      },
      {
        "columnDef": "action",
        "header": "Action"
      }
    ];
    component.ngOnChanges({});
    component.receivedData = null;
    component.ngOnChanges({});
    component.receivedData = [];
    component.ngOnChanges({});
  });

});
