import {PaginationModel} from '../pagination/model';
import {CollectionPaginationConfig} from './interface';

export class CollectionPagination extends PaginationModel {
  constructor(config: CollectionPaginationConfig) {
    const {settings: state, ...subset} = config;
    super(state);
    Object.assign(this, subset);
  }
}
