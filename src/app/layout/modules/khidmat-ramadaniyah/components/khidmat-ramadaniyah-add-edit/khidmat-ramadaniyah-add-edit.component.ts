import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { KhidmatRamadaniyahService } from '../../services/khidmat-ramadaniyah.service';
import { NiyatDataService } from '../../../niyat-data/services/niyat-data.service';
import { SendMessageService } from '../../../send-message/service/send-message.service';
import { CommonService } from '../../../dashboard/service/common.service';
import { SpinnerService } from '../../../../../shared/services/spinner/spinner.service';
import { MatDialog } from '@angular/material/dialog';
import { SmartDialogDeleteComponent } from '../../../../../shared/componets/smart-dialog/smart-dialog-delete.component';

@Component({
  selector: 'app-khidmat-ramadaniyah-add-edit',
  templateUrl: './khidmat-ramadaniyah-add-edit.component.html',
  styleUrls: ['./khidmat-ramadaniyah-add-edit.component.scss']
})
export class KhidmatRamadaniyahAddEditComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  roleForm: FormGroup;
  id: any;
  action: string = 'Add';
  jamaatList: any[] = [];
  disableBtn: boolean = false;
  userName: string = '';
  jamaatSearchControl = new FormControl();
  filteredJamaats: Observable<any[]>;
  selectedJamaats: any[] = [];
  formSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private khidmatService: KhidmatRamadaniyahService,
    private niyatDataService: NiyatDataService,
    private sendMessageService: SendMessageService,
    private toastrService: ToastrService,
    private changeDetection: ChangeDetectorRef,
    public commonservices: CommonService,
    public spinner: SpinnerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getJamaatList();
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.id = atob(this.id);
      this.action = 'EDIT';
      this.roleForm.get('itsId')?.disable();
      this.getRoleById(this.id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createForm(): void {
    this.roleForm = this.fb.group({
      itsId: [null, [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      jamaatId: [[], [Validators.required]],
      name: [null]
    });

    const itsIdControl = this.roleForm.get('itsId');
    if (itsIdControl) {
      itsIdControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
          if (this.action === 'Add' && value && value.toString().length === 8) {
            this.validateItsId(value);
          } else if (this.action === 'Add') {
            this.userName = '';
          }
        });
    }

    // Handle Jamaat search/filter
    this.filteredJamaats = this.jamaatSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterJamaats(value))
    );
  }

  get f() {
    return this.roleForm.controls;
  }

  getJamaatList(): void {
    this.sendMessageService.getDataByID("getAllJamaat", '')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.jamaatList = data || [];
        // Trigger the filter so the list shows up immediately
        this.jamaatSearchControl.setValue('');
        this.changeDetection.detectChanges();
      }, err => {
        console.error('Error fetching Jamaat list:', err);
      });
  }





  private _filterJamaats(value: string): any[] {
    const filterValue = (value || '').toLowerCase();
    const selectedIds = this.roleForm?.get('jamaatId')?.value || [];
    
    return (this.jamaatList || []).filter(jamaat => {
      if (!jamaat || !jamaat.jamaatName) return false;
      const isSelected = selectedIds.includes(jamaat.id);
      const matchesFilter = jamaat.jamaatName.toLowerCase().includes(filterValue);
      return isSelected || matchesFilter;
    });
  }

  clearJamaatSearch(): void {
    this.jamaatSearchControl.setValue('');
  }

  clearJamaatSelection(): void {
    this.roleForm.get('jamaatId')?.setValue([]);
  }

  validateItsId(itsId: any): void {
    this.niyatDataService.getValidITSId(itsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res && !res.error && (res.userName || res.fullName)) {
          this.userName = res.userName || res.fullName; 
          this.roleForm.get('itsId')?.setErrors(null);
          this.roleForm.patchValue({ name: this.userName });
        } else {
          this.userName = '';
          const msg = res && res.message ? res.message : 'Invalid ITS ID';
          this.roleForm.get('itsId')?.setErrors({ 'invalidItsId': true });
        }
        this.changeDetection.detectChanges();
      }, err => {
        console.error('ITS Validation Error:', err);
        this.userName = '';
        this.changeDetection.detectChanges();
      });
  }

  getRoleById(id: any): void {
    this.khidmatService.getKhidmatRoleByID(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          const jamaatIds = res.rolesDetails?.map((role: any) => role.jamaatId) || [];
          this.roleForm.patchValue({
            itsId: res.itsId,
            jamaatId: jamaatIds,
            name: res.name
          });
          this.selectedJamaats = jamaatIds;
          this.userName = res.name;
          this.changeDetection.detectChanges();
        }
      });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      this.changeDetection.detectChanges();
      return;
    }

    const dialogRef = this.dialog.open(SmartDialogDeleteComponent, {
      data: {
        name: `Are you sure you want to ${this.action === 'EDIT' ? 'update' : 'assign'} this role?`,
        heading: 'Confirmation',
        buttonSubmit: 'Confirm',
        buttonCancel: 'Cancel',
        record: true
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveRole();
      }
    });
  }

  saveRole(): void {
    this.disableBtn = true;
    this.spinner.show();
    const formValue = this.roleForm.getRawValue();
    const req: any = {
      itsId: formValue.itsId ? Number(formValue.itsId) : null
    };

    const jamaatIds = (formValue.jamaatId || []).map((id: any) => Number(id));
    req.jamaatIds = jamaatIds;


    if (this.action === 'EDIT') {
      this.khidmatService.updateKhidmatRole(this.id, req)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.spinner.hide();
          if (res && (res.status === 'success' || !res.error)) {
            this.toastrService.success(this.commonservices.toTitleCase(res.message || 'Updated successfully'));
            this.router.navigate(['/admin/khidmat-ramadaniyah/list']);
          } else {
            this.toastrService.error(this.commonservices.toTitleCase(res?.message || 'Update failed'));
            this.disableBtn = false;
          }
        }, err => {
          this.spinner.hide();
          this.disableBtn = false;
        });
    } else {
      this.khidmatService.assignKhidmatRole(req)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.spinner.hide();
          if (res && (res.status === 'success' || !res.error)) {
            this.toastrService.success(this.commonservices.toTitleCase(res.message || 'Role assigned successfully'));
            this.router.navigate(['/admin/khidmat-ramadaniyah/list']);
          } else {
            this.toastrService.error(this.commonservices.toTitleCase(res?.message || 'Assignment failed'));
            this.disableBtn = false;
          }
        }, err => {
          this.spinner.hide();
          this.disableBtn = false;
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/khidmat-ramadaniyah/list']);
  }
}
