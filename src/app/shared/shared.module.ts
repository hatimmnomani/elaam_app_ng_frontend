import { UploadImageComponent } from './componets/upload-Image/upload-Image.component';
import { CommonModule, DatePipe } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { LeafletModule } from '@asymmetrik/ngx-leaflet'
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster'
import { NgxEchartsModule } from 'ngx-echarts'
import { BardashboardComponent } from './componets/charts/bardashboard/bardashboard.component'
import { donutChartsComponent } from './componets/charts/donut-charts/donut-charts.component'
import { DownloadFilesButtonComponent } from './componets/download-files-button/download-files-button.component'
import { FooterComponent } from './componets/footer/footer.component'
import { HeaderBarComponent } from './componets/header-bar/header-bar.component'
import { HeaderComponent } from './componets/header/header.component'
import { MapComponent } from './componets/map/map.component'
import { MonthSectionComponent } from './componets/month-section/month-section.component'
import { SidebarComponent } from './componets/sidebar/sidebar.component'
import { SmartDialogDeleteComponent } from './componets/smart-dialog/smart-dialog-delete.component'
import { SmartSearchComponent } from './componets/smart-search/smart-search.component'
import { SmartTableComponent } from './componets/smart-table/smart-table.component'
import { ToggleBoxComponent } from './componets/toggle-box/toggle-box.component'
import { MaterialModule } from './material-liabrary/material.module'
import { NotfoundComponent } from './componets/notfound/notfound.component';
import { TableAndSearchComponent } from './componets/table-and-search/table-and-search.component';
import { SendMessageService } from '../layout/modules/send-message/service/send-message.service';
import { ServerSideSmartTableComponent } from './componets/server-side-smart-table/server-side-smart-table.component'
import { NgImageSliderModule } from 'ng-image-slider';
import { QrcodeScanComponent } from './componets/qrcode-scan/qrcode-scan.component';
import { ReportSideSmartTableComponent } from './componets/report-side-smart-table/report-side-smart-table.component';
import { QuizService } from './services/quiz.service';

const commonComponents = [
  HeaderComponent,
  FooterComponent,
  SidebarComponent,
  SmartTableComponent,
  HeaderBarComponent,
  MonthSectionComponent,
  SmartSearchComponent,
  DownloadFilesButtonComponent,
  SmartDialogDeleteComponent,
  ToggleBoxComponent,
  UploadImageComponent,
  NotfoundComponent,
  ServerSideSmartTableComponent,
  TableAndSearchComponent,
  ReportSideSmartTableComponent
]

const thirdPartyComponents = [
  donutChartsComponent,
  BardashboardComponent,
  MapComponent
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgImageSliderModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    MaterialModule,
    LeafletModule,
		LeafletMarkerClusterModule
  ],
  declarations: [
    commonComponents,
    thirdPartyComponents,
    DownloadFilesButtonComponent,
    QrcodeScanComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    commonComponents,
    thirdPartyComponents
  ],
  providers: [DatePipe, SendMessageService, QuizService]
})

export class SharedModule { }
