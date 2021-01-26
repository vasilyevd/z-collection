import {$Util} from '../core/utils/common';
import {isObservable, Observable} from 'rxjs';
import {AttributeFilterValue, FilterRangeValue} from '../collection/interface';
import {IAttributeFilter} from './interface';

export class AttributeFilter implements IAttributeFilter {
  private _type;
  protected _value: AttributeFilterValue;
  private _label;
  private _hint;
  private _enum_list: any[];

  constructor(name, config?) {
    console.log('CREATED-ATTRIBUTE-FILTER-WITH-CONFIG', config);

    this._label = config.label || null;
    this._hint = config.hint || null;
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
