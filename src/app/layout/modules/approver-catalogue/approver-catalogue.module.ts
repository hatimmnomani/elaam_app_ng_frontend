// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
// export class ApproverCatalogueModule { }



import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ApproverCatalogueRoutingModule } from './approver-catalogue.routing';
import { CatalogueRewardComponent } from './components/catalogue-reward/catalogue-reward.component';
import { RewardListComponent } from './components/reward-list/reward-list.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ApproverCatalogueRoutingModule
  ],
  declarations: [CatalogueRewardComponent, RewardListComponent]
})
export class ApproverCatalogueModule { }

