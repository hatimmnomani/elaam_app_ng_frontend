 import { NgModule } from '@angular/core';
 import { Routes, RouterModule } from '@angular/router';
 import { LoginComponent } from './components/login/login.component';
import { NotAuthorizedGuard } from './guard/authorize/authorize.guard';
import { SafetyPageComponent } from '../safty/safety-page.component';

 
 const auth_routes: Routes = [
  { path: 'login', component: LoginComponent},  
  { path: 'login/:id', component: LoginComponent},
  { path: 'loginSuccess', component: LoginComponent},  
  {path: 'safety', component:SafetyPageComponent},
  { path: 'admin/login', component: LoginComponent,canActivate: [NotAuthorizedGuard]}, 
 ];
 
 @NgModule({
   imports: [RouterModule.forChild(auth_routes)],
   exports: [RouterModule]
 })
 export class AuthRoutingModule { }
 