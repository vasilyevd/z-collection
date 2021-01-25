import {Injectable} from '@angular/core';
import {
  ApiRequestOptions, AppApiError,
  AppApiResponse,
  DataResponse,
  GridResponse,
  IAppApiService,
  ModelResponse, ProvidedUrl
} from './interface';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {UnArray} from '../core/types';
import {SearchSettings} from '../collection/interface';
import {$Util} from '../core/utils/common';


@Injectable()
export class ApiService implements IAppApiService {
  private retry = 0;

  constructor(
    public http: HttpClient
  ) {}

  /**
   * Base API Get request.
   * Maybe now it is just mapping...
   * In feature we can check codes, body and:
   * - add some information
   * - catch errors for make this response ass error
   */
  public Get<T>(url: string, options?: ApiRequestOptions): Observable<AppApiResponse<T>>{
    console.log('ApiService:Get', url, options);
    const opt: { observe: 'response' } = {...options, ...{observe: 'response'}};
    return this.http.get<T>(url, opt)
      .pipe(
        retry(this.retry),
        map(response => {
          // if some wrong in response can throw exception (it goes to current catchError):
          // throw new HttpErrorResponse({ error: 'NO DATA', status: 407 });

          /**
           * 1. Check response status code (403, 404 etc)
           * - yes: return error with TYPE NOT_FOUND
           * - no: return response with data
           *
           * 2. Check response data content
           * - status? status:error?
           *
           * API: get<T> --> Observable<ApiResponse<T>> {data: T, }
           */

          /**
           * когда мы обращаемся к апи мы можем получить ошибку, но связанную с:
           * - проблемами транспорта (0, 50X)
           * - проблемами доступа (403, 404, ...)
           * - проблемами выполнения (404?, not valid request data)
           *
           * Вопрос: стоит ли все это сваливать в одну кучу?
           * В нашем случае мы все ошибки при процессинге засовывали в данные под "грифом" errors
           * В случае ошибок API мы делаем то же самое?
           *
           * Ошибки валидации и т.п. это по сути не являются ошибками API, а являются частью процесса
           * и что делать дальше определяет тот кто просил данные.
           * Но иногда сервер может вернуть 200, т.е. апи отработал верно. Но получить 404/403 по факту поиска сущности.
           * Тогда требуется отреагировать не сообщением типа "что-то пошло не так",
           * а осмысленным ответом типа "нет такого" или "нет прав"
           * У нас было что происходит режект с данными в ответе {message: string}
           * {
           *   code: 404
           * }
           * {
           *   code: 200
           *   status: 'ERROR'
           *   error: {
           *     message: 'You can not accessed'
           *   }
           * }
           */

          return {
            headers: response.headers,
            result: response.body,
          };
        }),
        catchError(this.clientErrorHandler),
      );
  }

  /**
   * Base API Post request.
   * Maybe now it is just mapping...
   * In feature we can check codes, body and:
   * - add some information
   * - catch errors for make this response ass error
   */
  public Post<T>(url: string, data: any, options?: ApiRequestOptions): Observable<AppApiResponse<T>>{
    const opt: { observe: 'response' } = {...options, ...{observe: 'response'}};
    return this.http.post<T>(url, data, opt)
      .pipe(
        map(response => {
          return {
            headers: response.headers,
            result: response.body,
          };
        }),
        catchError(this.clientErrorHandler),
      );
  }


  /**
   * common API method for request DataModel or Grid with DataModels
   */
  public getData<T extends Array<any>>(url: string, options?: ApiRequestOptions): Observable<GridResponse<UnArray<T>>>;
  public getData<T>(url: string, options?: ApiRequestOptions): Observable<ModelResponse<T>>;
  public getData<T = any>(url: string, options?: ApiRequestOptions): Observable<DataResponse<T>> {
    return this.Get<DataResponse<T>>(`/api/${url}`, options).pipe(
      map((apiResponse) => {
        return this.validateDataResponse(apiResponse.result);
      })
    );
    // return this.http.get<DataResponse<T>>(`/api/${url}`)
    //   .pipe(
    //     map((responseData) => {
    //       return this.validateDataResponse(responseData);
    //     })
    //   );
  }

  /**
   * Request for DataModel
   */
  public getDataModel<T = any>(url: string, options?: ApiRequestOptions) {
    return this.Post<ModelResponse<T>>(url, options).pipe(
      map((resp) => {
        return resp.result;
      })
    );
    // return this.getData<T>(url);
  }

  public GridSearch<T = any>(url: string | ProvidedUrl, search: SearchSettings = {}, options?: ApiRequestOptions) {
    const provided = this.toProvidedUrl(url);
    options.params = {...provided.params, ...options.params};

    return this.Post<GridResponse<T>>(provided.url, {search}, options).pipe(
      map((apiResponse) => {
        return apiResponse.result;
      })
    );
  }

  public getGridSearchData<T = any>(url: string, search: SearchSettings = {}, options?: ApiRequestOptions) {
    return this.GridSearch<T>(url, search, options).pipe(
      map((gridResponse) => {
        return gridResponse.data;
      })
    );
  }

  private validateDataResponse<T>(responseData: T) {
    const valid = responseData?.hasOwnProperty('data');
    if (!valid) { throw throwError(this.extractError(responseData)); }
    return responseData;
  }

  private clientErrorHandler(error: HttpErrorResponse)  {
    const d = error.headers;
    const code = error.status;
    const message = error.message;
    const err = error.error;

    if (err instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', err.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend code ${error.status}, ` +
        `body: ${error.error}`);
    }
    return throwError(error as AppApiError);
  }

  extractError(response) {
    return response?.error || {
      message: 'Some error on make API request'
    };
  }

  protected toProvidedUrl(extractFrom: string | ProvidedUrl): ProvidedUrl {
    let url; let params;
    if ($Util.isObject(extractFrom)) {
      url = (extractFrom as ProvidedUrl).url;
      params = (extractFrom as ProvidedUrl)?.params;
    } else {
      url = extractFrom as string;
    }
    return {url, params};
  }
}
