import {AttributeFilterValue} from '../../collection/interface';

export interface IAttributeFilter {
  onChange: () => void;
  getValue(): AttributeFilterValue;
  setValue(value: AttributeFilterValue): void;
  setEnum(list);
  getEnum();
  getType();
}
