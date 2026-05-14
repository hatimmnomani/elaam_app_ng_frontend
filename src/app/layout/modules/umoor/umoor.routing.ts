import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UmoorAddEditComponent } from './umoor-add-edit/umoor-add-edit.component';
import { UmoorListComponent } from './umoor-list/umoor-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: UmoorListComponent
  },
  {
    path: 'add',
    component: UmoorAddEditComponent
  },
  {
    path: 'edit/:id',
    component: UmoorAddEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UmoorRoutingModule {}
