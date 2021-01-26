import {IAttributeFilter} from './attribute';
import {AttributeFilterValue, SearchFilterValue} from '../../collection/interface';

export interface IFilterService {
  getSearch(): SearchFilterValue;
  getValue(name): AttributeFilterValue;
  setValue(name: string, value: AttributeFilterValue);
  addFilter(attribute, config?);
  getFilter(attribute): IAttributeFilter;
  getFilters(): FiltersStorage;
  hasFilter(name): boolean;
  getConfig();
}

export type FiltersStorage =  {
  [key: string]: IAttributeFilter
};



