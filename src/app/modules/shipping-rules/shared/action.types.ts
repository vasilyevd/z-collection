import {ValueOf} from '../../../core/types';

export const SHIPPING_RULE_ACTION = {
  ALLOW: 'allow',
  DENY: 'deny'
} as const;

export type ShippingRuleAction = ValueOf<typeof SHIPPING_RULE_ACTION>;
