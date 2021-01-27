import {FormBuilder, FormGroup} from '@angular/forms';
import {Directive} from '@angular/core';

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
