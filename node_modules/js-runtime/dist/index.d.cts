import * as bun from 'bun';

declare const runtimes: {
    readonly bun: typeof bun;
    readonly deno: any;
    readonly node: undefined;
    readonly jest: any;
};
type Runtime = keyof typeof runtimes;
/**
 * Return the current runtime.
 */
declare function get(): Runtime;
declare function isBun(): boolean;
declare function isDeno(): boolean;
declare function isNode(): boolean;
declare function isJest(): boolean;
/**
 * Retrieve the version used in the current runtime.
 */
declare function getVersion(): string;
/**
 * Switch based on the current runtime.
 */
declare function switcher<TOutput>(obj: Partial<Record<Runtime, TOutput>>): TOutput | undefined;
declare function switcher<TOutput, TFallback extends string = Runtime>(obj: Partial<Record<Runtime, TOutput>> & Record<TFallback, TOutput>, fallback: TFallback): TOutput;
/**
 * Dynamic import based on switch data, see runtimeSwitch.
 */
declare function importer<TOutput>(imports: Partial<Record<Runtime, string>>): Promise<TOutput | undefined>;
declare function importer<TOutput, TFallback extends string = Runtime>(imports: Partial<Record<Runtime, string>> & Record<TFallback, string>, fallback: TFallback): Promise<TOutput>;

type runtime_Runtime = Runtime;
declare const runtime_get: typeof get;
declare const runtime_getVersion: typeof getVersion;
declare const runtime_importer: typeof importer;
declare const runtime_isBun: typeof isBun;
declare const runtime_isDeno: typeof isDeno;
declare const runtime_isJest: typeof isJest;
declare const runtime_isNode: typeof isNode;
declare const runtime_runtimes: typeof runtimes;
declare const runtime_switcher: typeof switcher;
declare namespace runtime {
  export { type runtime_Runtime as Runtime, runtime_get as get, runtime_getVersion as getVersion, runtime_importer as importer, runtime_isBun as isBun, runtime_isDeno as isDeno, runtime_isJest as isJest, runtime_isNode as isNode, runtime_runtimes as runtimes, runtime_switcher as switcher };
}

export { type Runtime, runtime as default, get, getVersion, importer, isBun, isDeno, isJest, isNode, runtime, runtimes, switcher };
