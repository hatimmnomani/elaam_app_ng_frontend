
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { QardanHasanahComponent } from "./component/qardan-hasanah/qardan-hasanah.component";


export const routes: Routes = [
    {
      path: '',
      redirectTo: 'list',
      pathMatch: 'full'
    },
    {
      path: 'list',
      component: QardanHasanahComponent
    },
    
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class QardanHasanahRoutingModule {}
  