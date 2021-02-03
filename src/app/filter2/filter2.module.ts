import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {XFilter} from './test/XFilter';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    XFilter,
  ],
})
export class Filter2Module { }
