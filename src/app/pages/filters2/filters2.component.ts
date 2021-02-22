import { Component, OnInit } from '@angular/core';
import {XFilter} from '../../filter2/test/XFilter';
import {XSideFilterForm} from '../../filter2/test/XSideForm';
import {XViewFilterForm} from '../../filter2/test/XViewForm';
import {ShippingRulesCollection} from '../../modules/shipping-rules/collection/collection';
import {BaseFilter} from '../../filter2/base.filter';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-filters2',
  templateUrl: './filters2.component.html',
  styleUrls: ['./filters2.component.css'],
  providers: [
    // {provide: BaseFilter, useClass: XFilter },
    XSideFilterForm, XViewFilterForm,
  ]
})
export class Filters2Component implements OnInit {

  public collection: ShippingRulesCollection;

  public f;

  constructor(
    public filter: XFilter,
    public sideForm: XSideFilterForm,
    public viewForm: XViewFilterForm,
    private fb: FormBuilder
  ) {
    // console.log('Filters2Component:filter', filter);
    // console.log('Filters2Component:sideForm', sideForm);
    // console.log('Filters2Component:viewForm', viewForm);

    // filter.update({id: 777});
    filter.update({action: 'ALLOW'});

    sideForm.useFilter(filter);
    viewForm.useFilter(filter);
    // filter.update({id: 888});

    this.collection = new ShippingRulesCollection();


    console.log('================================================');
    console.log('After init page we have:');
    console.log('FilterService (as SearchFilter value concentrator)', this.filter);
    console.log('  - value:', filter._uid);
    console.log('Forms:');
    console.log('  SideForm service', this.sideForm);
    console.log('    - value:', sideForm.getValue());
    console.log('    - Angular form:', sideForm.getForm());
    console.log('    - FilterControls:', sideForm.getFilterControls());
    console.log('  ViewForm service', this.viewForm);
    console.log('    - value:', viewForm.getValue());
    console.log('    - Angular form:', viewForm.getForm());
    console.log('    - FilterControls:', viewForm.getFilterControls());
    console.log('--------------------------------------------------');

  }

  ngOnInit(): void {
    console.log('sideForm.filter', this.sideForm.getFilter());
  }


  viewFormApply(): void {
    this.viewForm.submit();
  }

}
