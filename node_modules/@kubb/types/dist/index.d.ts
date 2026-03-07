type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type PossiblePromise<T> = Promise<T> | T;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;
type Push<T extends any[], V> = [...T, V];
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;
type ObjValueTuple<T, KS extends any[] = TuplifyUnion<keyof T>, R extends any[] = []> = KS extends [infer K, ...infer KT] ? ObjValueTuple<T, KT, [...R, [name: K & keyof T, options: T[K & keyof T]]]> : R;
type TupleToUnion<T> = T extends any[] ? T[number] : never;
type ArrayWithLength<T extends number, U extends any[] = []> = U['length'] extends T ? U : ArrayWithLength<T, [true, ...U]>;
type GreaterThan<T extends number, U extends number> = ArrayWithLength<U> extends [...ArrayWithLength<T>, ...infer _] ? false : true;
type SplitByDelimiter<T extends string, D extends string> = T extends `${infer P}${D}${infer Q}` ? [P, ...SplitByDelimiter<Q, D>] : [T];

export type { GreaterThan, ObjValueTuple, PossiblePromise, Prettify, SplitByDelimiter, TupleToUnion };
