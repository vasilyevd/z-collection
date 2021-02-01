import {ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {IAttributeFilter, IFilterConfig, IFilterService} from '../../../filters/interface';
import {FormGroupDirective} from '@angular/forms';
import {BaseFilterForm} from './base.filter.form';
import {of} from 'rxjs';

@Component({
  selector: 'shipping-rule-filter-view',
  templateUrl: './view.form.html',
  styleUrls: ['./view.form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormGroupDirective]
})
export class ShippingRulesFilterView extends BaseFilterForm implements OnInit {

  @Input() filter: IFilterService;

  @Output() apply = new EventEmitter<any>();

  private config = {
    id: {
      pinned: true
    },
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(formValue => {
      console.info('view FORM VALUE CHANGED TO', formValue);
    });
  }

  f(name): IAttributeFilter {
    return this.filter.getFilter(name);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.apply.emit(this.form.value);
  }

  showField(name) {
    const filter = this.f(name);
    const byFilter = filter && filter.isEnabled() && filter.isVisible();

    const field = this.form.get(name);
    console.log('field', field);
    const byForm = !!field;
    console.log('show field ', name, field, byFilter, byForm);

    return byFilter && (byForm || this.isPinned(name));
  }

  isPinned(name) {
    return !!this.config?.[name] && this.config[name].pinned;
  }

}
