import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test/test.component';
import { SharedModule } from '../../../shared/shared.module';
import { TestRoutingModule } from './test.routing';




@NgModule({
  declarations: [
    TestComponent,
   
  ],
  imports: [
    CommonModule,SharedModule,TestRoutingModule
  ]
})
export class TestModule { }
