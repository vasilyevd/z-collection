import {IFilterFormConfig} from './interface';
import {BaseFilter} from './base.filter';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Directive, Inject, Injectable, Injector} from '@angular/core';

/**
 * Base class for create any Filter forms
 * - store current form state
 * - linked with Filter (update or get information on some events)
 */
@Injectable()
export abstract class BaseFilterForm {

  protected abstract $config(): IFilterFormConfig;

  protected abstract init(): void;

  protected _config: IFilterFormConfig;

  protected form: FormGroup;

  protected _initState;

  constructor(@Inject(BaseFilter) public filter?: BaseFilter, @Inject(FormBuilder) public fb?: FormBuilder) {
    console.log('BaseFilterForm:constructor', this);
    console.log(filter);

    //   // - self value (initiated on create)
    //   // - self current state
    //   // - inform filter about changes in value
    //   // - listen filter about any changes in it value
    //   // - has information about used attributes from filter in this form (for work only with its)

    // take form configuration
    this._config = this.$config();

    // create Form structure by Filter structure (Groups and Controls)
    this.useFilter(filter);

    // need before init other values by logic?
    // Ex: some attribute has value A and other attribute by logic need have value A1
    // if Yes - we store it (A1) and on apply sent its values...

    // save form state for possible Reset/Cancel
    this._initState = this.form.value;





    // просто создаем форму? наверное этого недостаточно - так как элементы формы ограничены небольшим набором дейтвий и свойств
    // таких как: set, patch, pristine, dirty и по большей части относятся к UI а не к логике

    // filter form must be store
    // - self value (initiated on create)

    // - self current state (cuurent is form.value used for display in UI)

    // - inform filter about changes in value
    // - listen filter about any changes in it value
    // - has information about used attributes from filter in this form (for work only with its)


    this.init();
  }

  useFilter(filter: BaseFilter) {
    this.filter = filter;

    this.form = this.fb.group({});

    Object.keys(filter.getFilters()).forEach((name) => {
      const attributeFilter = this.filter.getFilter(name);

      // create FormControls structure for filter
      if(attributeFilter.isEnabled()) {
        let control: AbstractControl;
        switch (attributeFilter.type) {
          case 'RANGE_DATE':
            control = this._buildRangeControl(attributeFilter.value);
            break;
          default:
            control = new FormControl(attributeFilter.value);
        }
        this.form.registerControl(name, control);

        // set value for control

      }
    });
  }

  getFilter() {
    return this.filter;
  }

  getValue() {
    return this.form.value;
  }

  _buildRangeControl(value) {
    const c = new FormGroup({
      from: new FormControl(),
      to: new FormControl()
    });
    if(value){
      c.setValue(value);
    }
    return c;
  }

}
