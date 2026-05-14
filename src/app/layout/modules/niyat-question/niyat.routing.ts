import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NiyatQuestionAddEditComponent } from './niyat-question-add-edit/niyat-question-add-edit.component';
import { NiyatQuestionListComponent } from './niyat-question-list/niyat-question-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: NiyatQuestionListComponent
  },
  {
    path: 'add',
    component: NiyatQuestionAddEditComponent
  },
  {
    path: 'edit/:id',
    component: NiyatQuestionAddEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NiyatQuestionRoutingModule {}
