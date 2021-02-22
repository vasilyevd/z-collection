import {AbstractControl} from '@angular/forms';
import {isObservable, Observable, Subject} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {$Util} from '../../core/utils/common';

export class FilterControl {

  public control: AbstractControl;

  private enumList: any[];

  private valueChangesSubject = new Subject<any>();

  public valueChanges: Observable<any> = this.valueChangesSubject.asObservable();

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

  public getConfig(name): any {
    return this.config[name];
  }

  get pinned(): boolean {
    return this.config.pinned;
  }

  public useControl(formControl): void {
    this.control = formControl;
    this.subscribeToControl(formControl);
  }

  private _isDisabledFn = () => {
    return false;
  }


  // @TODO: return Observable (for not subscribe without needed) with switchPipe
  private subscribeToControl(formControl: AbstractControl): void {
    formControl.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(value => {
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

  public isDisabled(): boolean {
    return  this._isDisabledFn.apply(this, [this]);
  }

  /**
   * Checks is need to show/render this
   */
  public isShow(): boolean {
    return !this._isDisabledFn.call(this, arguments);
  }

  public isEmpty(): boolean {
    const v: object = this.value();
    if ($Util.isObject(v)) {
      return Object.values(v as {[s: string]: any}).reduce((empty: boolean, value) => {
        return empty && [null, ''].includes(value);
      }, true);
    }
    return [null, ''].includes(this.value());
  }

  // ENUMS
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

  public setEnum(list): void {
    this.enumList = list;
  }

  public getEnum(): any[] {
    return this.enumList;
  }

}
