/* tslint:disable:member-ordering */
import {Inject, Injectable, Injector, OnDestroy, Optional} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {merge, pick} from 'lodash';

import {IAttributeFilter, IFilterFormConfig} from '../interface';
import {BaseFilter} from '../base.filter';
import {FilterControl} from './control';

/**
 * Base class for create any Filter forms
 * - store current form state
 * - linked with Filter (update or get information on some events)
 */
@Injectable()
export abstract class BaseFilterForm implements Iterable<FilterControl>, OnDestroy {

  // CONFIG
  protected options = {
    liveChanges: false,
    hideEmpty: false,
  };

  protected _config: IFilterFormConfig;

  /**
   * self value (initiated on create)
   * state for possible Reset/Cancel
   */
  private _initState;

  protected form: FormGroup;

  protected abstract $config(): IFilterFormConfig;


  protected filterControls: Map<string, FilterControl> = new Map();

  private filterControlsSubs: Map<string, Subscription> = new Map();

  public visibleControls: Map<string, boolean> = new Map();

  private formSubject: BehaviorSubject<FormGroup>;

  public formChange: Observable<FormGroup>;

  private waitSubmit: boolean;

  private patchedByFilter: boolean;

  private unsubscribe$ = new Subject();

  initState(): any {
    return this._initState;
  }

  protected mergeConfigs(parent, current, list?: string[]): IFilterFormConfig {
    const parentPick = (list) ? pick(parent, Object.keys(current).concat(list)) : parent;
    return merge(parentPick, current);
  }


  constructor(
    injector: Injector,
    @Optional() public filter?: BaseFilter,
    @Inject(FormBuilder) public fb?: FormBuilder,
  ) {
    if (!this.filter) { this.filter = injector.get(BaseFilter, null); }
    if (!this.fb) { this.fb = injector.get(FormBuilder); }

    this.formSubject = new BehaviorSubject(this.fb.group({}));
    this.formChange = this.formSubject.asObservable();

    this._config = this.$config();
    this.useFilter(this.filter);
    this._initState = this.form.value;
  }

  /**
   * Got new Filter for use it in this form
   */
  public useFilter(filter: BaseFilter): void {
    if (filter) {
      this.filter = filter;
      this.listenFilter();
    }
    this.initForm();
    this.listenForm();
  }

  /**
   * Rebuild FilterForm by Filter
   */
  private initForm(): void {
    this.unsubscribeAll();
    this.form = this.fb.group({});
    if (this.filter) {
      this.initControls();
    }
  }

  private initControls(): void {
      Object.keys(this.filter.getFilters()).forEach((name) => {
        const attributeFilter = this.filter.getFilter(name);
        if (attributeFilter.isEnabled() && this._config.hasOwnProperty(name)) {
          const formControl = this.initFormControl(attributeFilter);
          this.initFilterControl(name, formControl);
        }
      });
  }

  /**
   * Create FormControl and add it to Form
   */
  private initFormControl(attributeFilter: IAttributeFilter): AbstractControl {
    const formControl = this.createFormControl(attributeFilter);
    this.form.registerControl(attributeFilter.name, formControl);
    return formControl;
  }

  /**
   * Create FormControl by filter attribute config
   */
  private createFormControl(attributeFilter: IAttributeFilter): AbstractControl {
    let control: AbstractControl;
    switch (attributeFilter.type) {
      case 'RANGE_DATE':
        control = this._buildRangeControl(attributeFilter.value);
        break;
      default:
        control = this.fb.control(attributeFilter.value);
    }
    return control;
  }

  private initFilterControl(name, control): void {
    const filterControl = this.createFilterControl(name);
    filterControl.useControl(control);
    if (this.filterControlsSubs.has(name)) {
      this.filterControlsSubs.get(name).unsubscribe();
    }
    this.filterControls.set(name, filterControl);
    if (!this.options.hideEmpty || !filterControl.isEmpty()) {
      this.visibleControls.set(name, true);
    }
    this.listenFilterControl(filterControl);
  }

  private createFilterControl(name): FilterControl {
    const filterControlConfig = {
      name,
      type: this.filter.getFilter(name).type,
      ...this._config[name]
    };
    return new FilterControl(filterControlConfig);
  }

  private listenFilterControl(filterControl: FilterControl): void {
    filterControl.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        distinctUntilChanged()
      )
      .subscribe(item => {
        if (filterControl.getConfig('submit') === true) {
          this.waitSubmit = true;
        }
    });
  }

  /**
   * listen any changes in form for provide it to EventsManagerService (Filter)
   */
  private listenForm(): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        )
      .subscribe(value => {
        if (!this.patchedByFilter && (this.options.liveChanges || this.waitSubmit)) {
          this.submit();
        }
        this.patchedByFilter = false;
        this.waitSubmit = false;
      });
  }

  private listenFilter(): void {
    this.filter.change
      .subscribe(([formPartValue, emitter]) => {
        // no need submit form changes if it changed by filter
        this.patchedByFilter = (emitter !== this);

        // @todo: check need we patch form, update other if filter change by self?

        // update form controls values
        this.form.patchValue(formPartValue, {emitEvent: emitter !== this});

        // update FilterControls visibility (for all)
        this.updateVisibility();

        // because we got new actulal values we store it to initValue
        this._initState = this.form.value;
    });
    // this.updateVisibility();
  }

  private updateVisibility(): void {
    if (this.options.hideEmpty) {
      this.filterControls.forEach((filterControl, name) => {
        const empty = filterControl.isEmpty();
        const pinned = filterControl.pinned;
        const visible = pinned || !empty;
        this.visibleControls.set(name, visible);
      });
    }
  }

  public emitSubmit(value?: any): void {
    // тут отправляем данные Формы фильтров
    // - значения
    // - енумы (так если контрол был сформирован из внешнего источника,
    // то можно предотвратить повторный вызов алгоритма и использовать уже существующие данные)
    value = value ?? this.form.value;
    this._initState = this.form.value;
    this.filter.update(value, this);
  }

  public submit(): void {
    this.waitSubmit = false;
    this.form.markAsPristine();
    this.emitSubmit();
  }

  reset(): void {
    if (this.form.dirty) {
      this.form.reset(this._initState);
    }
  }


  // PUBLIC
  getFilter(): BaseFilter {
    return this.filter;
  }

  getFilterControls(): FilterControl[] {
    return Array.from(this.filterControls, ([name, value]) => value);
  }

  filterControl(name): FilterControl {
    if (this.filterControls.has(name)) {
      return this.filterControls.get(name);
    }
    return {
      label(): string {
        return '';
      }
    } as FilterControl;
  }

  getForm(): FormGroup {
    return this.form;
  }

  getValue(name?: string): any {
    if (name) {
      return this.filterControl(name).value();
    }
    return this.form.value;
  }

  private _buildRangeControl(value): FormGroup {
    const c = this.fb.group({
      from: new FormControl(),
      to: new FormControl()
    });
    if (value){
      c.setValue(value, {onlySelf: true});
    }
    return c;
  }

  public *[Symbol.iterator](): Iterator<FilterControl> {
    for (const [name, value] of this.filterControls) {
      yield value;
    }
  }

  private disFn: () => boolean;

  // сама форма должна реагировать на изменения в контролах и менеджить состояние других контролов и ЮАй

  ngOnDestroy(): void {
    this.unsubscribeAll();
    this.unsubscribe$.complete();
  }

  protected unsubscribeAll(): void {
    this.unsubscribe$.next();
  }

}


