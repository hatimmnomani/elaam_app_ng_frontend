import { SharedModule } from 'src/app/shared/shared.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './components/notification-list/notification.component';
import { NotificationRoutingModule } from './notification.routing';




@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule,
    SharedModule,
    NotificationRoutingModule
  ]
})
export class NotificationModule { }
