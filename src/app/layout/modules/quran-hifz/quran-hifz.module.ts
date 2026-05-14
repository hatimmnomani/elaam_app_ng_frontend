import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuranHifzComponent } from './component/quran-hifz/quran-hifz.component';
import { QuranHifzRoutingModule } from './quran-hifz.routing';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [QuranHifzComponent],
  imports: [
    CommonModule,
    SharedModule,
    QuranHifzRoutingModule,
  ]
})
export class QuranHifzModule { }
