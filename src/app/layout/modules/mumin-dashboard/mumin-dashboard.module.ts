import { MuminDashboardRoutingModule } from './mumin-dashboard.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuminDashboardComponent } from './component/mumin-dashboard/mumin-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NiyatInformationComponent } from './component/niyat-information/niyat-information.component';
import { CatalogueRedeemComponent } from './component/catalogue-redeem/catalogue-redeem.component';



@NgModule({
  declarations: [
    MuminDashboardComponent,
    NiyatInformationComponent,
    CatalogueRedeemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MuminDashboardRoutingModule
  ]
})
export class MuminDashboardModule { }
