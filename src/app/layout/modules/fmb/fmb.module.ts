import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FmbComponent } from './component/fmb/fmb.component';
import { FmbRoutingModule } from './fmb.routing';

@NgModule({
  declarations: [FmbComponent],
  imports: [
    CommonModule,
    SharedModule,
    FmbRoutingModule
  ]
})
export class FMBModule { }
