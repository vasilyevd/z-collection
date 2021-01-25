import {ReplaceType, UnArray} from '../core/types';
import {IActiveModel, onSimple} from './interface';

export interface IMapSchema {
  [key: string]: any;
}

export interface IAttributesSchema {
  [attrName: string]: any;
}

export type AttributesSchema<T extends IAttributesSchema = IAttributesSchema> = {
  [P in keyof T]?: onSimple<T[P], ReplaceType<T[P], AttributesSchema<UnArray<T[P]>> | (new() => IActiveModel)>>;
};
