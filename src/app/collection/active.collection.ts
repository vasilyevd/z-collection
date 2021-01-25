import {ModelsCollection} from './models.collection';
import {ICollectionDataProvider} from './providers';
import {CollectionStartStrategy} from './strategy';
import {$Util} from '../core/utils/utils';
import {CollectionPagination} from './pagination';
import {Subject} from 'rxjs';
import {ListingResponse} from '../api/interface/response.interface';
import {delay, finalize} from 'rxjs/operators';
import {CollectionConfiguration, IActiveCollection, ICollectionPagination} from './interface';

// @todo ActiveCollection
export abstract class ActiveCollection extends ModelsCollection implements IActiveCollection {

  dataProvider: ICollectionDataProvider;

  protected pagination: ICollectionPagination = null;

  protected strategy = CollectionStartStrategy.NONE;

  private _loading: boolean;

  constructor(data?, config?: CollectionConfiguration) {
    // ItemConstructor
    super(data, config);

    const {dataProvider, pagination, strategy} = config;

    this.strategy = strategy;

    /**
     * Pagination
     */
    this.pagination = ($Util.isObject(pagination) || $Util.isUndefined(pagination))
      ? this.paginationFabric(pagination) : null;

    /**
     * Data Provider
     * Can be as separate class or service can define self as dataProvider on create Collection
     */
    if (!(this.dataProvider) && !(dataProvider)) {
      this.dataProviderConstructor(data);
    } else if ($Util.isFunction(dataProvider)) {
      this.dataProvider = new dataProvider(this, data);
    }
  }

  protected abstract dataProviderConstructor(data): void;

  protected abstract paginationFabric(paginationConfig): CollectionPagination;

  get isLoading(): boolean {
    return this._loading;
  }

  public getStrategy() {
    return this.strategy;
  }

  load() {
    this._loading = true;
    const loadSubject = new Subject<ListingResponse>();

    // manage Pagination, Filter, Sort from result
    this.dataProvider.load().pipe(
      finalize(() => this._loading = false),
    ).subscribe(
      listResponse => {
        this.clearItems();
        listResponse.data.forEach((item) => {
          this.dataProvider.pushModel(this.itemConstruct(item));
        });
        loadSubject.next(listResponse);
        loadSubject.complete();
      },
      error => {
        console.warn('can handle error inside collection');
        loadSubject.error(error);
      }
    );
    return loadSubject.asObservable();
  }

  refresh() {
  }

  reload() {
  }

  save() {
  }

  update(data) {
  }

  protected clearItems() {
    this.items.length = 0;
  }

}

