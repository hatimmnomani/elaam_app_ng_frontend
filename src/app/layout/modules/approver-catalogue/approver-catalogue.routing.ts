import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogueRewardComponent } from './components/catalogue-reward/catalogue-reward.component';
import { RewardListComponent } from './components/reward-list/reward-list.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'reward',
    pathMatch: 'full',
  },
  {
    path: 'reward',
    component: CatalogueRewardComponent
  },
  {
    path: 'list',
    component: RewardListComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApproverCatalogueRoutingModule {}
