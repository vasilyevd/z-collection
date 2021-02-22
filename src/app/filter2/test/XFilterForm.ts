import {BaseFilterForm} from '../form/base.form';
import {Injectable, Injector, OnInit} from '@angular/core';
import {IFilterFormConfig} from '../interface';
import {Observable, of} from 'rxjs';
import {FilterControl} from '../form/control';
import {HttpClient} from '@angular/common/http';

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

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  $config(): IFilterFormConfig {
    const form = this;
    return {
      id: {
        label: 'Rule ID',
        hint: null,
        ui: 'input:text',
        isDisabled(this: FilterControl): boolean {
          console.log('ID:isDisabled', form.getValue('action'));
          console.log(this, this.value(), this.value() === '4');
          return this.value() === '4';
        }
      },
      action: {
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
        ui: 'select',
        emptyLabel: 'Any(fromConfig)',
        isDisabled(this: BaseFilterForm): boolean {
          return form.getValue('id') === '5';
        }
      },
      action2: {
        label: 'Action2',
        enum: aaa,
        ui: 'select',
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

  onChange(changeValue): void {
    /**
     * 1 - можем просто все значения фильтров выставить в новые.
     *  т.к. мы не знаем что там менялось в других формах - то по сути это и прийдется сделать.
     *
     * 2 - Всё ещё не описана логика как обновлять поля которые имеют "взаимоотношения" с другими или внешний источник данных.
     *   а) если такое взаимотношение где-то описано, то его необходимо "повторить"
     *   например: С2 должен показывать значения отфильтрованные согласно значению С1
     *   например:
     */
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
