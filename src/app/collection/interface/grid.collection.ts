import {ICollectionPagination} from './pagination';
import {SearchSettings} from './search';
import {Observable} from 'rxjs';
import {GridResponse} from '../../api/response.interface';

/**
 * Active Collection with Pagination, Filter and Sort
 */
export interface IGridCollection {
  getSort();
  getFilter();
  getPagination(): ICollectionPagination;
  getSearchSettings(): SearchSettings;
  resetFilter();
  currentPage(page?: number);
  load(): Observable<GridResponse<any>>;
}
