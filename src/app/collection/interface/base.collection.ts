/**
 * Simple iterable Collection
 */
export interface ICollection {
  /**
   * Contain list of data that exist in current collection
   */
  items: any[];

  /**
   * Provide list of data that exist in current collection
   */
  all(): any[];

  /**
   * Add model to data list
   */
  add(item);

  remove(item);

  /**
   * Remove all from Collection
   */
  clear();

  isEmpty(): boolean;

  hasItems(): boolean;

  size(): number;

  forEach(iterator);

  doFilter(filter);

  findIndex(finder: () => number);

  /**
   * How many records collection contains
   */
  // count(): number;
}

