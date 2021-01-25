const isObject = (object) => Object.prototype.toString.call(object) === '[object Object]';

const isArray = (arr) => Object.prototype.toString.call(arr) === '[object Array]';

const isFunction = (func) => Object.prototype.toString.call(func) === '[object Function]';

const isString = (str) => Object.prototype.toString.call(str) === '[object String]';

const isNumber = (num) => Object.prototype.toString.call(num) === '[object Number]';

const isUndefined = (v) => Object.prototype.toString.call(v) === '[object Undefined]' || typeof v === 'undefined';

const isNull = (bool) => Object.prototype.toString.call(bool) === '[object Null]';

const isBoolean = (bool) => Object.prototype.toString.call(bool) === '[object Boolean]';

const isClass = (obj) => {
  const isCtorClass = obj.constructor?.toString().substring(0, 5) === 'class';
  if (obj.prototype === undefined) {
    return isCtorClass;
  }
  const isPrototypeCtorClass = obj.prototype.constructor
    && obj.prototype.constructor.toString
    && obj.prototype.constructor.toString().substring(0, 5) === 'class';
  return isCtorClass || isPrototypeCtorClass;
};

const jsType = (value) => {
  const objType = Object.prototype.toString.call(value);
  const objClass = objType.match(/^\[object (.*)\]$/m)[1];
  return objClass ? objClass.toLowerCase() : objClass;
};

const isType = (value, type) => {
  return jsType(value) === type;
};

const hasMethod = (obj, methodName) => {
  return isObject(obj) && (methodName in obj) && isFunction(obj[methodName]);
};


const mergeWithChild = (root, childField: string, dataField: string) => {
  function extract<T>(from, to: T): T {
    if (from[dataField]) {
      to = Object.assign(to, from[dataField]);
    }
    if (from[childField]) {
      extract(from[childField], to);
    }
    return to;
  }
  return extract(root, {});
};

export const $Util = {isObject, isArray, isFunction, isString, isNumber, isUndefined, isNull, isBoolean, isClass,
  mergeWithChild,
  jsType, isType, hasMethod
};

export function inEnum<T>(value: string, enumObject: { [key: string]: T }): boolean {
  return Object.values(enumObject).includes((value as unknown) as T);
}

