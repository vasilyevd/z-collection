export type IShippingRuleData = {
  id?: number;
  enabled?: boolean;
  action: ShippingRuleAction;
  service_id: number;
  hub_id: number;
  price_currency: string;
  price_value: Float;
  priority: number;
  execution: number;
  spring_country: string;
  client_id: number;
  country_code: string;
  zip: string;
  dim_max: Float;
  dim_sum_max: Float;
  dim_uom: string;
  value_max: Float;
  value_min: Float;
  value_currency: string;
  weight_max: Float;
  weight_min: Float;
  weight_uom: string;
}
