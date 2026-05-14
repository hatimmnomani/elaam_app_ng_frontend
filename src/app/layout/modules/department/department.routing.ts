import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentAddEditComponent } from './components/department-add-edit/department-add-edit.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: DepartmentListComponent
  },
  {
    path: 'add',
    component: DepartmentAddEditComponent
  },
  {
    path: 'edit/:id',
    component: DepartmentAddEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule {}
