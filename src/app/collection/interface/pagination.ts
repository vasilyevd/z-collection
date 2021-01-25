import {IPaginationModel, PaginationState} from '../../pagination/interface';

export interface ICollectionPagination extends IPaginationModel {}

export type CollectionPaginationConfig = Partial<PaginationState> & {
  settings?;
};
