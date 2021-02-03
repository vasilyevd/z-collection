import {IFilterConfig, IFilterFormConfig} from './interface';

/**
 * Base class for create any Filter forms
 * - store current form state
 * - linked with Filter (update or get information on some events)
 */
export abstract class BaseFilterForm {

  protected _config: IFilterFormConfig;

  protected abstract $config(): IFilterFormConfig;

  constructor() {
    this._config = this.$config();
  }
}
