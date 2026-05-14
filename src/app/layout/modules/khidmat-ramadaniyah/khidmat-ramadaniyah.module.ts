import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { KhidmatRamadaniyahRoutingModule } from './khidmat-ramadaniyah-routing.module';
import { KhidmatRamadaniyahListComponent } from './components/khidmat-ramadaniyah-list/khidmat-ramadaniyah-list.component';
import { KhidmatRamadaniyahAddEditComponent } from './components/khidmat-ramadaniyah-add-edit/khidmat-ramadaniyah-add-edit.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    KhidmatRamadaniyahListComponent,
    KhidmatRamadaniyahAddEditComponent
  ],
  imports: [
    CommonModule,
    KhidmatRamadaniyahRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule
  ]
})
export class KhidmatRamadaniyahModule { }
