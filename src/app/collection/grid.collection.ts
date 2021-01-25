import {Observable} from 'rxjs';
import {IPaginationModel} from '../pagination/interface';
import {GridResponse} from '../api/interface/response.interface';
import {PAGINATION_DEFAULT} from '../pagination/default';

import {IGridCollection} from './interface';
import {CollectionPagination} from './pagination';
import {ApiActiveCollection} from './api.collection';
import {GridCollectionApiDataProvider} from './providers';

export class GridActiveCollection<T = any> extends ApiActiveCollection implements IGridCollection {

  //redefine items class
  items: T[];

  dataProvider: GridCollectionApiDataProvider;

  filter: object = {};

  protected dataProviderConstructor(data): void {
    this.dataProvider = new GridCollectionApiDataProvider(this, data, this.strategy);
  }

  protected paginationFabric(paginationConfig) {
    return new CollectionPagination(Object.assign({}, PAGINATION_DEFAULT, paginationConfig));
  }

  currentPage(page?: number) {
  }

  getFilter() {
  }


  getPagination(): IPaginationModel {
    return this.pagination;
  }

  /**
   * Provide Collection Search Object.
   * Based on Filter, Pagination and Sort
   */
  getSearchSettings() {
    return {
      pagination: this.getPagination(),
    };
  }

  getSort() {
  }

  load(): Observable<GridResponse> {
    return super.load();
  }

  resetFilter() {
  }

  useFilter(filterObject: object) {
    this.filter = filterObject;
  }
}
