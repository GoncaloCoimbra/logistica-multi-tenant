import PQueue from 'p-queue';
import { write, read } from '@kubb/fs';
import * as KubbFile from '@kubb/fs/types';
import { BaseName, File, UUID } from '@kubb/fs/src/types.ts';
import { PossiblePromise, TupleToUnion, ObjValueTuple, GreaterThan } from '@kubb/types';
import { DirectoryTreeOptions } from 'directory-tree';
import { E as EventEmitter, L as Logger } from './logger-DChjnJMn.cjs';
import 'consola';
import 'ora';

type BarrelManagerOptions = {
    treeNode?: DirectoryTreeOptions;
    isTypeOnly?: boolean;
    /**
     * Add .ts or .js
     */
    extName?: KubbFile.Extname;
};

type RequiredPluginLifecycle = Required<PluginLifecycle>;
/**
 * Get the type of the first argument in a function.
 * @example Arg0<(a: string, b: number) => void> -> string
 */
type Argument0<H extends keyof PluginLifecycle> = Parameters<RequiredPluginLifecycle[H]>[0];
type Strategy$1 = 'hookFirst' | 'hookForPlugin' | 'hookParallel' | 'hookReduceArg0' | 'hookSeq';
type Executer<H extends PluginLifecycleHooks = PluginLifecycleHooks> = {
    strategy: Strategy$1;
    hookName: H;
    plugin: Plugin;
    parameters?: unknown[] | undefined;
    output?: unknown;
};
type ParseResult<H extends PluginLifecycleHooks> = RequiredPluginLifecycle[H];
type SafeParseResult<H extends PluginLifecycleHooks, Result = ReturnType<ParseResult<H>>> = {
    result: Result;
    plugin: Plugin;
};
type Options$2 = {
    logger: Logger;
    /**
     * Task for the FileManager
     */
    task: (file: ResolvedFile) => Promise<ResolvedFile>;
};
type Events = {
    execute: [executer: Executer];
    executed: [executer: Executer];
    error: [error: Error];
};
type GetFileProps<TOptions = object> = {
    name: string;
    mode?: KubbFile.Mode;
    extName: KubbFile.Extname;
    pluginKey: Plugin['key'];
    options?: TOptions;
};
declare class PluginManager {
    #private;
    readonly plugins: PluginWithLifeCycle[];
    readonly fileManager: FileManager;
    readonly events: EventEmitter<Events>;
    readonly config: Config;
    readonly executed: Array<Executer>;
    readonly logger: Logger;
    readonly queue: PQueue;
    constructor(config: Config, options: Options$2);
    getFile<TOptions = object>({ name, mode, extName, pluginKey, options }: GetFileProps<TOptions>): KubbFile.File<{
        pluginKey: Plugin['key'];
    }>;
    resolvePath: <TOptions = object>(params: ResolvePathParams<TOptions>) => KubbFile.OptionalPath;
    resolveName: (params: ResolveNameParams) => string;
    /**
     * Instead of calling `pluginManager.events.on` you can use `pluginManager.on`. This one also has better types.
     */
    on<TEventName extends keyof Events & string>(eventName: TEventName, handler: (...eventArg: Events[TEventName]) => void): void;
    /**
     * Run a specific hookName for plugin x.
     */
    hookForPlugin<H extends PluginLifecycleHooks>({ pluginKey, hookName, parameters, }: {
        pluginKey: Plugin['key'];
        hookName: H;
        parameters: PluginParameter<H>;
    }): Promise<Array<ReturnType<ParseResult<H>> | null>> | null;
    /**
     * Run a specific hookName for plugin x.
     */
    hookForPluginSync<H extends PluginLifecycleHooks>({ pluginKey, hookName, parameters, }: {
        pluginKey: Plugin['key'];
        hookName: H;
        parameters: PluginParameter<H>;
    }): Array<ReturnType<ParseResult<H>>> | null;
    /**
     * First non-null result stops and will return it's value.
     */
    hookFirst<H extends PluginLifecycleHooks>({ hookName, parameters, skipped, }: {
        hookName: H;
        parameters: PluginParameter<H>;
        skipped?: ReadonlySet<Plugin> | null;
    }): Promise<SafeParseResult<H>>;
    /**
     * First non-null result stops and will return it's value.
     */
    hookFirstSync<H extends PluginLifecycleHooks>({ hookName, parameters, skipped, }: {
        hookName: H;
        parameters: PluginParameter<H>;
        skipped?: ReadonlySet<Plugin> | null;
    }): SafeParseResult<H>;
    /**
     * Run all plugins in parallel(order will be based on `this.plugin` and if `pre` or `post` is set).
     */
    hookParallel<H extends PluginLifecycleHooks, TOuput = void>({ hookName, parameters, }: {
        hookName: H;
        parameters?: Parameters<RequiredPluginLifecycle[H]> | undefined;
    }): Promise<Awaited<TOuput>[]>;
    /**
     * Chain all plugins, `reduce` can be passed through to handle every returned value. The return value of the first plugin will be used as the first parameter for the plugin after that.
     */
    hookReduceArg0<H extends PluginLifecycleHooks>({ hookName, parameters, reduce, }: {
        hookName: H;
        parameters: PluginParameter<H>;
        reduce: (reduction: Argument0<H>, result: ReturnType<ParseResult<H>>, plugin: Plugin) => PossiblePromise<Argument0<H> | null>;
    }): Promise<Argument0<H>>;
    /**
     * Chains plugins
     */
    hookSeq<H extends PluginLifecycleHooks>({ hookName, parameters }: {
        hookName: H;
        parameters?: PluginParameter<H>;
    }): Promise<void>;
    getPluginsByKey(hookName: keyof PluginLifecycle, pluginKey: Plugin['key']): Plugin[];
    static getDependedPlugins<T1 extends PluginFactoryOptions, T2 extends PluginFactoryOptions = never, T3 extends PluginFactoryOptions = never, TOutput = T3 extends never ? (T2 extends never ? [T1: Plugin<T1>] : [T1: Plugin<T1>, T2: Plugin<T2>]) : [T1: Plugin<T1>, T2: Plugin<T2>, T3: Plugin<T3>]>(plugins: Array<Plugin>, dependedPluginNames: string | string[]): TOutput;
    static get hooks(): readonly ["buildStart", "resolvePath", "resolveName", "load", "transform", "writeFile", "buildEnd"];
}

type Plugins = _Register;
type OptionsPlugins = {
    [K in keyof Plugins]: Plugins[K]['options'];
};
type PluginUnion = TupleToUnion<ObjValueTuple<OptionsPlugins>>;

interface Cache<TStore extends object = object> {
    delete(id: keyof TStore): boolean;
    get(id: keyof TStore): TStore[keyof TStore] | null;
    has(id: keyof TStore): boolean;
    set(id: keyof TStore, value: unknown): void;
}

/**
 * Config used in `kubb.config.js`
 *
 * @example import { defineConfig } from '@kubb/core'
 * export default defineConfig({
 * ...
 * })
 */
type UserConfig = Omit<Config, 'root' | 'plugins'> & {
    /**
     * Project root directory. Can be an absolute path, or a path relative from
     * the location of the config file itself.
     * @default process.cwd()
     */
    root?: string;
    /**
     * Plugin type can be KubbJSONPlugin or Plugin
     * Example: ['@kubb/plugin-oas', { output: false }]
     * Or: pluginOas({ output: false })
     */
    plugins?: Array<Omit<UnknownUserPlugin, 'api'> | UnionPlugins | [name: string, options: object]>;
};
type InputPath = {
    /**
     * Path to be used as the input. This can be an absolute path or a path relative to the `root`.
     */
    path: string;
};
type InputData = {
    /**
     * `string` or `object` containing the data.
     */
    data: string | unknown;
};
type Input = InputPath | InputData;
/**
 * @private
 */
type Config<TInput = Input> = {
    /**
     * Optional config name to show in CLI output
     */
    name?: string;
    /**
     * Project root directory. Can be an absolute path, or a path relative from
     * the location of the config file itself.
     * @default process.cwd()
     */
    root: string;
    input: TInput;
    output: {
        /**
         * Path to be used to export all generated files.
         * This can be an absolute path, or a path relative based of the defined `root` option.
         */
        path: string;
        /**
         * Clean output directory before each build.
         */
        clean?: boolean;
        /**
         * Write files to the fileSystem
         * This is being used for the playground.
         * @default true
         */
        write?: boolean;
    };
    /**
     * Array of Kubb plugins to use.
     * The plugin/package can forsee some options that you need to pass through.
     * Sometimes a plugin is depended on another plugin, if that's the case you will get an error back from the plugin you installed.
     */
    plugins?: Array<Plugin>;
    /**
     * Hooks that will be called when a specific action is triggered in Kubb.
     */
    hooks?: {
        /**
         * Hook that will be triggered at the end of all executions.
         * Useful for running Prettier or ESLint to format/lint your code.
         */
        done?: string | Array<string>;
    };
};
type UnionPlugins = PluginUnion;
type ObjectPlugin = keyof OptionsPlugins;
type PluginFactoryOptions<
/**
 * Name to be used for the plugin, this will also be used for they key.
 */
TName extends string = string, 
/**
 * Options of the plugin.
 */
TOptions extends object = object, 
/**
 * Options of the plugin that can be used later on, see `options` inside your plugin config.
 */
TResolvedOptions extends object = TOptions, 
/**
 * API that you want to expose to other plugins.
 */
TAPI = any, 
/**
 * When calling `resolvePath` you can specify better types.
 */
TResolvePathOptions extends object = object> = {
    name: TName;
    /**
     * Same behaviour like what has been done with `QueryKey` in `@tanstack/react-query`
     */
    key: PluginKey<TName | string>;
    options: TOptions;
    resolvedOptions: TResolvedOptions;
    api: TAPI;
    resolvePathOptions: TResolvePathOptions;
};
type PluginKey<TName> = [name: TName, identifier?: string | number];
type GetPluginFactoryOptions<TPlugin extends UserPlugin> = TPlugin extends UserPlugin<infer X> ? X : never;
type UserPlugin<TOptions extends PluginFactoryOptions = PluginFactoryOptions> = {
    /**
     * Unique name used for the plugin
     * The name of the plugin follows the format scope:foo-bar or foo-bar, adding scope: can avoid naming conflicts with other plugins.
     * @example @kubb/typescript
     */
    name: TOptions['name'];
    /**
     * Options set for a specific plugin(see kubb.config.js), passthrough of options.
     */
    options: TOptions['resolvedOptions'];
    /**
     * Specifies the preceding plugins for the current plugin. You can pass an array of preceding plugin names, and the current plugin will be executed after these plugins.
     * Can be used to validate depended plugins.
     */
    pre?: Array<string>;
    /**
     * Specifies the succeeding plugins for the current plugin. You can pass an array of succeeding plugin names, and the current plugin will be executed before these plugins.
     */
    post?: Array<string>;
} & (TOptions['api'] extends never ? {
    api?: never;
} : {
    api: (this: TOptions['name'] extends 'core' ? null : Omit<PluginContext<TOptions>, 'addFile'>) => TOptions['api'];
});
type UserPluginWithLifeCycle<TOptions extends PluginFactoryOptions = PluginFactoryOptions> = UserPlugin<TOptions> & PluginLifecycle<TOptions>;
type UnknownUserPlugin = UserPlugin<PluginFactoryOptions<any, any, any, any, any>>;
type Plugin<TOptions extends PluginFactoryOptions = PluginFactoryOptions> = {
    /**
     * Unique name used for the plugin
     * @example @kubb/typescript
     */
    name: TOptions['name'];
    /**
     * Internal key used when a developer uses more than one of the same plugin
     * @private
     */
    key: TOptions['key'];
    /**
     * Specifies the preceding plugins for the current plugin. You can pass an array of preceding plugin names, and the current plugin will be executed after these plugins.
     * Can be used to validate depended plugins.
     */
    pre?: Array<string>;
    /**
     * Specifies the succeeding plugins for the current plugin. You can pass an array of succeeding plugin names, and the current plugin will be executed before these plugins.
     */
    post?: Array<string>;
    /**
     * Options set for a specific plugin(see kubb.config.js), passthrough of options.
     */
    options: TOptions['resolvedOptions'];
} & (TOptions['api'] extends never ? {
    api?: never;
} : {
    api: TOptions['api'];
});
type PluginWithLifeCycle<TOptions extends PluginFactoryOptions = PluginFactoryOptions> = Plugin<TOptions> & PluginLifecycle<TOptions>;
type PluginLifecycle<TOptions extends PluginFactoryOptions = PluginFactoryOptions> = {
    /**
     * Start of the lifecycle of a plugin.
     * @type hookParallel
     */
    buildStart?: (this: PluginContext<TOptions>, Config: Config) => PossiblePromise<void>;
    /**
     * Resolve to a Path based on a baseName(example: `./Pet.ts`) and directory(example: `./models`).
     * Options can als be included.
     * @type hookFirst
     * @example ('./Pet.ts', './src/gen/') => '/src/gen/Pet.ts'
     */
    resolvePath?: (this: PluginContext<TOptions>, baseName: string, mode?: KubbFile.Mode, options?: TOptions['resolvePathOptions']) => KubbFile.OptionalPath;
    /**
     * Resolve to a name based on a string.
     * Useful when converting to PascalCase or camelCase.
     * @type hookFirst
     * @example ('pet') => 'Pet'
     */
    resolveName?: (this: PluginContext<TOptions>, name: ResolveNameParams['name'], type?: ResolveNameParams['type']) => string;
    /**
     * Makes it possible to run async logic to override the path defined previously by `resolvePath`.
     * @type hookFirst
     */
    load?: (this: Omit<PluginContext<TOptions>, 'addFile'>, path: KubbFile.Path) => PossiblePromise<TransformResult | null>;
    /**
     * Transform the source-code.
     * @type hookReduceArg0
     */
    transform?: (this: Omit<PluginContext<TOptions>, 'addFile'>, source: string, path: KubbFile.Path) => PossiblePromise<TransformResult>;
    /**
     * Write the result to the file-system based on the id(defined by `resolvePath` or changed by `load`).
     * @type hookParallel
     */
    writeFile?: (this: Omit<PluginContext<TOptions>, 'addFile'>, path: KubbFile.Path, source: string | undefined) => PossiblePromise<string | void>;
    /**
     * End of the plugin lifecycle.
     * @type hookParallel
     */
    buildEnd?: (this: PluginContext<TOptions>) => PossiblePromise<void>;
};
type PluginLifecycleHooks = keyof PluginLifecycle;
type PluginParameter<H extends PluginLifecycleHooks> = Parameters<Required<PluginLifecycle>[H]>;
type PluginCache = Record<string, [number, unknown]>;
type ResolvePathParams<TOptions = object> = {
    pluginKey?: Plugin['key'];
    baseName: string;
    mode?: KubbFile.Mode;
    /**
     * Options to be passed to 'resolvePath' 3th parameter
     */
    options?: TOptions;
};
type ResolveNameParams = {
    name: string;
    pluginKey?: Plugin['key'];
    /**
     * `file` will be used to customize the name of the created file(use of camelCase)
     * `function` can be used used to customize the exported functions(use of camelCase)
     * `type` is a special type for TypeScript(use of PascalCase)
     */
    type?: 'file' | 'function' | 'type';
};
type PluginContext<TOptions extends PluginFactoryOptions = PluginFactoryOptions> = {
    config: Config;
    cache: Cache<PluginCache>;
    fileManager: FileManager;
    pluginManager: PluginManager;
    addFile: (...file: Array<KubbFile.File>) => Promise<Array<KubbFile.File>>;
    resolvePath: (params: ResolvePathParams<TOptions['resolvePathOptions']>) => KubbFile.OptionalPath;
    resolveName: (params: ResolveNameParams) => string;
    logger: Logger;
    /**
     * All plugins
     */
    plugins: Plugin[];
    /**
     * Current plugin
     */
    plugin: Plugin<TOptions>;
};
type TransformResult = string | null;

type ResolvedFile<TMeta extends FileMetaBase = FileMetaBase, TBaseName extends BaseName = BaseName> = File<TMeta, TBaseName> & {
    /**
     * @default crypto.randomUUID()
     */
    id: UUID;
    /**
     * Contains the first part of the baseName, generated based on baseName
     * @link  https://nodejs.org/api/path.html#pathformatpathobject
     */
    name: string;
};
type FileMetaBase = {
    pluginKey?: Plugin['key'];
};
type FileWithMeta<TMeta extends FileMetaBase = FileMetaBase> = KubbFile.File<TMeta>;
type AddResult<T extends Array<FileWithMeta>> = Promise<Awaited<GreaterThan<T['length'], 1> extends true ? Promise<ResolvedFile[]> : Promise<ResolvedFile>>>;
type AddIndexesProps = {
    /**
     * Root based on root and output.path specified in the config
     */
    root: string;
    /**
     * Output for plugin
     */
    output: {
        path: string;
        exportAs?: string;
        extName?: KubbFile.Extname;
        exportType?: 'barrel' | 'barrelNamed' | false;
    };
    logger: Logger;
    options?: BarrelManagerOptions;
    meta?: FileWithMeta['meta'];
};
type Options$1 = {
    queue?: PQueue;
    task?: (file: ResolvedFile) => Promise<ResolvedFile>;
};
declare class FileManager {
    #private;
    constructor({ task, queue }?: Options$1);
    get files(): Array<FileWithMeta>;
    get isExecuting(): boolean;
    add<T extends Array<FileWithMeta> = Array<FileWithMeta>>(...files: T): AddResult<T>;
    addIndexes({ root, output, meta, logger, options }: AddIndexesProps): Promise<void>;
    getCacheByUUID(UUID: KubbFile.UUID): FileWithMeta | undefined;
    get(path: KubbFile.Path): Array<FileWithMeta> | undefined;
    remove(path: KubbFile.Path): void;
    write(...params: Parameters<typeof write>): Promise<string | undefined>;
    read(...params: Parameters<typeof read>): Promise<string>;
    static getSource<TMeta extends FileMetaBase = FileMetaBase>(file: FileWithMeta<TMeta>): Promise<string>;
    static combineFiles<TMeta extends FileMetaBase = FileMetaBase>(files: Array<FileWithMeta<TMeta> | null>): Array<FileWithMeta<TMeta>>;
    static getMode(path: string | undefined | null): KubbFile.Mode;
    static get extensions(): Array<KubbFile.Extname>;
    static isJavascript(baseName: string): boolean;
}

type BuildOptions = {
    config: PluginContext['config'];
    /**
     * @default Logger without the spinner
     */
    logger?: Logger;
};
type BuildOutput = {
    files: FileManager['files'];
    pluginManager: PluginManager;
    /**
     * Only for safeBuild
     */
    error?: Error;
};
declare function build(options: BuildOptions): Promise<BuildOutput>;
declare function safeBuild(options: BuildOptions): Promise<BuildOutput>;

type Args = {
    /**
     * Path to `kubb.config.js`
     */
    config?: string;
    /**
     * Watch changes on input
     */
    watch?: boolean;
    /**
     * Log level to report when using the CLI
     *
     * `silent` will hide all information that is not relevant
     *
     * `info` will show all information possible(not related to the PluginManager)
     *
     * `debug` will show all information possible(related to the PluginManager), handy for seeing logs
     * @default `silent`
     */
    logLevel?: string;
    /**
     * Run Kubb with Bun
     */
    bun?: boolean;
};
/**
 * Type helper to make it easier to use kubb.config.js
 * accepts a direct {@link Config} object, or a function that returns it.
 * The function receives a {@link ConfigEnv} object that exposes two properties:
 */
declare function defineConfig(options: PossiblePromise<UserConfig | Array<UserConfig>> | ((
/** The options derived from the CLI flags */
args: Args) => PossiblePromise<UserConfig | Array<UserConfig>>)): typeof options;
declare function isInputPath(result: Config | undefined): result is Config<InputPath>;

/**
 * Behaves as an Error to log a warning in the console(still stops the execution)
 */
declare class Warning extends Error {
    constructor(message?: string, options?: {
        cause: Error;
    });
}

/**
 * Abstract class that contains the building blocks for plugins to create their own Generator
 * @link idea based on https://github.com/colinhacks/zod/blob/master/src/types.ts#L137
 */
declare abstract class Generator<TOptions = unknown, TContext = unknown> {
    #private;
    constructor(options?: TOptions, context?: TContext);
    get options(): TOptions;
    get context(): TContext;
    set options(options: TOptions);
    abstract build(...params: unknown[]): unknown;
}

type PackageJSON = {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
};
type DependencyName = string;
type DependencyVersion = string;
declare class PackageManager {
    #private;
    constructor(workspace?: string);
    set workspace(workspace: string);
    get workspace(): string | undefined;
    normalizeDirectory(directory: string): string;
    getLocation(path: string): string;
    import(path: string): Promise<any | undefined>;
    getPackageJSON(): Promise<PackageJSON | undefined>;
    getPackageJSONSync(): PackageJSON | undefined;
    static setVersion(dependency: DependencyName, version: DependencyVersion): void;
    getVersion(dependency: DependencyName | RegExp): Promise<DependencyVersion | undefined>;
    getVersionSync(dependency: DependencyName | RegExp): DependencyVersion | undefined;
    isValid(dependency: DependencyName | RegExp, version: DependencyVersion): Promise<boolean>;
    isValidSync(dependency: DependencyName | RegExp, version: DependencyVersion): boolean;
}

type PluginFactory<T extends PluginFactoryOptions = PluginFactoryOptions> = (options: T['options']) => UserPluginWithLifeCycle<T>;
type OptionalPluginFactory<T extends PluginFactoryOptions = PluginFactoryOptions> = (options?: T['options']) => UserPluginWithLifeCycle<T>;
declare function createPlugin<T extends PluginFactoryOptions = PluginFactoryOptions>(factory: PluginFactory<T>): OptionalPluginFactory<T>;

type PromiseFunc$1<T = unknown, T2 = never> = (state?: T) => T2 extends never ? Promise<T> : Promise<T> | T2;
type ValueOfPromiseFuncArray<TInput extends Array<unknown>> = TInput extends Array<PromiseFunc$1<infer X, infer Y>> ? X | Y : never;
type SeqOutput<TInput extends Array<PromiseFunc$1<TValue, null>>, TValue> = Array<Awaited<ValueOfPromiseFuncArray<TInput>>>;
type HookFirstOutput<TInput extends Array<PromiseFunc$1<TValue, null>>, TValue = unknown> = ValueOfPromiseFuncArray<TInput>;
type HookParallelOutput<TInput extends Array<PromiseFunc$1<TValue, null>>, TValue> = Promise<PromiseSettledResult<Awaited<ValueOfPromiseFuncArray<TInput>>>[]>;
type Strategy = 'seq' | 'first' | 'parallel';
type StrategySwitch<TStrategy extends Strategy, TInput extends Array<PromiseFunc$1<TValue, null>>, TValue> = TStrategy extends 'first' ? HookFirstOutput<TInput, TValue> : TStrategy extends 'seq' ? SeqOutput<TInput, TValue> : TStrategy extends 'parallel' ? HookParallelOutput<TInput, TValue> : never;

type PromiseFunc<T = unknown, T2 = never> = () => T2 extends never ? Promise<T> : Promise<T> | T2;
type Options<TState = any> = {
    nullCheck?: (state: TState) => boolean;
};
declare class PromiseManager<TState = any> {
    #private;
    constructor(options?: Options<TState>);
    run<TInput extends Array<PromiseFunc<TValue, null>>, TValue, TStrategy extends Strategy, TOutput = StrategySwitch<TStrategy, TInput, TValue>>(strategy: TStrategy, promises: TInput): TOutput;
}

interface _Register {
}

export { type Config, FileManager, type FileMetaBase, Generator, type GetPluginFactoryOptions, type InputData, type InputPath, type ObjectPlugin, PackageManager, type Plugin, type PluginCache, type PluginContext, type PluginFactoryOptions, type PluginKey, type PluginLifecycle, type PluginLifecycleHooks, PluginManager, type PluginParameter, type PluginWithLifeCycle, PromiseManager, type ResolveNameParams, type ResolvePathParams, type TransformResult, type UnionPlugins, type UserConfig, type UserPlugin, type UserPluginWithLifeCycle, Warning, type _Register, build, createPlugin, build as default, defineConfig, isInputPath, safeBuild };
