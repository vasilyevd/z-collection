import {Component, OnInit} from '@angular/core';
import {ShippingRulesCollection} from './modules/shipping-rules/collection/collection';
import {ShippingRulesFilter} from './modules/shipping-rules/filters/settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ShippingRulesFilter]
})
export class AppComponent implements OnInit {
  title = 'z-collection';

  public collection: ShippingRulesCollection;

  constructor(private filterSettings: ShippingRulesFilter) {}

  ngOnInit(): void {
    this.collection = new ShippingRulesCollection();
    this.collection.load();

    // tell collection about use this filter object
    this.collection.useFilter(this.filterSettings);

    // so, now collection can use usedFilter for take SearchSettings.filter;

    // - configure search (UI or Programmatic class use)

  }

}
