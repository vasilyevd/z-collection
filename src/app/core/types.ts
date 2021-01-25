export type Data<T = {}> = {
  [P in keyof T]?: T[P];
};

export type UnArray<T> = T extends Array<infer U> ? U : T;

export type Structure<T> = { [P in keyof T]?: T[P] extends object ? UnArray<Structure<T[P]>> : any};
