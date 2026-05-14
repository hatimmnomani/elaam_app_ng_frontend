import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotAuthorizedGuard } from './auth/guard/authorize/authorize.guard';
import { AuthorizeGuard } from './auth/guard/not-authorize/not-authorize.guard';
import { NotfoundComponent } from './shared/componets/notfound/notfound.component';
import { PrivacyPolicyComponent } from './privacuPolicy/privacy-policy/privacy-policy.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule),
    canActivate: [AuthorizeGuard]
  },
  {
    path:'privacyPolicy',
    component:PrivacyPolicyComponent
  },
  {
    path: 'not-found',
    component: NotfoundComponent,
    pathMatch: 'full'
},
{   path: '**',
    component: NotfoundComponent,
    pathMatch: 'full'
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
  providers: [ ]
})

export class AppRoutingModule {}
