import {InjectionToken, NgModule} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {IAppApiService} from './interface';
import {MockApiService} from './mock.service';


export const API_SERVICE = new InjectionToken<IAppApiService>('Application API Service');

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  providers: [
    {
      provide: API_SERVICE,
      deps: [HttpClient],
      useFactory: (httpClient: HttpClient) => new MockApiService(httpClient)
    }
  ]
})
export class ApiModule {
  constructor() {}
}
