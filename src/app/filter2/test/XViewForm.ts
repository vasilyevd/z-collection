import {Injectable} from '@angular/core';
import {XFilterForm} from './XFilterForm';
import {XFilter} from './XFilter';
import {IFilterFormConfig} from '../interface';
import {Observable, of} from 'rxjs';

/**
 * - ui configuration for side form
 * - THIS is manage state of side form
 * - config behaviour of update Filter
 */
@Injectable()
export class XViewFilterForm extends XFilterForm {

  $config(): IFilterFormConfig {
    return Object.assign(super.$config(), {
      id: {
        ui: 'input:text',
        label: 'Rule ID',
        hint: null,
      },
      action3: {
        ui: 'select',
        label: 'Action',
        enum: [
          {
            key: 'Allow',
            value: 'ALLOW'
          },
          {
            key: 'Deny',
            value: 'DENNY'
          }
        ],
      },
      testFn2: {
        label: 'test2',
        enum: this.gotMyObservable
      },
    });
  }

  /**
   * Custom function for return enum as Observable resource
   */
  private gotMyObservable(): Observable<{ key: string; value: number }[]> {
    return of<{key: string, value: number}[]>([{key: 'fob', value: 10}, {key: 'fob2', value: 30}] );
  }

}
