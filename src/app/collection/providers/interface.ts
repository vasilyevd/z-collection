import {Observable} from 'rxjs';
import {GridResponse, ListingResponse} from '../../api/interface/response.interface';
import {CollectionStartStrategy} from '../strategy';
import {IActiveCollection} from '../interface';


export interface ICollectionDataProvider {
  // hasItems(): boolean;

  /**
   * Provide data to collection from source
   */
  load<T = any>(): Observable<ListingResponse<T>>;

  /**
   * Logic for save collection
   * Ex: save one by one, bulk save models
   */
  save();
  update();

  /**
   * Add model to collection without save them in source.
   */
  pushModel(model);

  updateItem(itemRef, newData);
}

export interface ICollectionArrayDataProvider extends ICollectionDataProvider {
  hasItems()
  load(): Observable<GridResponse>
}

export interface ICollectionApiDataProvider extends ICollectionDataProvider {
  load(): Observable<GridResponse>
}

export type ICollectionDataProviderConstructor = new (
  collection: IActiveCollection,
  data?: any[],
  strategy?: CollectionStartStrategy
) => ICollectionDataProvider;
