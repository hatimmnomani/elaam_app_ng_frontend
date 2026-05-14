import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NiyatDataListComponent } from './components/niyat-data-list/niyat-data-list.component';
import { NiyatDataAddEditComponent } from './components/niyat-data-add-edit/niyat-data-add-edit.component';
import { NiyatDataRoutingModule } from './niyat-data.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgImageSliderModule } from 'ng-image-slider';



@NgModule({
  declarations: [
    NiyatDataListComponent,
    NiyatDataAddEditComponent
  ],
  imports: [
    CommonModule,
    NiyatDataRoutingModule,
    SharedModule,
    NgImageSliderModule,
  ]
})
export class NiyatDataModule { }
