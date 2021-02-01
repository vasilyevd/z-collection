import {FormBuilder, FormGroup} from '@angular/forms';
import {Directive} from '@angular/core';

/**
 * Base class for define self filter components
 */
@Directive()
export abstract class BaseFilterForm {

  public form: FormGroup;

  constructor(protected fb: FormBuilder) {
    this.formInit();
  }

  formInit(): void {
    this.form = this.fb.group({});
  }

}
