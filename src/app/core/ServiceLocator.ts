import {Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IAppApiService} from '../api/interface';
import {API_SERVICE} from '../api/module';

/**
 * Service that used global injector
 */
export class ServiceLocator {
  static injector: Injector = null;

  static http(): HttpClient {
    return ServiceLocator.injector.get(HttpClient);
  }


  static api(): IAppApiService {
    return ServiceLocator.injector.get(API_SERVICE);
  }
}

