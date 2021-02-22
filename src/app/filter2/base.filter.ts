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

  protected abstract $config(): IFilterConfig;

  constructor(config?) {
    console.log('BaseFilter:constructor');
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

  protected _filters: Filters = {};

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
    console.warn('Filter:update', partValue, emmiter);
    // update self value
    // console.log('how we set value for filter?');
    // console.log('Iterate all filters?', 'Iterate all values?');
    Object.keys(this.getFilters()).forEach((filterName) => {
      const filter = this.getFilter(filterName);
      if (filter && !$Util.isUndefined(partValue[filterName])) {
        // console.log('try update', filterName, partValue[filterName]);
        filter.value = partValue[filterName];
      }
    });
    // and inform any related FilterForms about this nae value
    this.changeSubject.next([partValue, emmiter]);
  }

  private changeSubject: Subject<[any, BaseFilterForm?]> = new Subject();
  public change: Observable<[any, BaseFilterForm?]> = this.changeSubject.asObservable();
}

abstract class BaseAttributeFilter implements IAttributeFilter {

  protected _value: AttributeFilterValue;

  private _type: AttributeFilterType;

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

  abstract isEnabled(): boolean;
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
  protected _value: FilterRangeValue<T> = {
    from: null,
    to: null
  };

  get value() {
    if (this._value && (this._value['from'] || this._value['to'])) {
      return this._value;
    }
    return null;
  }
  set value(value: FilterRangeValue<T>) {
    this._value = value;
  }
}
