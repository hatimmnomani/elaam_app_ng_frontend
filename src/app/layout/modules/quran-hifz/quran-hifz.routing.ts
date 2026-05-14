import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { QuranHifzComponent } from "./component/quran-hifz/quran-hifz.component";



export const routes: Routes = [
    {
      path: '',
      redirectTo: 'list',
      pathMatch: 'full'
    },
    {
      path: 'list',
      component: QuranHifzComponent
    },
    
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class QuranHifzRoutingModule {}