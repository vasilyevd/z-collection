/* tslint:disable:member-ordering */
import {IAttributeFilter, IFilterFormConfig} from '../interface';
import {BaseFilter} from '../base.filter';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Inject, Injectable, Injector, OnDestroy, Optional} from '@angular/core';
import {FilterControl} from './control';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {merge, pick} from 'lodash';
import {$Util} from '../../core/utils/common';

/**
 * Base class for create any Filter forms
 * - store current form state
 * - linked with Filter (update or get information on some events)
 */
@Injectable()
export abstract class BaseFilterForm implements Iterable<FilterControl>, OnDestroy {

  protected mergeConfigs(parent, current, list?: string[]): IFilterFormConfig {
    const parentPick = (list) ? pick(parent, Object.keys(current).concat(list)) : parent;
    return merge(parentPick, current);
  }

  // CONFIG
  protected _config: IFilterFormConfig;

  protected abstract $config(): IFilterFormConfig;

  protected options = {
    liveChanges: true,
    hideEmpty: false,
  };

  // - self current state
  protected form: FormGroup;

  private formSubject: BehaviorSubject<FormGroup>;

  public formChange: Observable<FormGroup>;

  /**
   * self value (initiated on create)
   * state for possible Reset/Cancel
   */
  private _initState;
  initState(): any {
    return this._initState;
  }

  private unsubscribe$ = new Subject();


  // Controls
  protected filterControls: Map<string, FilterControl> = new Map();
  public visibleControls: Map<string, boolean> = new Map();

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

    // need before init other values by logic?
    // Ex: some attribute has value A and other attribute by logic need have value A1
    // if Yes - we store it (A1) and on apply sent its values...

    this._initState = this.form.value;


    // просто создаем форму? наверное этого недостаточно - так как элементы формы ограничены небольшим набором дейтвий и свойств
    // таких как: set, patch, pristine, dirty и по большей части относятся к UI а не к логике

    // filter form must be store
    // - self value (initiated on create)
    // - self current state (cuurent is form.value used for display in UI)

    // - inform filter about changes in value
    // - listen filter about any changes in it value
    // - has information about used attributes from filter in this form (for work only with its)


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
    // a) бежим по списку в фильтре, и создаем все по его структуре. если что-то есть в конфиге но нет в фильтре - игнорим это.
      Object.keys(this.filter.getFilters()).forEach((name) => {
        const attributeFilter = this.filter.getFilter(name);
        if (attributeFilter.isEnabled() && this._config.hasOwnProperty(name)) {
          const formControl = this.initFormControl(attributeFilter);
          this.initFilterControl(name, formControl);
        }
      });
    // b) бежим по конфигу формыконфигу, если нет то создаем по опции ui
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


  private filterControlsSubs: Map<string, Subscription> = new Map();

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
        distinctUntilChanged((prev, curr) => {
          console.log('prev:', prev);
          console.log('c:', curr);
          return prev === curr;
        })
      )
      .subscribe(item => {
      console.log('(FilterControl -> FilterForm)', filterControl.name(), item);
      // console.log('(FilterControl -> FilterForm)', this.constructor.name, filterControl.name(), item);

      // console.log('FilterForm: so we have:');
      // console.log('FilterForm:  - value', item.value());

      // console.log('FilterForm: Do some inside FilterForm. Update other controls, etc. by Configuration and FilterForm logic');
      // console.log('FilterForm: If form configured as Realtime - inform Filter About It');
      // console.log('FilterForm: Inform with Data: single FilterControl or all Form?');

      // console.log('FilterForm: at this stage we can not send form to filter - because form not changed at now (only single control)');
      // console.log('FilterForm: ', this.getValue());

      // console.log('FilterForm: if filterControl submit on change (select; input ');

      // if ($Util.isFunction(filterControl.config.isDisabled)) {
      //   this.disFn = filterControl.config.isDisabled.bind(this);
      //   this.disFn();
      // }

      // console.log('filterControl.config', filterControl.config);
      if (filterControl.getConfig('submit') === true) {
        console.log('control changed and it config autoSubmit - so waitSubmit = true');
        this.waitSubmit = true;
        // this.emitSubmit({[filterControl.getConfig('name')]: filterControl.value()});
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
        console.log('(Form -> FilterForm)', this);

        // console.log('FilterForm: ', 'can inform Filter about new FilterForm value');
        console.log(this.constructor.name, 'liveChanges', this.options.liveChanges);
        console.log(this.constructor.name, 'waitSubmit', this.waitSubmit);
        console.log(this.constructor.name, 'patchedByFilter', this.patchedByFilter);
        // not submit form if changed by filter events
        // and only then it configured for liveChanges or some FilterControl set submit flag manual
        if (!this.patchedByFilter && (this.options.liveChanges || this.waitSubmit)) {
          this.submit();
        }
        this.patchedByFilter = false;
        this.waitSubmit = false;
        console.log('reset waitSubmit everyTime on formChange - because if needed we already run submit procedure', this.waitSubmit);
        console.log('reset patchedByFilter', this.patchedByFilter);
      });
  }

  private listenFilter(): void {
    this.filter.change.subscribe(([formPartValue, emitter]) => {
      console.log('(Filter -> FilterForm) got some changes from filter: update current form');
      // no need submit form changes if it changed by filter
      this.patchedByFilter = (emitter !== this);

      // update form controls values
      console.log('PATCH form in', this.constructor.name, 'by', formPartValue);
      this.form.patchValue(formPartValue, {emitEvent: emitter !== this});

      // update FilterControls visibility (for all)
      // if (!this.options.hideEmpty || filterControl.value()) {
      //   this.visibleControls.set(name, true);
      // }
      console.log('updateVisibility after PATCH');
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
        // console.log(name, 'empty', empty);
        const pinned = filterControl.pinned;
        // console.log(name, 'pinned', pinned);
        const visible = pinned || !empty;
        // console.log(name, 'visible', visible);
        this.visibleControls.set(name, visible);
      });
    }
  }

  private waitSubmit: boolean;
  private patchedByFilter: boolean;

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
    this._initState = this.form.value;
    this.waitSubmit = false;
    console.log('reset waitSubmit', this.waitSubmit);
    this.form.markAsPristine();
    this.filter.update(this.form.value, this);
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
    console.log('ngOnDestroy: cleaning up...');
    this.unsubscribeAll();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected unsubscribeAll(): void {
    this.unsubscribe$.next();
  }

}


