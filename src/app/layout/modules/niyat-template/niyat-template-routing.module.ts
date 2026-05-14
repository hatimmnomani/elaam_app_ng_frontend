import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateListComponent } from './components/template-list/template-list.component';
import { TemplateAddEditComponent } from './components/template-add-edit/template-add-edit.component';
import { TemplatePreviewComponent } from './components/template-preview/template-preview.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: TemplateListComponent 
  },
  {
    path: 'add',
    component: TemplateAddEditComponent
  },
  {
    path: 'edit/:id',
    component: TemplateAddEditComponent
  },
  {
    path: 'preview',
    component: TemplatePreviewComponent
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NiyatTemplateRoutingModule { }
