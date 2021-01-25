import {Data} from '../core/types';
import {ActiveModelConstructor} from './active.model';
import {IActiveModel} from './interface';

export abstract class BaseModelService<T extends Data> {
  protected parentMake(...args: ConstructorParameters<typeof ActiveModelConstructor>): IActiveModel<T> {
    return new ActiveModelConstructor<T>(args[0]);
  }

  abstract make(data?: Data);
}
