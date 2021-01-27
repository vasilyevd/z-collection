import { Component, OnInit } from '@angular/core';
import {ShippingRulesCollection} from '../../modules/shipping-rules/collection/collection';
import {ShippingRulesFilter} from '../../modules/shipping-rules/filters/model';

@Component({
  selector: 'app-shipping-page',
  templateUrl: './shipping-page.component.html',
  styleUrls: ['./shipping-page.component.css']
})
export class ShippingPageComponent implements OnInit {

  public collection: ShippingRulesCollection;

  constructor(
    public filter: ShippingRulesFilter,
  ) {}

  ngOnInit(): void {
    this.collection = new ShippingRulesCollection();
    // tell collection about use this filter object
    this.collection.setFilter(this.filter);
    this.collection.load();

    // so, now collection can use usedFilter for take SearchSettings.filter;

    // - configure search (UI or Programmatic class use)

    console.log('COLLECTION:', this.collection);
  }


  testProgramChanges() {
    console.log('testProgramChanges');
    this.filter.setValue('id', 555555);
  }
}
