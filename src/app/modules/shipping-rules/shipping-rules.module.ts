import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ShippingRulesFilterView} from './filters/view.form';
import {ShippingRulesFilterForm} from './filters/side.form';
import {ShippingRulesFilter} from './filters/model';
import {ReactiveFormsModule} from '@angular/forms';
import {FiltersModule} from '../../filters/filters.module';



@NgModule({
  declarations: [
    ShippingRulesFilterForm,
    ShippingRulesFilterView,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FiltersModule
  ],
  providers: [
    ShippingRulesFilter,
  ],
  exports: [
    ShippingRulesFilterForm,
    ShippingRulesFilterView
  ]
})
export class ShippingRulesModule { }
