import {Component, OnInit} from '@angular/core';
import {ShippingRulesCollection} from './modules/shipping-rules/collection/collection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'z-collection';

  public collection: ShippingRulesCollection;

  ngOnInit(): void {
    this.collection = new ShippingRulesCollection();


    this.collection.load().subscribe(data => {
      console.log('after load', data);
      console.log(this.collection);
    });
  }

}
