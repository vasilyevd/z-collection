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

@NgModule({
  declarations: [
    AppComponent,
    ShippingPageComponent,
    ShippingRulesFilterForm,
    FilterFieldComponent,
    FilterControlTextComponent,
    FilterControlSelectComponent,
  ],
  imports: [
    BrowserModule,
    ApiModule,
    FormsModule,
    ReactiveFormsModule
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
