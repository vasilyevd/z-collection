import {Injector, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {ServiceLocator} from './core/ServiceLocator';
import {ApiModule} from './api/module';
import { ShippingPageComponent } from './pages/shipping-page/shipping-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ShippingPageComponent,
  ],
  imports: [
    BrowserModule,
    ApiModule
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
