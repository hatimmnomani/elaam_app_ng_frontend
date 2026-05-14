import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KhidmatRamadaniyahListComponent } from './components/khidmat-ramadaniyah-list/khidmat-ramadaniyah-list.component';
import { KhidmatRamadaniyahAddEditComponent } from './components/khidmat-ramadaniyah-add-edit/khidmat-ramadaniyah-add-edit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: KhidmatRamadaniyahListComponent
  },
  {
    path: 'add',
    component: KhidmatRamadaniyahAddEditComponent
  },
  {
    path: 'edit/:id',
    component: KhidmatRamadaniyahAddEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KhidmatRamadaniyahRoutingModule { }
