import {ActiveModel} from '../../../model/active.model';
import {IShippingRuleData} from './interface';
import {shippingRuleDataSchema} from './schema';

export class ShippingRuleActiveModel extends ActiveModel<IShippingRuleData> {
  get $schema() {
    return shippingRuleDataSchema;
  }
}
