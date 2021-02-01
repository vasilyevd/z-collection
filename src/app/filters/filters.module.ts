import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FilterFieldComponent} from './components/filter-field/filter-field.component';
import {FilterControlTextComponent} from './components/filter-control-text/filter-control-text.component';
import {FilterControlSelectComponent} from './components/filter-control-select/filter-control-select.component';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    FilterFieldComponent,
    FilterControlTextComponent,
    FilterControlSelectComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    FilterFieldComponent,
  ],
})
export class FiltersModule { }
