import {Observable} from 'rxjs';
import {IAttributeFilter} from './attribute';

export type IAttributeFilterConfig = {
  type: string,
  ui?: string,
  label?: string,
  hint?: string,
  enum?: FilterEnumConfig | ((filter?: IAttributeFilter) => FilterEnumConfig),
  enabled?: boolean,
  disabled?: boolean,
  visible?: boolean
}

export type IFilterConfig = {
  [key: string]: IAttributeFilterConfig
}

export type FilterEnumConfig<T = any> = T[] | Observable<T[]>
