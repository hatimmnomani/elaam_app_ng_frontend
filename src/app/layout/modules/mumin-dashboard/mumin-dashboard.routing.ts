import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleAuthorizeGuard } from 'src/app/auth/guard/role-authorize/role-authorize.guard';
import { MuminDashboardComponent } from './component/mumin-dashboard/mumin-dashboard.component';
import { NiyatInformationComponent } from './component/niyat-information/niyat-information.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MuminDashboardComponent,
    canActivate: [RoleAuthorizeGuard],
    data: { roles: ["Mumin"] }

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MuminDashboardRoutingModule {}
