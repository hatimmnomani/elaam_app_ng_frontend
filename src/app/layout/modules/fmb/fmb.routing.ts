import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FmbComponent } from "./component/fmb/fmb.component";

export const routes: Routes = [
    {
      path: '',
      redirectTo: 'list',
      pathMatch: 'full'
    },
    {
      path: 'list',
      component: FmbComponent
    },
    
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class FmbRoutingModule {}
  