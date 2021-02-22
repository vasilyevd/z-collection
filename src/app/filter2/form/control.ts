import {AbstractControl} from '@angular/forms';
import {isObservable, Observable, Subject} from 'rxjs';
import {$Util} from '../../core/utils/common';
import {distinctUntilChanged} from 'rxjs/operators';
import {Utils} from 'tslint';

export class FilterControl {
  public control: AbstractControl;
  private valueChangesSubject = new Subject<any>();
  public valueChanges: Observable<any> = this.valueChangesSubject.asObservable();

  private _isDisabledFn = () => {
    return false;
  }

  constructor(public config, control?: AbstractControl ){
    // console.log('FilterControl created with config', config);

    // init enum
    this.initEnumsList(config.enum);

    this._isDisabledFn = $Util.isFunction(config.isDisabled) ? config.isDisabled : this._isDisabledFn;

    if (control) {
      console.log(control);
      this.useControl(control);
    }
  }

  get pinned(): boolean {
    return this.config.pinned;
  }

  public useControl(formControl): void {
    this.control = formControl;
    this.subscribeToControl(formControl);
  }


  // @TODO: return Observable (for not subscribe without needed) with switchPipe
  private subscribeToControl(formControl: AbstractControl): void {
    formControl.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(value => {
      console.log('(FormControl -> FilterControl)', this.name(), value);
      // we can validate self?
      // we can inform FilterForm about changes
      // console.log('FilterControl emit event with self (for FilerForm)', this);
      this.valueChangesSubject.next(value);
    });
  }

  public name(): string {
    return this.getConfig('name');
  }

  public label(): string {
    return this.config.label || this.config.name;
  }

  public value(): any {
    return this.control.value;
  }

  isDisabled(): boolean {
    const r = this._isDisabledFn.apply(this, [this]);
    console.log('_isDisabledFn return ', r);
    return r;
  }

  /**
   * Checks is need to show/render this
   */
  isShow(): boolean {
    return !this._isDisabledFn.call(this, arguments);
  }

  isEmpty(): boolean {
    const v: {} = this.value();
    // console.log(this.name(), v, typeof v);
    if ($Util.isObject(v)) {
      return Object.values(v as {[s: string]: any}).reduce((empty: boolean, value) => {
        return empty && [null, ''].includes(value);
      }, true);
    }
    return [null, ''].includes(this.value());
  }

  // private _isGroup() {
  // }

  // ENUMS
  private enumList: any[];
  private initEnumsList(configEnum): void {
    let enumList = configEnum;
    if ($Util.isFunction(enumList)) {
      const builderFn: (filter) => any[] = enumList;
      enumList = builderFn(this);
    }
    if (isObservable(enumList)) {
      const observableEnum: Observable<any[]> = enumList as Observable<any[]>;
      observableEnum.subscribe(newEnumList => {
        this.enumList = newEnumList;
      });
    } else if (enumList) {
      this.enumList = enumList;
    }
  }
  setEnum(list): void {
    this.enumList = list;
  }
  getEnum(): any[] {
    return this.enumList;
  }
  getConfig(name): any {
    return this.config[name];
  }

}
