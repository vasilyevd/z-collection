import {HttpHeaders} from '@angular/common/http';
import {Structure} from '../../core/types';

export interface AppApiResponse<T> {
  result: T;
  headers: HttpHeaders;
}

export interface ListingResponse<T = any> {
  data: T[];
  errors?: any; // @todo: define structure or delete if not used
}

export interface GridResponse<T = any> extends ListingResponse<T> {
  pagination?: PaginationResponse;
  sort?: any;
}

/**
 * Response on operations with Model
 * on create, read, update
 */
export interface ModelResponse<T> {
  data: T;
  errors?: ModelErrorsResponse<T>;
}
export type ModelErrorsResponse<T> = Structure<T> & { [key: string]: any; };

export type DataResponse<T> = T extends Array<any> ? GridResponse<T> : ModelResponse<T>;

/**
 * Response for Model's grid (list with pagination, sort, filtering)
 */
export interface PaginationResponse {
  itemsCount: number;
  pageSize: number;
  currentPage: number;
}

