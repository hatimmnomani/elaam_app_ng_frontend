import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NiyatQuestionCountComponent } from './components/niyat-question-list/niyat-question-count.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: NiyatQuestionCountComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NiyatDataCountRoutingModule { }
