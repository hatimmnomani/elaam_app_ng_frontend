import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NiyatDataAddEditComponent } from './components/niyat-data-add-edit/niyat-data-add-edit.component';
import { NiyatDataListComponent } from './components/niyat-data-list/niyat-data-list.component';

const isQrCode = localStorage.getItem('isQrCode')


export const routes: Routes = isQrCode === "true" ? [
  {
    path: '',
    redirectTo: 'add',
    pathMatch: 'full'
  },
  {
    path: 'add',
    component: NiyatDataAddEditComponent
  },
] : [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: NiyatDataListComponent
  },
  {
    path: 'add',
    component: NiyatDataAddEditComponent
  },
  {
    path: 'edit/:id',
    component: NiyatDataAddEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NiyatDataRoutingModule { }
