import { SendMessageComponent } from './components/send-message/send-message.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'send',
    pathMatch: 'full'
  },
  {
    path: 'send',
    component: SendMessageComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendMessageRoutingModule { }
