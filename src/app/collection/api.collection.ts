import {ActiveCollection} from './active.collection';
import {ActiveUrlProvider} from '../api/interface/api.interface';
import {CollectionPagination} from './pagination';
import {IApiActiveCollection} from './interface';
import {CollectionApiDataProvider, ICollectionApiDataProvider} from './providers';

//@todo: ApiCollection
export class ApiActiveCollection<T = any> extends ActiveCollection implements IApiActiveCollection {

  dataProvider: ICollectionApiDataProvider;

  urlProvider: ActiveUrlProvider;

  protected dataProviderConstructor(data): void {
    this.dataProvider = new CollectionApiDataProvider(this, data, this.strategy);
  }

  protected paginationFabric(paginationConfig): CollectionPagination {
    return null;
  }
}
