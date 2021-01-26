import {Observable} from 'rxjs';
import {IPaginationModel} from '../pagination/interface';
import {PAGINATION_DEFAULT} from '../pagination/default';

import {IGridCollection} from './interface';
import {CollectionPagination} from './pagination';
import {ApiActiveCollection} from './api.collection';
import {GridCollectionApiDataProvider} from './providers';
import {IFilterService} from '../filters/interface';
import {GridResponse} from '../api/interface';
import {SearchSettings} from './interface/search';

export class GridActiveCollection<T = any> extends ApiActiveCollection implements IGridCollection {

  //redefine items class
  items: T[];

  dataProvider: GridCollectionApiDataProvider;

  protected filter: IFilterService;

  protected dataProviderConstructor(data): void {
    this.dataProvider = new GridCollectionApiDataProvider(this, data, this.strategy);
  }

  protected paginationFabric(paginationConfig) {
    return new CollectionPagination(Object.assign({}, PAGINATION_DEFAULT, paginationConfig));
  }

  currentPage(page?: number) {
  }

  getFilter() {
    return this.filter;
  }

  setFilter(filter: IFilterService) {
    this.filter = filter;
  }


  getPagination(): IPaginationModel {
    return this.pagination;
  }

  /**
   * Provide Collection Search Object.
   * Based on Filter, Pagination and Sort
   */
  getSearchSettings(): SearchSettings {
    return {
      pagination: this.getPagination(),
      filter: SearchFilter
    };
  }

  getSort() {
  }

  load(): Observable<GridResponse> {
    return super.load();
  }

  resetFilter() {
  }

  useFilter(filterObject: IFilterService) {
    this.filter = filterObject;
  }
}
