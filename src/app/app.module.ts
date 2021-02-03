import {Injector, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {ServiceLocator} from './core/ServiceLocator';
import {ApiModule} from './api/module';
import { ShippingPageComponent } from './pages/shipping-page/shipping-page.component';
import {ShippingRulesFilterForm} from './modules/shipping-rules/filters/side.form';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FilterFieldComponent } from './filters/components/filter-field/filter-field.component';
import { FilterControlTextComponent } from './filters/components/filter-control-text/filter-control-text.component';
import { FilterControlSelectComponent } from './filters/components/filter-control-select/filter-control-select.component';
import {ShippingRulesModule} from './modules/shipping-rules/shipping-rules.module';
import {FiltersModule} from './filters/filters.module';
import {Filter2Module} from './filter2/filter2.module';
import { Filters2Component } from './pages/filters2/filters2.component';

@NgModule({
  declarations: [
    AppComponent,
    ShippingPageComponent,
    Filters2Component,
  ],
  imports: [
    BrowserModule,
    ApiModule,
    FormsModule,
    ReactiveFormsModule,
    FiltersModule,
    Filter2Module,
    ShippingRulesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private injector: Injector,
  ) {
    console.log('app module create');
    ServiceLocator.injector = this.injector;
  }
}
