import {Observable} from 'rxjs';
import {IAttributeFilter} from './attribute';

export type IFilterConfig = {
  [key: string]: {
    type: string,
    ui?: string,
    label?: string,
    hint?: string | boolean,
    enum?: FilterEnumConfig | ((filter?: IAttributeFilter) => FilterEnumConfig)
  }
}

export type FilterEnumConfig<T = any> = T[] | Observable<T[]>
