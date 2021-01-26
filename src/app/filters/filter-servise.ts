import {$Util} from '../core/utils/common';
import {AttributeFilter} from './filter-attribute';
import {
  FiltersStorage,
  IFilterConfig,
  IFilterService
} from './interface';
import {SearchFilterValue} from '../collection/interface';

export abstract class FilterService<T = any> implements IFilterService {

  /**
   * Method for define filter attributes configuration (UI and behaviour) on usage in extendable class
   */
  protected abstract $config(): IFilterConfig;

  /**
   * Store all AttributeFilters models
   */
  private _filters: FiltersStorage = {};

  private _config: IFilterConfig;

  private _attributes;

  private _eventCallbacks = [];

  constructor(config?) {
    // console.log('FILTER-SERVICE', 'CONSTRUCTOR');
    this._config = config ?? this.$config();

    Object.keys(this._config).forEach((attribute) => {
      this.addFilter(attribute, this._config[attribute]);
    });
  }

  /**
   * Abstract structure for describing the entered value
   */
  private value: SearchFilterValue<T>  = {};

  /**
   * Provide Filter Search Value - abstract structure for describing the entered value.
   * This value used by collection for search
   */
  public getSearch() {
    return this.value;
  }

  /**
   * Provide Search Value by filter name
   */
  public getValue(name) {
    return this.value[name];
  }

  /**
   * Set new value for related FilterAttributeModel by name
   */
  public setValue(name, value) {
    this.getFilter(name).setValue(value);
  }

  /**
   * Provide all Filter AttributesModels
   */
  public getFilters() {
    return this._filters;
  };

  /**
   * Provide AttributeMOdel by name
   */
  public getFilter(attribute) {
    return this._filters[attribute];
  };

  /**
   * Method for add to filter new AttributeModel by its config
   */
  public addFilter(attribute, config) {
    this._filters[attribute] = new AttributeFilter(attribute, config);
  }

  /**
   * Check if filter configured by attribute name
   */
  public hasFilter(attribute) {
    return Boolean(this._filters[attribute]);
  };

  /**
   * Provides the original configuration on which the filter was created
   */
  public getConfig() {
    return this._config;
  };

  toRequest() {
    return {};
  };

  addOnChangeEventListener(fn) {
    if ($Util.isFunction(fn)) {
      this._eventCallbacks.push(fn);
    }
  }
}
