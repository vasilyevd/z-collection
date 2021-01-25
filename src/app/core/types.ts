/**
 * Simple JS object
 */
export type Data<T = {}> = {
  [P in keyof T]?: T[P];
};

export type UnArray<T> = T extends Array<infer U> ? U : T;

export type ValueOf<T> = T[keyof T];

export type Structure<T> = { [P in keyof T]?: T[P] extends object ? UnArray<Structure<T[P]>> : any};

export type RequireProps<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type IfElse<T, Extend, Then, Else> = T extends Extend ? Then : Else;

export type ReplaceType<T, N> = T extends any[] ? [N] : N;
