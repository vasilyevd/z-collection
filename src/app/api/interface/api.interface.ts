import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UnArray} from '../../core/types';
import {ApiRequestOptions} from './request.interface';
import {AppApiResponse, DataResponse, GridResponse, ModelResponse} from './response.interface';
import {SearchSettings} from '../../collection/interface';

export interface IAppApiService {
  http: HttpClient;

  Get<T>(url: string, options?: ApiRequestOptions): Observable<AppApiResponse<T>>;
  Post<T>(url: string, data: any, options?: ApiRequestOptions): Observable<AppApiResponse<T>>;

  getData<T extends Array<any>>(url: string, options?: ApiRequestOptions): Observable<GridResponse<UnArray<T>>>;
  getData<T>(url: string, options?: ApiRequestOptions): Observable<ModelResponse<T>>;
  getData<T = any>(url: string, options?: ApiRequestOptions): Observable<DataResponse<T>>;

  getDataModel<T = any>(url: string, options?: ApiRequestOptions): Observable<ModelResponse<T>>;

  GridSearch<T = any>(url: string | ProvidedUrl, search?: SearchSettings, options?: ApiRequestOptions): Observable<GridResponse<T>>;
  getGridSearchData<T = any>(url: string, search?: SearchSettings, options?: ApiRequestOptions): Observable<T[]>;
}

export type ProvidedUrl = {
  url: string;
  params?: {
    [param: string]: string | string[];
  };
};

export type ActiveUrlProviderMethod = () => string | ProvidedUrl;

export type ActiveUrlProvider =  {
  [method: string]: ActiveUrlProviderMethod;
};

/**
 * Что-то пошло не так и дальнейшее выполнение логики приложения не имеет смысла или не может быть выполнено.
 * - пользователь не авторизован
 * - пользователь не имеет прав на получение данных или на выполнение действия
 * - запрашиваемый ресурс не найден. предполагаемое действие не возможно.
 * - ошибка на сервере. получить вменяемый ответ невозможно - предполагаемое действие не возможно.
 * - плохой запрос - сервер не понял требуемого. нормально ответить не может, но стоит поискать проблему у себя.
 *
 * P.S. остальные ошибки типа "не могу выполнить потому что: { ...
 * "такого быть не может", "не все прислали", "у вас не достаточно денежек на счету",
 * "мы попытались передать, но нам сказали что там уже не работают" }
 * это уже валидные ответы которые должны обрабатываться приложением.
 */
export interface AppApiError {
  headers: HttpHeaders;
}
