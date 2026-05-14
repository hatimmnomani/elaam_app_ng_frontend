import { QardanHasanahRoutingModule } from './qardan-hasanah.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { QardanHasanahComponent } from './component/qardan-hasanah/qardan-hasanah.component';



@NgModule({
  declarations: [QardanHasanahComponent],
  imports: [
    CommonModule,
    SharedModule,
    QardanHasanahRoutingModule
  ]
})
export class QardanHasanahModule { }
