import {Data, IfElse, ReplaceType, UnArray} from '../core/types';
import {IAttributesSchema, IMapSchema} from './attributes.interface';


export interface IActiveModel<T= {}> {
  $schema: ActiveAttributesSchema<T>;
  data?: ActiveData<T>;
  json(): Data<T>;
}

export interface IAbstractActiveModel<T> extends IActiveModel<T>{}

export interface IActiveModelConfig<T> {
  data?: Data<T>;
  schema?: ActiveAttributesSchema<T>;
  labels?: IMapSchema;
  defaults?: IMapSchema;
}


/**
 * Active Data can be simple object or instance of AbstractActiveModel
 */
export type ActiveData<T = {}> = {
  [P in keyof T]: UnArray<T[P]> extends {[key: string]: any} ? (T[P] | IAbstractActiveModel<T[P]>): T[P];
};

export type SimpleSchemaItem = string | number | boolean;
export type onSimple<T, Else> = IfElse<UnArray<T>, SimpleSchemaItem, ReplaceType<T, string>, Else>;
export type onObject<T, Else> = IfElse<T, {[key: string]: any}, T, Else>;
export type onSimpleArray<T, Else> = T extends SimpleSchemaItem[] ? [string] : Else;

/**
 * Like
 * ```
 * {
 *   iamString: 'string',
 *   iamNumber: 'number',
 *   iamArrayOfNumbers: ['number'],
 *   iamArrayOfStrings: ['string'],
 *   iamActiveModel: SomeActiveModelClass,
 *   iamArrayOfActiveModels: [SomeActiveModelClass],
 *   iamNested: {name: 'string', items: ['string']},
 * }
 * ```
 * тут требуется чтобы значение было не просто строкой а строкой из вариантов типов JS_TYPE
 * т.е. 'undefined' | 'null' | 'boolean' | 'number' | 'string' | 'object' | 'array' | 'function'
 * | 'date' | 'symbol' | 'regexp' | 'error' | 'bigint' | 'map' | 'set'
 */


/**
 * Like
 * ```
 * {
 *   iamString: 'string',
 *   iamNumber: 'number',
 *   iamArrayOfNumbers: ['number'],
 *   iamArrayOfStrings: ['string'],
 *   iamActiveModel: SomeActiveModelClass,
 *   iamArrayOfActiveModels: [SomeActiveModelClass],
 *   iamNested: {name: 'string', items: ['string']},
 * }
 * ```
 * тут требуется чтобы значение было не просто строкой а строкой из вариантов типов JS_TYPE
 * т.е. 'undefined' | 'null' | 'boolean' | 'number' | 'string' | 'object' | 'array' | 'function'
 * | 'date' | 'symbol' | 'regexp' | 'error' | 'bigint' | 'map' | 'set'
 */
export type ActiveAttributesSchema<T extends IAttributesSchema = IAttributesSchema> = {
  // [P in keyof T]?: onSimple<T[P], ReplaceType<T[P], AttributesSchema<UnArray<T[P]>> | (new() => AbstractActiveModel)>>;
  // [P in keyof T]?: onSimple<T[P], ReplaceType<T[P], AttributesSchema<UnArray<T[P]>> | (new() => IActiveModel)>>;
  [P in keyof T]?: onSimple<T[P], ReplaceType<T[P], ActiveAttributesSchema<UnArray<T[P]>> | (new() => IAbstractActiveModel<UnArray<T[P]>>)>>;
};



