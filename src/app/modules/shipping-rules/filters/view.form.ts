import {ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {IFilterService} from '../../../filters/interface';
import {FormGroupDirective} from '@angular/forms';
import {BaseFilterForm} from './base.filter.form';

@Component({
  selector: 'shipping-rule-filter-view',
  templateUrl: './side.form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormGroupDirective]
})
export class ShippingRulesFilterView extends BaseFilterForm implements OnInit {

  @Input() filter: IFilterService;

  @Output() apply = new EventEmitter<any>();

  ngOnInit(): void {
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
