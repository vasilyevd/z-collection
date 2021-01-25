export declare const $Util: {
  isObject: (object: any) => boolean;
  isArray: (arr: any) => boolean;
  isFunction: (func: any) => boolean;
  isString: (str: any) => boolean;
  isNumber: (num: any) => boolean;
  isUndefined: (bool: any) => boolean;
  isNull: (bool: any) => boolean;
  isBoolean: (bool: any) => boolean;
  isClass: (obj: any) => any;
  mergeWithChild: (root: any, childField: string, dataField: string) => {};
  jsType: (value: any) => string;
  isType: (value: any, type: any) => boolean;
  hasMethod: (obj: any, methodName: any) => boolean;
};
