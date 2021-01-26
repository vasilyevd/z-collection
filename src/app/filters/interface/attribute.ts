import {AttributeFilterValue} from '../../collection/interface';

export interface IAttributeFilter {
  onChange: () => void;
  getValue(): AttributeFilterValue;
  setValue(value: AttributeFilterValue): void;
  setEnum(list);
  getEnum();
  getType();
}

/**
 * UI part of AttributeFilter
 */
export interface IAttributeFilter {

  /**
   * Label for use in Form Control
   */
  getLabel(): string;

  /**
   * Possible hint in form for Form Control
   */
  getHint(): string;

  /**
   * Developer setting - define usage of this attribute in filter now
   */
  isEnabled(): boolean;

  /**
   * Provide value for show or hide filter by custom Filter Logic (or by config outside of Filter)
   */
  isVisible(): boolean;

  /**
   * Provide disabled UI state.
   */
  isDisabled(): boolean;
}
