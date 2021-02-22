import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {XFilter} from './test/XFilter';
import {ReactiveFormsModule} from '@angular/forms';
import { FilterTextComponent } from './components/text/filter-text.component';
import { FilterSelectComponent } from './components/select/select.component';
import { FilterRangeDateComponent } from './components/range-date/range-date.component';



@NgModule({
  declarations: [FilterTextComponent, FilterSelectComponent, FilterRangeDateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    XFilter,
  ],
  exports: [
    FilterTextComponent,
    FilterSelectComponent,
    FilterRangeDateComponent
  ]
})
export class Filter2Module { }
