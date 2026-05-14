import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NiyatTemplateRoutingModule } from './niyat-template-routing.module';
import { TemplateListComponent } from './components/template-list/template-list.component';
import { TemplateAddEditComponent } from './components/template-add-edit/template-add-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TemplatePreviewComponent } from './components/template-preview/template-preview.component';
import { DownloadXLSQuestionsService } from './services/downloadXLSQuestions.service';


@NgModule({
  declarations: [
    TemplateListComponent,
    TemplateAddEditComponent,
    TemplatePreviewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NiyatTemplateRoutingModule
  ],
  providers: [
    DownloadXLSQuestionsService
  ]
})
export class NiyatTemplateModule { }
