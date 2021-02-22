import {XFilterForm} from './XFilterForm';
import {Injectable} from '@angular/core';
import {IFilterFormConfig} from '../interface';
import {of} from 'rxjs';

/**
 * - ui configuration for side form
 * - THIS is manage state of side form
 * - config behaviour of update Filter
 */
@Injectable()
export class XSideFilterForm extends XFilterForm {


  $config(): IFilterFormConfig {
    return this.mergeConfigs(super.$config(), {
      id: {
        ui: 'input:text',
        label: 'Rule ID',
        hint: null,
      },
      action: {
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
        enum: of<{key: string, value: number}[]>([{key: 'off1', value: 1}, {key: 'off2', value: 3}] )
      },
    });
  }

}
