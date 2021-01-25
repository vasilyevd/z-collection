import {GridActiveCollection} from '../../../collection';
import {ShippingRuleActiveModel} from '../model/model';
import {ShippingRulesUrlProvider} from '../shared/url.provider';

export class ShippingRulesCollection extends GridActiveCollection {

  items: ShippingRuleActiveModel[];

  urlProvider = ShippingRulesUrlProvider;

  /**
   * @todo: rename to type FilterDeclaration
   */
  // filterAttributes: FilterDefinition<IShippingRuleData> = {
  //   id: FILTER_TYPE_CONST.LIKE_STRING,
  //   client_id: FILTER_TYPE_CONST.EQ_INT,
  //   spring_country: FILTER_TYPE_CONST.EQ_STRING,
  //   country_code: FILTER_TYPE_CONST.EQ_STRING,
  //   service_id: FILTER_TYPE_CONST.EQ_INT,
  //   hub_id: FILTER_TYPE_CONST.EQ_INT,
  //   action: {
  //     type: FILTER_TYPE_CONST.IN_ENUM,
  //     enum: [
  //     ]
  //   },
  // };

  constructor(data?, config?) {
    super(data, {...{
        itemConstructor: ShippingRuleActiveModel,
      }, ...config});
  }
}
