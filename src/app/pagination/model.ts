import {IPaginationModel, PaginationState} from './interface';
import {PAGINATION_DEFAULT} from './default';

export class PaginationModel implements IPaginationModel {
  /**
   * All items count
   */
  public count: number;

  /**
   * Items per page
   */
  public size: number;

  /**
   * Current page number (zero-based)
   */
  public current: number;

  public limit: number;

  constructor(state?: Partial<PaginationState>) {
    // console.log('PaginationModel');
    Object.assign(this, PAGINATION_DEFAULT, state);
  }

  currentPage(): number {
    return this.current;
  }

  setCurrentPage(page: number) {
    this.current = page;
  }

  getOffset(): number {
    return this.current * this.size;
  }

  itemsCount(count: number): number {
    this.count = count ?? this.count;
    return this.count;
  }

  pageSize(): number {
    return this.size;
  }

  pagesCount(): number {
    return Math.ceil(this.count / this.size);
  }
}
