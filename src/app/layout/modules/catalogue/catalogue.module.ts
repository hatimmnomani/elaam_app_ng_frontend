import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { CatalogueRoutingModule } from './catalogue.routing';
import { CatalogueListComponent } from './components/catalogue-list/catalogue-list.component';
import { CatalogueAddComponent } from './components/catalogue-add/catalogue-add.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CatalogueRoutingModule
  ],
  declarations: [CatalogueAddComponent,CatalogueListComponent]
})
export class CatalogueModule { }
