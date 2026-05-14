import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NiyatApproveListComponent } from './niyat-approve-list/niyat-approve-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: NiyatApproveListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class NiyatApproveRoutingModule {}
