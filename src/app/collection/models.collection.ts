import {Collection} from './base.collection';
import {$Util} from '../core/utils/utils';
import {Data} from '../core/types';
import {CollectionConfiguration, CollectionItemFactory, IModelsCollection} from './interface';

export class ModelsCollection extends Collection implements IModelsCollection {

  private _itemFactory: CollectionItemFactory;

  /**
   * Unique key for items in collection.
   * By default or in many cases - same as Primary Key in Model.
   */
  private modelUuid;

  constructor(data?, config?: CollectionConfiguration) {
    super();

    /**
     * ItemConstructor
     * for collection Items
     */
    this.setupItemFactory(config);
  }

  uniqueKey(key?: any) {
    if (!$Util.isUndefined(key)) {
      this.modelUuid = key;
    }
    return this.modelUuid;
  }

  get itemFactory(): CollectionItemFactory {
    return this._itemFactory;
  }
  set itemFactory(c: CollectionItemFactory) {
    this._itemFactory = c;
  }

  public getItemFactory() {
    return this.itemFactory;
  }

  public itemConstruct(data) {
    return this.itemFactory(data);
  }

  protected setupItemFactory({itemConstructor: c, itemFactory: f}: CollectionConfiguration) {
    const correctFactory = $Util.isFunction(c) ? (d: Data) => new c(d) : (
      $Util.isFunction(f) ? f : (d: Data) => Object.assign({}, d)
    );
    this.itemFactory = (item) => {
      item = correctFactory(item);
      item._collection = this;
      return item;
    };
  }

  isDuplicate(item): boolean {
    throw new Error('Method not implemented.');
  }

  toData(): any[] {
    return [];
  }

  updateItem(item, data) {
    throw new Error('Method not implemented.');
  }
}
