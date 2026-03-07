import PQueue from 'p-queue';
import { BaseName as BaseName$1, File as File$1, UUID as UUID$1 } from '@kubb/fs/src/types.ts';
import { DirectoryTreeOptions } from 'directory-tree';
import { ConsolaInstance } from 'consola';
import { Ora } from 'ora';
import * as _kubb_plugin_oas from '@kubb/plugin-oas';

declare function read(path: string): Promise<string>;

type Options$2 = {
    sanity?: boolean;
};
declare function write(path: string, data: string, options?: Options$2): Promise<string | undefined>;

type BasePath<T extends string = string> = `${T}/`;
type Import = {
    /**
     * Import name to be used
     * @example ["useState"]
     * @example "React"
     */
    name: string | Array<string | {
        propertyName: string;
        name?: string;
    }>;
    /**
     * Path for the import
     * @example '@kubb/core'
     */
    path: string;
    extName?: Extname;
    /**
     * Add `type` prefix to the import, this will result in: `import type { Type } from './path'`.
     */
    isTypeOnly?: boolean;
    /**
     * Add `* as` prefix to the import, this will result in: `import * as path from './path'`.
     */
    isNameSpace?: boolean;
    /**
     * When root is set it will get the path with relative getRelativePath(root, path).
     */
    root?: string;
};
type Export = {
    /**
     * Export name to be used.
     * @example ["useState"]
     * @example "React"
     */
    name?: string | Array<string>;
    /**
     * Path for the import.
     * @example '@kubb/core'
     */
    path: string;
    extName?: Extname;
    /**
     * Add `type` prefix to the export, this will result in: `export type { Type } from './path'`.
     */
    isTypeOnly?: boolean;
    /**
     * Make it possible to override the name, this will result in: `export * as aliasName from './path'`.
     */
    asAlias?: boolean;
};
type UUID = string;
type Source = string;
type Extname = '.ts' | '.js' | '.tsx' | '.json' | `.${string}`;
type Mode = 'single' | 'split';
/**
 * Name to be used to dynamicly create the baseName(based on input.path)
 * Based on UNIX basename
 * @link https://nodejs.org/api/path.html#pathbasenamepath-suffix
 */
type BaseName = `${string}${Extname}`;
/**
 * Path will be full qualified path to a specified file
 */
type Path = string;
type AdvancedPath<T extends BaseName = BaseName> = `${BasePath}${T}`;
type OptionalPath = Path | undefined | null;
type File<TMeta extends object = object, TBaseName extends BaseName = BaseName> = {
    /**
     * Unique identifier to reuse later
     * @default crypto.randomUUID()
     */
    id?: string;
    /**
     * Name to be used to create the path
     * Based on UNIX basename, `${name}.extName`
     * @link https://nodejs.org/api/path.html#pathbasenamepath-suffix
     */
    baseName: TBaseName;
    /**
     * Path will be full qualified path to a specified file
     */
    path: AdvancedPath<TBaseName> | Path;
    source: Source;
    imports?: Import[];
    exports?: Export[];
    /**
     * This will call fileManager.add instead of fileManager.addOrAppend, adding the source when the files already exists
     * This will also ignore the combinefiles utils
     * @default `false`
     */
    override?: boolean;
    /**
     * Use extra meta, this is getting used to generate the barrel/index files.
     */
    meta?: TMeta;
    /**
     * Override if a file can be exported by the BarrelManager
     * @default true
     */
    exportable?: boolean;
    /**
     * This will override `process.env[key]` inside the `source`, see `getFileSource`.
     */
    env?: NodeJS.ProcessEnv;
    /**
     * The name of the language being used. This can be TypeScript, JavaScript and still have another ext.
     */
    language?: string;
};

type PossiblePromise<T> = Promise<T> | T;
type ArrayWithLength<T extends number, U extends any[] = []> = U['length'] extends T ? U : ArrayWithLength<T, [true, ...U]>;
type GreaterThan<T extends number, U extends number> = ArrayWithLength<U> extends [...ArrayWithLength<T>, ...infer _] ? false : true;

type BarrelManagerOptions = {
    treeNode?: DirectoryTreeOptions;
    isTypeOnly?: boolean;
    /**
     * Add .ts or .js
     */
    extName?: Extname;
};

declare class EventEmitter<TEvents extends Record<string, any>> {
    #private;
    constructor();
    emit<TEventName extends keyof TEvents & string>(eventName: TEventName, ...eventArg: TEvents[TEventName]): void;
    on<TEventName extends keyof TEvents & string>(eventName: TEventName, handler: (...eventArg: TEvents[TEventName]) => void): void;
    off<TEventName extends keyof TEvents & string>(eventName: TEventName, handler: (...eventArg: TEvents[TEventName]) => void): void;
    removeAll(): void;
}

declare const LogLevel: {
    readonly silent: "silent";
    readonly info: "info";
    readonly debug: "debug";
};
type LogLevel = keyof typeof LogLevel;
type Events$1 = {
    start: [message: string];
    end: [message: string];
    error: [message: string, cause: Error];
    warning: [message: string];
    debug: [logs: string[]];
};
type Logger = {
    /**
     * Optional config name to show in CLI output
     */
    name?: string;
    logLevel: LogLevel;
    spinner?: Ora;
    consola?: ConsolaInstance;
    on: EventEmitter<Events$1>['on'];
    emit: EventEmitter<Events$1>['emit'];
};

type RequiredPluginLifecycle = Required<PluginLifecycle>;
/**
 * Get the type of the first argument in a function.
 * @example Arg0<(a: string, b: number) => void> -> string
 */
type Argument0<H extends keyof PluginLifecycle> = Parameters<RequiredPluginLifecycle[H]>[0];
type Strategy = 'hookFirst' | 'hookForPlugin' | 'hookParallel' | 'hookReduceArg0' | 'hookSeq';
type Executer<H extends PluginLifecycleHooks = PluginLifecycleHooks> = {
    strategy: Strategy;
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
type Options$1 = {
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
    mode?: Mode;
    extName: Extname;
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
    constructor(config: Config, options: Options$1);
    getFile<TOptions = object>({ name, mode, extName, pluginKey, options }: GetFileProps<TOptions>): File<{
        pluginKey: Plugin['key'];
    }>;
    resolvePath: <TOptions = object>(params: ResolvePathParams<TOptions>) => OptionalPath;
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

interface Cache<TStore extends object = object> {
    delete(id: keyof TStore): boolean;
    get(id: keyof TStore): TStore[keyof TStore] | null;
    has(id: keyof TStore): boolean;
    set(id: keyof TStore, value: unknown): void;
}

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
    resolvePath?: (this: PluginContext<TOptions>, baseName: string, mode?: Mode, options?: TOptions['resolvePathOptions']) => OptionalPath;
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
    load?: (this: Omit<PluginContext<TOptions>, 'addFile'>, path: Path) => PossiblePromise<TransformResult | null>;
    /**
     * Transform the source-code.
     * @type hookReduceArg0
     */
    transform?: (this: Omit<PluginContext<TOptions>, 'addFile'>, source: string, path: Path) => PossiblePromise<TransformResult>;
    /**
     * Write the result to the file-system based on the id(defined by `resolvePath` or changed by `load`).
     * @type hookParallel
     */
    writeFile?: (this: Omit<PluginContext<TOptions>, 'addFile'>, path: Path, source: string | undefined) => PossiblePromise<string | void>;
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
    mode?: Mode;
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
    addFile: (...file: Array<File>) => Promise<Array<File>>;
    resolvePath: (params: ResolvePathParams<TOptions['resolvePathOptions']>) => OptionalPath;
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

type ResolvedFile<TMeta extends FileMetaBase = FileMetaBase, TBaseName extends BaseName$1 = BaseName$1> = File$1<TMeta, TBaseName> & {
    /**
     * @default crypto.randomUUID()
     */
    id: UUID$1;
    /**
     * Contains the first part of the baseName, generated based on baseName
     * @link  https://nodejs.org/api/path.html#pathformatpathobject
     */
    name: string;
};
type FileMetaBase = {
    pluginKey?: Plugin['key'];
};
type FileWithMeta<TMeta extends FileMetaBase = FileMetaBase> = File<TMeta>;
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
        extName?: Extname;
        exportType?: 'barrel' | 'barrelNamed' | false;
    };
    logger: Logger;
    options?: BarrelManagerOptions;
    meta?: FileWithMeta['meta'];
};
type Options = {
    queue?: PQueue;
    task?: (file: ResolvedFile) => Promise<ResolvedFile>;
};
declare class FileManager {
    #private;
    constructor({ task, queue }?: Options);
    get files(): Array<FileWithMeta>;
    get isExecuting(): boolean;
    add<T extends Array<FileWithMeta> = Array<FileWithMeta>>(...files: T): AddResult<T>;
    addIndexes({ root, output, meta, logger, options }: AddIndexesProps): Promise<void>;
    getCacheByUUID(UUID: UUID): FileWithMeta | undefined;
    get(path: Path): Array<FileWithMeta> | undefined;
    remove(path: Path): void;
    write(...params: Parameters<typeof write>): Promise<string | undefined>;
    read(...params: Parameters<typeof read>): Promise<string>;
    static getSource<TMeta extends FileMetaBase = FileMetaBase>(file: FileWithMeta<TMeta>): Promise<string>;
    static combineFiles<TMeta extends FileMetaBase = FileMetaBase>(files: Array<FileWithMeta<TMeta> | null>): Array<FileWithMeta<TMeta>>;
    static getMode(path: string | undefined | null): Mode;
    static get extensions(): Array<Extname>;
    static isJavascript(baseName: string): boolean;
}

/**
 * @deprecated Use `import { pluginOas } from '@kubb/plugin-oas'` instead
 */
declare const definePluginDefault: (options?: _kubb_plugin_oas.Options | undefined) => UserPluginWithLifeCycle<_kubb_plugin_oas.PluginOas>;
/**
 * @deprecated Use `import { pluginOas } from '@kubb/plugin-oas'` instead
 */
declare const definePlugin: (options?: _kubb_plugin_oas.Options | undefined) => UserPluginWithLifeCycle<_kubb_plugin_oas.PluginOas>;

export { definePluginDefault as default, definePlugin };
