import {ICollectionArrayDataProvider} from './interface';
import {Data} from '../../core/types';
import {of} from 'rxjs';
import {GridResponse, PaginationResponse} from '../../api/interface';
import {IArrayActiveCollection, IGridCollection, SearchSettings} from '../interface';
import {$Util} from '../../core/utils/common';

/**
 * Array Data Provider use Collection data as storage of raw data.
 * Collection get paginated? filtered and sorted data for view.
 */
export class CollectionArrayDataProvider implements ICollectionArrayDataProvider {

  /**
   * Store for Models (based on Models Data)
   */
  private allItems = [];

  /**
   * Unique key for identify model
   * It is can be composite key. Like: ['name', 'isGroup']
   */
  private readonly uuidKey;

  constructor(
    private collection: IArrayActiveCollection & IGridCollection,
    private source = [],
    strategy?
  ) {
    console.log('COLLECTION-ARRAY-DATA-PROVIDER');
    this.uuidKey = collection.uniqueKey();

    // iterate by collection initial data
    // create for each data item Model
    // put them to allItems array
    this.source.forEach (
      (itemData: Data) => {
        const model = this.makeItem(itemData);

        // @todo: update Model uuid in model on construct
        // if Model support uuidKey - update them
        if (model && model.hasOwnProperty('updateUuid') && $Util.isFunction(model.updateUuid)) {
          model.updateUuid(this.uuidKey);
        }

        this.allItems.push(model);
      },
    );

    // console.log('source', this.source);
    // console.log('allItems', this.allItems);
  }

  /**
   * Provide Model Constructor function
   */
  private getItemFactory() {
    return this.collection.itemFactory;
  }

  private makeItem(data?) {
    return this.getItemFactory()(data);
  }

  /**
   * Checks if collection has elements
   */
  hasItems() {
    // make request to Source (allItems) and get items count
    return Boolean($Util.isArray(this.allItems) && this.allItems.length);
  }

  load() {
    console.log('ArrayDataProvider.load...');
    // take SearchSettings {filter, pagination, sort}
    const searchSettings = this.collection.getSearchSettings();
    console.log('get SearchSettings and find');
    // find in allItems data by SearchSettings (aka make request)
    const gridResponse = this._search(searchSettings);

    // @TODO: maybe need only provide search result??? Collection know that she do with PaginationFilterSort
    // filteredData.forEach((model) => {
    //   this.provideModel(model);
    // });

    return of(gridResponse);
  }


  private provideModel(model) {
    this.collection.items.push(model);
  }

  private _search(settings: SearchSettings): GridResponse<any> {
    // we can make search in rawData, but raw data can has data without default values
    // if we provide rawData already prepared with defaults - we can search in raw and map raw to models
    // But. If we edit some models in collection
    // set as collection items filtered items
    let responseData = this.allItems;

    // data by filter
    const filterSettings = settings.filter;
    if (filterSettings && Object.keys(filterSettings).length) {
      responseData = this.allItems.filter((item) => {
        return true;
      });
    }
    const responseItemsCount = responseData.length;

    // sort data
    const sortSettings = settings.sort;
    if (sortSettings) {
      // sort filtered data
    }

    // data by pagination
    let responsePagination: PaginationResponse;
    const paginationSettings = settings.pagination;

    if (paginationSettings) {
      // @todo: detect limits and return actual pagination
      const _offset = paginationSettings.currentPage() * paginationSettings.pageSize();
      responseData.slice(_offset, paginationSettings.pageSize() + _offset);
      responsePagination = {
        itemsCount: responseItemsCount,
        pageSize: paginationSettings.pageSize(),
        currentPage: paginationSettings.currentPage(),
      };
    }

    return {
      data: responseData,
      pagination: responsePagination
    };
  }

  /**
   * itemRef - reference to Model in collection ModelsStorage (allItems)
   * newData - data of edited model
   */
  updateItem(itemRef, newData) {
    /**
     * - create new Model based on newData
     * - search in ModelsStorage (allItems) same
     */
    const newItem = this.collection.itemConstruct(newData);

    const indexOfItemInAllItems = this.allItems.findIndex((currentModel, index) => {
      return newItem[this.uuidKey] === currentModel[this.uuidKey];
    }, this);

    if (indexOfItemInAllItems !== -1) {
      this.allItems[indexOfItemInAllItems] = newItem;
    }
  }

  update() {
    this.load();
  }


  /**
   * Update linked source or emit event by actual data in allItems
   */
  save() {

  }

  /**
   * just add to collection model (without save).
   * Example: new created RestModel from modal dialog
   */
  pushModel(model) {
    if (!model._uuid) {
      model.updateUuid(this.uuidKey);
    }
    // push to AllData because .data its only paginated
    this.allItems.push(model);
  }
}
