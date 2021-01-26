import {
  ActiveAttributesSchema,
  ActiveData,
  IActiveModel,
  IActiveModelConfig,
} from './interface';
import {Data} from '../core/types';
import {$Util} from '../core/utils/common';
import {AttributesSchema, IMapSchema} from './attributes.interface';

/**
 * ABSTRACT COMMON
 * Implements all ActiveModel base methods
 * Provide ActiveModel features
 */
export abstract class AbstractActiveModel<T= any> implements IActiveModel<T>{
  /**
   * Store model attributes data represented as it defined in ActiveModel schema
   *
   * can be primitives, arrays, objects. Models?
   */
  public data: ActiveData<T>;

  /**
   * Store model schema pushed as custom from constructor configuration.
   * Use for create dynamic ActiveModels with custom schema in runtime
   */
  private schema: ActiveAttributesSchema<T>;

  /**
   * Store labels for model data attributes.
   * Used
   * @private
   */
  private labels: IMapSchema;

  /**
   * Default values for model data attributes
   * @private
   */
  private default: ActiveData<T>;

  /**
   * Validation rules for model data attributes
   * @private
   */
  private rules: any;

  /**
   * Store initial data state (after create, load, save)
   * Used for reset model to this state.
   * @private
   */
  private predefined: ActiveData<T>;

  /**
   * Need to be defined in child non-abstract class
   * used as method - for access to child data from abstract constructor
   */
  abstract get $schema(): ActiveAttributesSchema<T>;

  /**
   * One point for get actual model attributes schema
   */
  private get $$schema(): ActiveAttributesSchema<T> {
    return this.schema || this.$schema || {};
  }

  constructor(config?: IActiveModelConfig<T>) {
    this.setup(config);
    this.initAttributes();
  }

  private setup({data, schema, labels= {}}: IActiveModelConfig<T>) {
    // console.log('AbstractActiveModel:setup', 'data', data);
    Object.assign(this, {
      predefined: { ...data },
      schema,
      labels
    });
    // create data from initial data
    // there we can:
    // - just copy plain data and use it (v1:actual)
    // - create models for some attributes (by schema) and put them to data (v2)
    // - create attributeModels for every attributes for consistent work with attributes (v3)
    this.data = (data || {}) as ActiveData<T>;
  }

  initAttributes(): void {
    Object
      .keys(this.$$schema)
      .forEach(name => {
        this.setAttributeBySchema(name);
      });
    // console.log('ActiveModel:initAttributes END');
  }

  private setAttributeBySchema(attribute: string): void {
    const schema = this.$$schema;
    if (schema.hasOwnProperty(attribute)) {
      const attrType = schema[attribute];

      //     const cast = (n: string, v: any, type?: string | any): any => {
      //       /**@override IBaseModel this */
      //       const t = type ? type : this.schema()[n].$t;
      //       if (typeof t === 'function') { // we think that it is another model
      //         return (new t()).setAttributes(v);
      //       }
      //       switch (t) {
      //         case 'string':
      //           return String(v);
      //         case 'number':
      //           return Number(v);
      //         case 'bool':
      //         case 'boolean':
      //           if (v === '0') {
      //             v = false;
      //           }
      //           if (v === '1') {
      //             v = true;
      //           }
      //           return Boolean(v);
      //       }
      //     };
      //
      if ($Util.isArray(attrType)) {
        this.data[attribute] = [];
        if (schema[attribute].length !== 1) {
          throw new Error(`Allowed only one type for array definitions for attribute "${attribute}"`);
        }
        // if (!$Util.isArray(value)) {
        //   throw new Error(`Value must be array according to scheme definition for attribute "${name}"`);
        // }
        //       value.forEach((val) => {
        //         this.attributes[name].push(cast(name, val, this.schema()[name].$t[0]));
        //       });
        //
      } else {
        if (!this.data.hasOwnProperty(attribute)) {
          this.data[attribute] = undefined;
        }
      }
      //
    }
    return;
  }

  /**
   * return data
   * With converted atributes contained another ActiveModel to JSON object
   * In other words: ActiveData<T> => Data<T>
   */
  json(): Data<T> {
    return JSON.parse(JSON.stringify(this.data));
  }
}
