import * as _kubb_core from '@kubb/core';
import { FileMetaBase, ResolveNameParams, PluginFactoryOptions, Generator, PluginManager, Plugin } from '@kubb/core';
import { O as Options, P as PluginOas, a as OperationSchema, R as Refs, b as Override } from './types-RVAPVtNi.cjs';
export { A as API, E as Exclude, I as Include, f as OperationSchemas, g as OperationsByMethod, d as Ref, c as ResolvePathOptions, e as Resolver } from './types-RVAPVtNi.cjs';
export { G as GetOperationGeneratorOptions, a as OperationGenerator, O as OperationMethodResult } from './OperationGenerator-8tADySO6.cjs';
import * as KubbFile from '@kubb/fs/types';
import { SchemaObject, Oas, contentType } from '@kubb/oas';
import { S as Schema, a as SchemaKeywordMapper } from './SchemaMapper-BpjlzuXc.cjs';
export { b as SchemaKeyword, c as SchemaKeywordBase, d as SchemaMapper, i as isKeyword, s as schemaKeywords } from './SchemaMapper-BpjlzuXc.cjs';

declare const pluginOasName = "plugin-oas";
declare const pluginOas: (options?: Options | undefined) => _kubb_core.UserPluginWithLifeCycle<PluginOas>;

type GetSchemaGeneratorOptions<T extends SchemaGenerator<any, any, any>> = T extends SchemaGenerator<infer Options, any, any> ? Options : never;
type SchemaMethodResult<TFileMeta extends FileMetaBase> = Promise<KubbFile.File<TFileMeta> | Array<KubbFile.File<TFileMeta>> | null>;
type Context<TOptions, TPluginOptions extends PluginFactoryOptions> = {
    oas: Oas;
    pluginManager: PluginManager;
    /**
     * Current plugin
     */
    plugin: Plugin<TPluginOptions>;
    mode: KubbFile.Mode;
    include?: Array<'schemas' | 'responses' | 'requestBodies'>;
    override: Array<Override<TOptions>> | undefined;
    contentType?: contentType;
    output?: string;
};
type SchemaGeneratorOptions = {
    dateType: false | 'string' | 'stringOffset' | 'stringLocal' | 'date';
    unknownType: 'any' | 'unknown';
    enumType?: 'enum' | 'asConst' | 'asPascalConst' | 'constEnum' | 'literal';
    enumSuffix?: string;
    usedEnumNames?: Record<string, number>;
    mapper?: Record<string, string>;
    typed?: boolean;
    transformers: {
        /**
         * Customize the names based on the type that is provided by the plugin.
         */
        name?: (name: ResolveNameParams['name'], type?: ResolveNameParams['type']) => string;
        /**
         * Receive schema and name(propertName) and return FakerMeta array
         * TODO TODO add docs
         * @beta
         */
        schema?: (schemaProps: SchemaProps, defaultSchemas: Schema[]) => Schema[] | undefined;
    };
};
type SchemaGeneratorBuildOptions = Omit<OperationSchema, 'name' | 'schema'>;
type SchemaProps = {
    schema?: SchemaObject;
    name?: string;
    parentName?: string;
};
declare abstract class SchemaGenerator<TOptions extends SchemaGeneratorOptions = SchemaGeneratorOptions, TPluginOptions extends PluginFactoryOptions = PluginFactoryOptions, TFileMeta extends FileMetaBase = FileMetaBase> extends Generator<TOptions, Context<TOptions, TPluginOptions>> {
    #private;
    refs: Refs;
    /**
     * Creates a type node from a given schema.
     * Delegates to getBaseTypeFromSchema internally and
     * optionally adds a union with null.
     */
    parse(props: SchemaProps): Schema[];
    deepSearch<T extends keyof SchemaKeywordMapper>(tree: Schema[] | undefined, keyword: T): SchemaKeywordMapper[T][];
    find<T extends keyof SchemaKeywordMapper>(tree: Schema[] | undefined, keyword: T): SchemaKeywordMapper[T] | undefined;
    static deepSearch<T extends keyof SchemaKeywordMapper>(tree: Schema[] | undefined, keyword: T): SchemaKeywordMapper[T][];
    static findInObject<T extends keyof SchemaKeywordMapper>(tree: Schema[] | undefined, keyword: T): SchemaKeywordMapper[T] | undefined;
    static find<T extends keyof SchemaKeywordMapper>(tree: Schema[] | undefined, keyword: T): SchemaKeywordMapper[T] | undefined;
    build(): Promise<Array<KubbFile.File<TFileMeta>>>;
    /**
     * Schema
     */
    abstract schema(name: string, object: SchemaObject, options: TOptions): SchemaMethodResult<TFileMeta>;
}

/**
 * @deprecated Use `import { pluginOas } from '@kubb/plugin-oas'` instead
 */
declare const definePluginDefault: (options?: Options | undefined) => _kubb_core.UserPluginWithLifeCycle<PluginOas>;

export { type GetSchemaGeneratorOptions, OperationSchema, Options, Override, PluginOas, Refs, Schema, SchemaGenerator, type SchemaGeneratorBuildOptions, type SchemaGeneratorOptions, SchemaKeywordMapper, type SchemaMethodResult, definePluginDefault as default, pluginOas, pluginOasName };
