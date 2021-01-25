import {CollectionItemConstructor, CollectionItemFactory} from './item';
import {CollectionPaginationConfig} from './pagination';
import {CollectionStartStrategy} from '../strategy';
import {ICollectionDataProviderConstructor} from '../providers/interface';

export interface CollectionConfiguration {
  pagination?: CollectionPaginationConfig;
  itemConstructor?: CollectionItemConstructor;
  itemFactory?: CollectionItemFactory;
  dataProvider?: ICollectionDataProviderConstructor;
  strategy?: CollectionStartStrategy;
  urlProvider?;
}
