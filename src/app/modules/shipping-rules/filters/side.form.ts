import {ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {IFilterService} from '../../../filters/interface';
import {FormGroupDirective} from '@angular/forms';
import {BaseFilterForm} from './base.filter.form';

@Component({
  selector: 'shipping-rule-filter',
  templateUrl: './side.form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormGroupDirective]
})
export class ShippingRulesFilterForm extends BaseFilterForm implements OnInit {

  // @todo: can move to base class?
  @Input() filter: IFilterService;

  // @todo: can move to base class?
  @Output() apply = new EventEmitter<any>();

  ngOnInit(): void {
    // @todo: can subscribe automaticaly and call defined method (or not defined)
    this.form.valueChanges.subscribe(formValue => {
      console.info('FORM VALUE CHANGED TO', formValue);
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.apply.emit(this.form.value);
  }
}
