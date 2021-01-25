import {ICollectionApiDataProvider} from './interface';
import {CollectionStartStrategy} from '../strategy';
import {Data} from '../../core/types';
import {IAppApiService} from '../../api/interface';
import {IApiActiveCollection} from '../interface';
import {ServiceLocator} from '../../core/ServiceLocator';


/**
 * HTTP Data Provider as storage use backend (maube as alt. self-made cache)
 *
 * ??? Need DataProvider know about collection?
 */
export class CollectionApiDataProvider implements ICollectionApiDataProvider {

  protected apiService: IAppApiService;

  /**
   * Storage for initial data for show new collection with Strategy non-NONE
   * maybe can not use this variable (fill collection data immediately on creation)
   */

  constructor(
    protected collection: IApiActiveCollection,
    protected source = [],
    protected strategy = CollectionStartStrategy.NONE
  ) {
    this.apiService = ServiceLocator.api();

    // initial fill Collection by Strategy
    // console.log('run CollectionApiDataProvider:initDataByStrategy');
    this.initDataByStrategy(strategy);
  }

  private initDataByStrategy(strategy: CollectionStartStrategy){
    console.log('CollectionApiDataProvider:initDataByStrategy');
    // fill only if have strategy
    if (strategy === CollectionStartStrategy.SHOW_ALL) {
      this.source.forEach ((itemData: Data) => {
        const model = this.makeItem(itemData);
        this.provideModel(model);
      });
    }
  }

  protected makeItem(data?: Data) {
    return this.getItemFactory()(data);
  }

  protected getItemFactory() {
    return this.collection.itemFactory;
  }

  protected provideModel(model) {
    this.collection.items.push(model);
  }

  protected getUrlProvider() {
    const urlProvider = this.collection?.urlProvider;
    if (!urlProvider) {
      console.warn('Collection with Api Data Provider must have urlProvider');
    }
    return urlProvider;
  }

  public load() {
    console.log('CollectionApiDataProvider.load...');
    // @TODO: make not GridSearch Response - because without SearchSettings (but if BE return response as Search - use it)
    const url = this.getUrlProvider()?.load();

    // mock, update, etc. response
    // detect communication errors
    // retry/ pooling manage, detect progress, chunks loading
    return this.apiService.GridSearch(url);
  }

  /**
   * add to collection model
   * Ex: new created RestModel from modal dialog
   * @TODO: for bulk save collection in feature
   * @TODO: for save RestModel
   */
  pushModel(model) {
    this.collection.items.push(model);
  }

  save() {
    throw new Error(`Collection could not be saved when using HttpDataProvider.
    Please implement logic for bulk save models`);
  }

  update() {
    this.load();
  }

  updateItem(itemRef, newData) {
    throw new Error(`Collection could not update items when using HttpDataProvider as Source.
    All data in collection loaded from DataProvider is static. Try save Item by it is own methods.
    Or implement saving of collection models and partial update collection on success`);
  }
}
