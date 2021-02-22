import {Observable} from 'rxjs';

/**
 * Define filter structure (it attributes)
 */
export type IFilterConfig = {
  [name: string]: IAttributeFilterConfig
};

/**
 * Define behaviour (UI) configuration for attributes in filter
 */
export type IFilterFormConfig = {
  // [key: string]: IAttributeFilterFormConfig
  [key: string]: IFilterControlConfig
};


/**
 * Attribute TYPE and Enabled
 */
export type IAttributeFilterConfig = {
  type: string,
  enabled?: boolean,
};

/**
 * Attribute ENUM, LABEl, HINT, DISABLED_LOGIC, VISIBLE_LOGIC.
 * All DATA needed for build any UI Input Components in form.
 */
export type IAttributeFilterFormConfig = {
  enum?: FilterEnumConfig | ((filter?: IAttributeFilter) => FilterEnumConfig),
  ui?: string,
  label?: string,
  hint?: string,
  disabled?: boolean,
  visible?: boolean,
  pinned?: boolean
};

export type IFilterControlConfig = {
  enum?: FilterEnumConfig | ((filter?: IAttributeFilter) => FilterEnumConfig),
  ui?: string,
  label?: string,
  emptyLabel?: string,
  hint?: string,
  disabled?: boolean,
  isDisabled?: () => boolean,
  visible?: boolean,
  submit?: boolean,
};


export type Filters<T extends IAttributeFilter = IAttributeFilter> =  {
  [key: string]: IAttributeFilter
};

export interface IAttributeFilter {
  name: string;
  value: AttributeFilterValue;
  readonly type: AttributeFilterType;

  isEnabled(): boolean;
}

export interface IAttributeFormFilter {
  name: string;
  value: AttributeFilterValue;
  readonly type: AttributeFilterType;
}

export type AttributeFilterType = string;

export type AttributeFilterValue = string | number | boolean | FilterRangeValue;

export type FilterRangeValue<T = any> = {
  from: T;
  to: T;
};


export type FilterEnumConfig<T = any> = T[] | Observable<T[]>;

