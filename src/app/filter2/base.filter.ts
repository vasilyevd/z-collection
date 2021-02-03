/* tslint:disable:member-ordering */
import {AttributeFilterType, AttributeFilterValue, Filters, IAttributeFilter, IAttributeFilterConfig, IFilterConfig} from './interface';

export abstract class BaseFilter {

  private _config: IFilterConfig;

  protected abstract $config(): IFilterConfig;

  constructor(config?) {
    console.log('BaseFilter:constructor');
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

  public addFilter(attribute, config): void {
    this._filters[attribute] = new AttributeFilter(attribute, config);
  }
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
    console.log(`BaseAttributeFilter model created (${name})`);
  }

  isEnabled(): boolean {
    return this._enabled;
  }
}
