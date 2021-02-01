import {Component, Input, OnInit, SkipSelf} from '@angular/core';
import {IAttributeFilter} from '../../interface';

@Component({
  selector: 'app-filter-field',
  templateUrl: './filter-field.component.html',
  styleUrls: ['./filter-field.component.css'],
})
export class FilterFieldComponent implements OnInit {

  @Input() filter: IAttributeFilter

  ngOnInit(): void {
    console.log('APP-FILTER-FIELD');
  }

}
