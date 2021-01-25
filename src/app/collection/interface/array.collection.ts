/**
 * ActiveCollection with data provided from Array
 */
import {IActiveCollection} from './active.collection';
import {ICollectionArrayDataProvider} from '../providers';

export interface IArrayActiveCollection extends IActiveCollection {
  // dataProvider: CollectionArrayDataProvider;
  dataProvider: ICollectionArrayDataProvider;
}
