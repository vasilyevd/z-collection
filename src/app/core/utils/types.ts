export const JS_TYPE = {
  UNDEFINED: 'undefined',
  NULL: 'null',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
  STRING: 'string',
  OBJECT: 'object',
  ARRAY: 'array',
  FUNCTION: 'function',
  DATE: 'date',
  SYMBOL: 'symbol',
  REGEXP: 'regexp',
  ERROR: 'error',
  BIGINT: 'bigint',
  MAP: 'map',
  SET: 'set',
} as const;

export type Float = string;
