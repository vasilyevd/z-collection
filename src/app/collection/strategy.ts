export enum CollectionStartStrategy {
  /**
   * Nothing happens.
   * For take items in collection run load() method
   * Default for all Data Provider types
   */
  NONE,

  /**
   * On start collection show all items defined on creation
   * Pagination on that strategy no has active page.
   * This strategy triggered if created HttpDataProvider with non-empty data.
   */
  SHOW_ALL,

  /**
   * Items on initial data are considered as items that starts from the specified page (in pagination)
   * Ex: data: [30x{...}], Pagination: {size: 10, page: 2, count: 100}
   *  - show grid with first 10 items in data
   *  - pagination show 10 pages
   *  - pagination activated as page #2
   *  This strategy analog of create empty Collection and load it.
   */
  FORWARD_PAGINATION,

  /**
   * Initial data are considered as items that starts from storage start.
   * Items provided to collection extracted from data by pagination.
   * Ex: data: [30x{...}], Pagination: {size: 10, page: 2, count: 100}
   *  - show grid with items 11 - 20 in data (second page in data)
   *  - pagination show 10 pages
   *  - pagination activated as page #2
   */
  EXTRACT_BY_PAGINATION
}
