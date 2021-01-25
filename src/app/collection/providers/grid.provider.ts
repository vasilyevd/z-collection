import {CollectionApiDataProvider} from './api.provider';
import {CollectionStartStrategy} from '../strategy';
import {Data} from '../../core/types';
import {ICollectionPagination, IGridCollection, IApiActiveCollection} from '../interface';

export class GridCollectionApiDataProvider extends CollectionApiDataProvider {

  protected collection: IApiActiveCollection & IGridCollection;

  constructor(
    collection: IApiActiveCollection & IGridCollection,
    source = [],
    strategy = CollectionStartStrategy.NONE
  ) {
    super(collection, source, strategy);
    // initial fill Collection by Strategy
    // console.log('run GridCollectionApiDataProvider:initDataByPaginatedStrategy');
    this.initDataByPaginatedStrategy(strategy);
  }

  load() {
    console.log('GridCollectionApiDataProvider.load...');
    // @TODO: make not GridSearch Response - because without SearchSettings (but if BE return response as Search - use it)
    const url = this.getUrlProvider()?.load();
    console.log('load url:', url);
    const search = this.collection.getSearchSettings();
    return this.apiService.GridSearch(url, search);
  }

  /**
   * add to collection model
   * Ex: new created RestModel from modal dialog
   */
  pushModel(model) {
    if (!!this.collection.getPagination()) {
      console.warn('The Model pushed to paginated collection! After any load from source you lost it');
    }
    super.pushModel(model);
  }

  private initDataByPaginatedStrategy(strategy: CollectionStartStrategy){
    console.log('GridCollectionApiDataProvider:initDataByPaginatedStrategy');
    const p = this.collection.getPagination();
    if (p) {
      // set items count in pagination by initiated source if not defined
      p.itemsCount(p.itemsCount() ?? this.source.length);
      switch (strategy) {
        case CollectionStartStrategy.FORWARD_PAGINATION:
          this.fillByForwardPagination(p, this.source);
          break;
        case CollectionStartStrategy.EXTRACT_BY_PAGINATION:
          this.fillByExtractPagination(p, this.source);
      }
    }
  }

  /**
   * Fill by get first {pageSize} from data
   */
  private fillByForwardPagination(pagination: ICollectionPagination, data) {
    data = data.slice(0, pagination.pageSize());
    this.fillCollection(data);
  }

  /**
   * Fill Collection by get from data {pageSize} items count with offset {currentPage - 1}
   */
  private fillByExtractPagination(pagination: ICollectionPagination, data: Array<Data>) {
    const start = pagination.getOffset();
    const end = start + pagination.pageSize();
    this.fillCollection(data.slice(start, end));
  }

  private fillCollection(data: Array<Data>) {
    data.forEach ((itemData: Data) => {
      const model = this.makeItem(itemData);
      this.provideModel(model);
    });
  }

}
