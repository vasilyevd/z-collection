import { Component } from '@angular/core';
import {ShippingRulesCollection} from './modules/shipping-rules/collection/collection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'z-collection';

  public collection: ShippingRulesCollection;

}
