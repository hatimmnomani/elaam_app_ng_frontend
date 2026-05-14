import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { NiyatQuestionCountComponent } from './components/niyat-question-list/niyat-question-count.component';
import { NiyatDataCountRoutingModule } from './niyat-data-count-routing.module';



@NgModule({
  declarations: [
    NiyatQuestionCountComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NiyatDataCountRoutingModule
  ]
})
export class NiyatDataCountModule { }
