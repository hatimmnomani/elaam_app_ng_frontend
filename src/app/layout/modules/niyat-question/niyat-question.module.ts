import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NiyatQuestionAddEditComponent } from './niyat-question-add-edit/niyat-question-add-edit.component';
import { NiyatQuestionListComponent } from './niyat-question-list/niyat-question-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { NiyatQuestionRoutingModule } from './niyat.routing';


@NgModule({
  declarations: [
    NiyatQuestionAddEditComponent,
    NiyatQuestionListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NiyatQuestionRoutingModule
  ]
})
export class NiyatQuestionModule { 
  
}
