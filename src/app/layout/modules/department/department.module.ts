import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentRoutingModule } from './department.routing';
import { DepartmentAddEditComponent } from './components/department-add-edit/department-add-edit.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DepartmentRoutingModule
  ],
  declarations: [DepartmentAddEditComponent,DepartmentListComponent]
})
export class DepartmentModule { }
