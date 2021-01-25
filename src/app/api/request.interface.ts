import {HttpHeaders, HttpParams} from '@angular/common/http';

type HttpObserve = 'body' | 'events' | 'response';
type HttpResponseType = 'arraybuffer' | 'blob' | 'json' | 'text';

export interface HttpRequestOptions<T extends HttpObserve = 'response'> {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: T;
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: HttpResponseType;
  withCredentials?: boolean;
  body?: any;
}

export interface ApiRequestOptions {
  // @todo: in feature up it to +type: string | string[], IHeaderRecord[]
  headers?: HttpRequestOptions['headers'];
  params?: HttpRequestOptions['params'];
}
