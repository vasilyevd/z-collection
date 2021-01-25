import {ICollection} from './base.collection';

/**
 * Collection with item Models Constructor
 */
export interface IModelsCollection extends ICollection {
  /**
   * Factory for create item Model
   */
  itemFactory;

  /**
   * Provide item Model factory
   */
  getItemFactory();

  /**
   * Interface method
   * - provide UUID key used for identify Model
   * - set UUID key
   */
  uniqueKey(key?: any);

  /**
   * Create collection item Model
   */
  itemConstruct(data?);

  updateItem(item, data);

  /**
   * Find duplicate in Collection
   * - if collection data provided by API - ask API about it.
   * - if collection data provided from Array - check it array.
   * So this method must use collection data provider.
   */
  isDuplicate(item): boolean;

  /**
   * Raw data of Collection Models
   */
  toData(): any[];
}
