export const ShippingRulesUrlProvider = {
  load: (id?: number) => {
    return {
      url: (id ? `shipping_rules/${id}` : 'shipping_rules'),
      params: {
        _expand: ['hub', 'user', 'service']
      }
    };
  },
};
