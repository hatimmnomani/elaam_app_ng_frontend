import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NiyatApproveListComponent } from './niyat-approve-list/niyat-approve-list.component';
import { NiyatApproveRoutingModule } from './niyat-approve.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NiyatApproveRoutingModule
  ],
  declarations: [NiyatApproveListComponent]
})
export class NiyatApproveModule { }
