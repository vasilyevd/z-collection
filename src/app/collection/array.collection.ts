import {ActiveCollection} from './active.collection';
import {IArrayActiveCollection, IGridCollection, SearchSettings} from './interface';
import {CollectionArrayDataProvider, ICollectionArrayDataProvider} from './providers';
import {CollectionPagination} from './pagination';
import {PAGINATION_DEFAULT} from '../pagination/default';
import {Observable} from 'rxjs';
import {ListingResponse} from '../api/response.interface';

export class ArrayActiveCollection extends ActiveCollection implements IArrayActiveCollection, IGridCollection {

  dataProvider: ICollectionArrayDataProvider; // CollectionArrayDataProvider;

  protected dataProviderConstructor(data): void {
    this.dataProvider = new CollectionArrayDataProvider(this, data, this.strategy);
  }

  protected paginationFabric(paginationConfig: any) {
    return new CollectionPagination(Object.assign({}, PAGINATION_DEFAULT, paginationConfig));
  }

  load(): Observable<ListingResponse> {
    return super.load();
  }

  currentPage(page?: number) {
  }

  getFilter() {
  }

  getPagination(): CollectionPagination {
    return undefined;
  }

  getSearchSettings(): SearchSettings {
    return undefined;
  }

  getSort() {
  }

  resetFilter() {
  }
}
