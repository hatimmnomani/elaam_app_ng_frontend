import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ReportComponent } from './components/report/report.component';
import { ReportRoutingModule } from './report.routing';
import { DynamicReportComponent } from './components/dynamic-report/dynamic-report.component';


@NgModule({
  declarations: [
    ReportComponent,
    DynamicReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReportRoutingModule
  ]
})
export class ReportModule { 
  
}
