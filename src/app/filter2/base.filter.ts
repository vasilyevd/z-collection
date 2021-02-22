/* tslint:disable:member-ordering */
import {
  AttributeFilterType,
  AttributeFilterValue,
  FilterRangeValue,
  Filters,
  IAttributeFilter,
  IAttributeFilterConfig,
  IFilterConfig
} from './interface';
import {Observable, Subject} from 'rxjs';
import {BaseFilterForm} from './form/base.form';
import {$Util} from '../core/utils/common';

export abstract class BaseFilter {

  public _uid: number;

  private readonly _config: IFilterConfig;

  protected _filters: Filters = {};

  private changeSubject: Subject<[any, BaseFilterForm?]> = new Subject();

  public change: Observable<[any, BaseFilterForm?]> = this.changeSubject.asObservable();

  protected abstract $config(): IFilterConfig;

  constructor(config?) {
    this._uid = Math.floor(Math.random() * 10000);
    this._config = config ?? this.$config();
    this.initByConfig();
  }

  private initByConfig(): void {
    const config = this._config;

    Object.keys(config).forEach((attribute) => {
      // register Filter model
      this.addFilter(attribute, this._config[attribute]);
    });
  }

  public addFilter(attribute, config: IAttributeFilterConfig): void {
    switch (config.type) {
      case 'RANGE_DATE':
        this._filters[attribute] = new RangeAttributeFilter(attribute, config);
        break;
      default:
        this._filters[attribute] = new AttributeFilter(attribute, config);
    }
  }

  /**
   * Provide AttributeMOdel by name
   */
  public getFilter(attribute): IAttributeFilter {
    return this._filters[attribute];
  }

  /**
   * Provide all Filter AttributesModels
   */
  public getFilters(): Filters {
    return this._filters;
  }

  /**
   * Checks is filter exist
   */
  hasFilter(name): boolean {
    return Boolean(this.getFilter(name));
  }


  /**
   * Set new value for filter
   * - from any FilterForms or any external
   */
  public update(partValue: any, emmiter?: BaseFilterForm): void {
    // update self value
    Object.keys(this.getFilters()).forEach((filterName) => {
      const filter = this.getFilter(filterName);
      if (filter && !$Util.isUndefined(partValue[filterName])) {
        filter.value = partValue[filterName];
      }
    });

    // and inform any related FilterForms about this nae value
    this.changeSubject.next([partValue, emmiter]);
  }
}

abstract class BaseAttributeFilter implements IAttributeFilter {

  protected _value: AttributeFilterValue;

  private _type: AttributeFilterType;

  abstract isEnabled(): boolean;

  constructor(public name: string, config?) {
    this._type = config.type || 'ILIKE_STRING';
  }

  get value(): AttributeFilterValue {
    return this._value;
  }

  set value(value: AttributeFilterValue) {
    this._value = value;
  }

  get type(): AttributeFilterType {
    return this._type;
  }
}

export class AttributeFilter extends BaseAttributeFilter {
  private _enabled: boolean;

  constructor(name, config?: IAttributeFilterConfig) {
    super(name, config);
    this._enabled = config.enabled ?? true;
    // console.log(`BaseAttributeFilter model created (${name})`);
  }

  isEnabled(): boolean {
    return this._enabled;
  }
}

export class RangeAttributeFilter<T = number> extends AttributeFilter {
  protected _value: Partial<FilterRangeValue<T>> = {
    from: null,
    to: null
  };

  get value(): Partial<FilterRangeValue<T>> {
    if (this._value && (this._value['from'] || this._value['to'])) {
      return this._value;
    }
    return null;
  }
  set value(value: Partial<FilterRangeValue<T>>) {
    this._value = value;
  }
}
