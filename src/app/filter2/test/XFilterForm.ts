import {BaseFilterForm} from '../base.form';
import {Injectable, Injector, OnInit} from '@angular/core';
import {XFilter} from './XFilter';
import {FilterEnumConfig, IFilterFormConfig} from '../interface';
import {Observable, of} from 'rxjs';
import {FormGroup} from '@angular/forms';

const aaa = [
  {
    key: 'Allow',
    value: 'ALLOW'
  },
  {
    key: 'Deny',
    value: 'DENNY'
  }
];


/**
 * Common config and logic for all forms that use XFilter
 * - enums config
 * - logic beetwen filters
 * - functions etc.
 */
@Injectable()
export class XFilterForm extends BaseFilterForm {

  $config(): IFilterFormConfig {
    return {
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
      action2: {
        ui: 'select',
        label: 'Action2',
        enum: aaa,
      },
      hub: {
        ui: 'select',
        label: 'Hub',
        enum: this.gotObservable
      },
      testFn: {
        label: 'test',
        enum: this.someEnumListFunction,
      },
      testFn2: {
        label: 'test2',
        enum: of<{key: string, value: number}[]>([{key: 'off1', value: 1}, {key: 'off2', value: 3}] )
      },
      date: {
        label: 'Created At',
      }
    };
  }

  init() {
    console.log('XFilterForm', this);
  }

  /**
   * Custom function for return static enum list
   */
  private someEnumListFunction(filter): { key: string, value: any; }[] {
    return [
      { key: 'some1', value: 55 },
      { key: 'some2', value: 56 },
    ];
  }

  /**
   * Custom function for return enum as Observable resource
   */
  private gotObservable(): Observable<{ key: string; value: number }[]> {
    return of<{key: string, value: number}[]>([{key: 'fob', value: 10}, {key: 'fob2', value: 30}] );
  }
}
