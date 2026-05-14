import { SharedModule } from './../../../shared/shared.module';
import { UmoorAddEditComponent } from './umoor-add-edit/umoor-add-edit.component';
import { UmoorListComponent } from './umoor-list/umoor-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UmoorRoutingModule } from './umoor.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UmoorRoutingModule
  ],
  declarations: [UmoorListComponent, UmoorAddEditComponent]
})
export class UmoorModule { }
