/**
 * Service that used global injector
 */
import {Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IAppApiService} from '../api/interface/api.interface';

declare class ServiceLocator {
  static injector: Injector;

  static http(): HttpClient

  static api(): IAppApiService
}
