import {Injectable} from '@angular/core';
import {BaseFilter} from '../base.filter';
import {IFilterConfig} from '../interface';

@Injectable()
export class XFilter extends BaseFilter {
  $config(): IFilterConfig {
    return {
      id: {
        type: 'LIKE_INT',
      },
      action: {
        type: 'EQUAL_ENUM',
      },
      action2: {
        type: 'EQUAL_ENUM',
      },
      hub: {
        type: 'EQUAL_ENUM',
      },
      testFn: {
        type: 'EQUAL_ENUM',
        enabled: false,
      },
      testFn2: {
        type: 'EQUAL_ENUM',
      },
      date: {
        type: 'RANGE_DATE',
      }
    };
  }

  constructor() {
    super();
    console.log('XFilter created', this);
  }
}
