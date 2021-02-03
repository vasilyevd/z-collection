import { Component, OnInit } from '@angular/core';
import {XFilter} from '../../filter2/test/XFilter';
import {XSideFilterForm} from '../../filter2/test/XSideForm';
import {XViewFilterForm} from '../../filter2/test/XViewForm';
import {ShippingRulesCollection} from '../../modules/shipping-rules/collection/collection';
import {BaseFilter} from '../../filter2/base.filter';

@Component({
  selector: 'app-filters2',
  templateUrl: './filters2.component.html',
  styleUrls: ['./filters2.component.css'],
  providers: [
    {provide: BaseFilter, useClass: XFilter },
    XSideFilterForm, XViewFilterForm,
  ]
})
export class Filters2Component implements OnInit {

  public collection: ShippingRulesCollection;

  constructor(
    public filter: BaseFilter,
    public sideForm: XSideFilterForm,
    public viewForm: XViewFilterForm,
  ) {
    console.log('Filters2Component:filter', filter);
    console.log('Filters2Component:sideForm', sideForm);
    console.log('Filters2Component:viewForm', viewForm);

    this.collection = new ShippingRulesCollection();
  }

  ngOnInit(): void {
    console.log('sideForm.filter', this.sideForm.getFilter());
  }

}
