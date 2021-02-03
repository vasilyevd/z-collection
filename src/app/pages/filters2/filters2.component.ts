import { Component, OnInit } from '@angular/core';
import {XFilter} from '../../filter2/test/XFilter';
import {XSideFilterForm} from '../../filter2/test/XSideForm';
import {XViewFilterForm} from '../../filter2/test/XViewForm';
import {ShippingRulesFilter} from '../../modules/shipping-rules/filters/model';

@Component({
  selector: 'app-filters2',
  templateUrl: './filters2.component.html',
  styleUrls: ['./filters2.component.css'],
  providers: [XFilter, XSideFilterForm, XViewFilterForm]
})
export class Filters2Component implements OnInit {

  constructor(
    public filter: XFilter,
    public sideForm: XSideFilterForm,
    public viewForm: XViewFilterForm,
  ) {
    console.log('Filters2Component:filter', filter);
    console.log('Filters2Component:sideForm', sideForm);
    console.log('Filters2Component:viewForm', viewForm);
  }

  ngOnInit(): void {
  }

}
