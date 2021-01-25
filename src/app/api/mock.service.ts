import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {ApiRequestOptions, GridResponse, ModelResponse, ProvidedUrl} from './interface';
import {map} from 'rxjs/operators';
import {SearchSettings} from '../collection/interface';
import {IPaginationModel} from '../pagination/interface';

@Injectable()
export class MockApiService extends ApiService {
  private apiCurrentPageIsZeroBased = false;

  /**
   * Request for DataModel
   */
  public getDataModel<T = any>(url: string, options?: ApiRequestOptions) {
    return this.Get<ModelResponse<T>>(url, options).pipe(
      map((resp) => {
        return resp.result;
      })
    );
  }

  public GridSearch<T = any>(providedUrl: string | ProvidedUrl, search: SearchSettings = {}, options: ApiRequestOptions = {}) {
    const url = this.toProvidedUrl(providedUrl);

    const searchToParams = {
      filter: search.filter,
      pagination: this._paginationPrepare(search.pagination)
    };
    options.params = {...url.params, ...options.params, ...searchToParams.filter, ...searchToParams.pagination};

    return this.Get<GridResponse<T>>(`api/${url.url}`, options).pipe(
      map((apiResponse) => {
        apiResponse.result.pagination = {
          itemsCount: Number(apiResponse.headers.get('x-total-count')),
          pageSize: search.pagination?.pageSize(),
          currentPage: search.pagination?.currentPage()
        };
        return apiResponse.result;
      }),
    );
  }

  private _paginationPrepare(pagination: IPaginationModel) {
    if (!pagination) { return {}; }
    /**
     * In the Link header you'll get first, prev, next and last links.
     */
    const mockPaginate = {
      _page: this._currentPage(pagination.currentPage()),
      _limit: pagination.pageSize()
    };
    /**
     * Add _start and _end or _limit (an X-Total-Count header is included in the response)
     */
    const mockSlice = {
      _start: pagination.getOffset(),
      _limit: pagination.pageSize()
    };
    return mockPaginate;
  }

  private _currentPage(paginationCurrentPage: number) {
    return (this.apiCurrentPageIsZeroBased) ? paginationCurrentPage : ++paginationCurrentPage;
  }

  private _objToSearchUri(params = {}) {
    Object.keys(params).map(
      key => `${key}=${encodeURIComponent(params[key])}`
    ).join('&');
  }
}
