import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogueListComponent } from './components/catalogue-list/catalogue-list.component';
import { CatalogueAddComponent } from './components/catalogue-add/catalogue-add.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: CatalogueListComponent
  },
  {
    path: 'add',
    component: CatalogueAddComponent
  },
  {
    path: 'edit/:id',
    component: CatalogueAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueRoutingModule {}
