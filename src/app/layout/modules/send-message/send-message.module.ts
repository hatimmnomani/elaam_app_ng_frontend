import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SendMessageRoutingModule } from './send-message-routing.module';
import { SendMessageComponent } from './components/send-message/send-message.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SendMessageService } from './service/send-message.service';


@NgModule({
  declarations: [
    SendMessageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SendMessageRoutingModule
  ],
  providers: [
    SendMessageService,
  ]
})
export class SendMessageModule { }
