import {$Util} from '../core/utils/common';
import {isObservable, Observable} from 'rxjs';
import {AttributeFilterValue, FilterRangeValue} from '../collection/interface';
import {IAttributeFilter, IAttributeFilterConfig} from './interface';

/**
 * Core implementation
 */
abstract class BaseAttributeFilter implements IAttributeFilter {

  get value() {
    return this.getValue();
  }
  private _type;
  protected _value: AttributeFilterValue;
  private _enum_list: any[];

  public name: string;

  constructor(name, config?) {
    this.name = name;
    console.log('CREATED-ATTRIBUTE-FILTER-WITH-CONFIG', config);
    this._type = config.type || 'ILIKE_STRING';

    let configEnum = config.enum;

    // console.log('ENUM-TYPES-DETECTION:');
    // console.log('isObservable', isObservable(configEnum));
    // console.log('isFunction', $Util.isFunction(configEnum));
    // console.log('isArray', $Util.isArray(configEnum));

    if($Util.isFunction(configEnum)) {
      // console.log('  ENUM-IS-FUNCTION');
      const builderFn: (filter) => any[] = configEnum;
      configEnum = builderFn(this);
    }

    // got observable
    if(isObservable(configEnum)) {
      const observableEnum: Observable<any[]> = configEnum as Observable<any[]>;
      // console.log('  USE-UNUM-FROM-OBSERVABLE-OBJECT');
      observableEnum.subscribe(newEnumList => {
        // console.log('   GOT ENUM from observer', newEnumList);
        this._enum_list = newEnumList;
      });
    }
    // got static enum list
    else if (configEnum) {
      // console.log('  USE STATIC ENUM');
      this._enum_list = configEnum;
    }
  }

  getValue() {
    return this._value;
  }

  setValue(value: AttributeFilterValue) {
    this._value = value;
  }

  setEnum(list) {
    this._enum_list = list;
  }

  getEnum() {
    return this._enum_list;
  }

  /**
   * Provide type
   */
  getType() {
    return this._type;
  }

  public onChange: () => void

  abstract getHint(): string;

  abstract getLabel(): string;

  abstract isDisabled(): boolean;

  abstract isEnabled(): boolean;

  abstract isVisible(): boolean;

}

/**
 * Implementation with UI part.
 * Now use only this variant
 */
export class AttributeFilter extends BaseAttributeFilter implements IAttributeFilter {
  private _label: string;
  private _hint: string;
  private _disabled: boolean;
  private _enabled: boolean;
  private _visible = true;

  constructor(name, config?: IAttributeFilterConfig) {
    super(name, config);

    this._label = config.label || null;
    this._hint = config.hint || null;
    this._enabled = config.enabled ?? true;
  }

  getHint(): string {
    return this._hint;
  }

  getLabel(): string {
    return this._label;
  }

  isDisabled(): boolean {
    return this._disabled;
  }

  isEnabled(): boolean {
    return this._enabled;
  }

  isVisible(): boolean {
    return this._visible;
  }

}

export class RangeAttributeFilter<T = number> extends AttributeFilter {
  protected _value: FilterRangeValue<T>;

  getValue() {
    return this._value;
  }
  setValue(value: FilterRangeValue<T>) {
    this._value = value;
  }
}
