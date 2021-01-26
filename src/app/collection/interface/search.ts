import {IPaginationModel} from '../../pagination/interface';

export interface SearchSettings {
  sort?: any;
  filter?: any;
  pagination?: IPaginationModel;
}

export type SearchFilterValue<T = {}> = {
  [K in keyof T | string]?: AttributeFilterValue
}

export type AttributeFilterValue = string | number | boolean | FilterRangeValue;

export type FilterRangeValue<T = any> = {
  from: T;
  to: T;
};
