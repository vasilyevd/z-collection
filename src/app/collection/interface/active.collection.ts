import {IModelsCollection} from './models.collection';
import {Observable} from 'rxjs';
import {ICollectionDataProvider} from '../providers/interface';
import {ListingResponse} from '../../api/interface/response.interface';
import {ActiveUrlProvider} from '../../api/interface/api.interface';

/**
 * This Collection can load data from dataProvider
 * and provide all methods for work with Items (Models).
 * Not use Pagination, Filter, Sort - it just container for models with load/save
 */
export interface IActiveCollection extends IModelsCollection {
  /**
   * Service for provide methods for work with models
   */
  dataProvider: ICollectionDataProvider;

  /**
   * Is Collection data loading in progress
   */
  readonly isLoading: boolean;

  /**
   * Load to Collection data using dataProvider and current setting
   */
  load(): Observable<ListingResponse>;

  /**
   * Save collection. Whatever it means.
   * All collection models data actualize (saves) on source (backend, array, localstorage, etc.)
   * Use collection dataProvider
   */
  save();

  refresh();

  reload();

  update(data);
}

/**
 * ActiveCollection with data provided from API
 */
export interface IApiActiveCollection extends IActiveCollection {
  dataProvider: ICollectionDataProvider;
  urlProvider?: ActiveUrlProvider;
}
