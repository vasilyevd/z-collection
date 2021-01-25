import {ActiveAttributesSchema, IActiveModel, IActiveModelConfig} from './interface';
import {AbstractActiveModel} from './base.active.model';
import {Data, RequireProps} from '../core/types';

/**
 * ABSTRACT EXTENDABLE
 * - require declaration $schema method in inherited classes
 */
export abstract class ActiveModel<T> extends AbstractActiveModel<T> implements IActiveModel<T>{
  constructor(data?: Data<T>) {
    console.log('ActiveModel:constructor', data);
    super({data});
  }
}


/**
 * CONSTRUCTABLE
 * - schema is required in constructor for correct work
 */
export class ActiveModelConstructor<T> extends AbstractActiveModel<T> {
  $schema: ActiveAttributesSchema<any>;

  constructor(config: RequireProps<IActiveModelConfig<T>, 'schema'>) {
    super(config);
  }
}
