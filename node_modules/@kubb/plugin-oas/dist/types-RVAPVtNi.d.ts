import { Plugin, ResolveNameParams, PluginFactoryOptions } from '@kubb/core';
import * as KubbFile from '@kubb/fs/types';
import { Oas, contentType, OasTypes, SchemaObject, Operation, HttpMethod } from '@kubb/oas';

type Mode = 'schemas' | 'responses' | 'requestBodies';
type GetSchemasProps = {
    oas: Oas;
    contentType?: contentType;
    includes?: Mode[];
};
declare function getSchemas({ oas, contentType, includes }: GetSchemasProps): Record<string, OasTypes.SchemaObject>;

type ResolvePathOptions = {
    pluginKey?: Plugin['key'];
    tag?: string;
    type?: ResolveNameParams['type'];
};
type API = {
    getOas: () => Promise<Oas>;
    getSchemas: (options?: Pick<GetSchemasProps, 'includes'>) => Promise<Record<string, SchemaObject>>;
    getBaseURL: () => Promise<string | undefined>;
    contentType?: contentType;
};
type Options = {
    /**
     * Validate your input(see kubb.config) based on '@readme/openapi-parser'.
     * @default true
     */
    validate?: boolean;
    output?: {
        /**
         * Relative path to save the JSON models.
         * False will not generate the schema JSON's.
         * @default 'schemas'
         */
        path: string;
    } | false;
    /**
     * Which server to use from the array of `servers.url[serverIndex]`
     * @example
     * - `0` will return `http://petstore.swagger.io/api`
     * - `1` will return `http://localhost:3000`
     * @default 0
     */
    serverIndex?: number;
    /**
     * Define which contentType should be used.
     * By default, this is set based on the first used contentType..
     */
    contentType?: contentType;
    oasClass?: typeof Oas;
};
/**
 * `propertyName` is the ref name + resolved with the nameResolver
 *  @example `import { Pet } from './Pet'`
 *
 * `originalName` is the original name used(in PascalCase), only used to remove duplicates
 *
 * `pluginKey` can be used to override the current plugin being used, handy when you want to import a type/schema out of another plugin
 * @example import a type(swagger-ts) for a mock file(swagger-faker)
 */
type Ref = {
    propertyName: string;
    originalName: string;
    path: KubbFile.OptionalPath;
    pluginKey?: Plugin['key'];
};
type Refs = Record<string, Ref>;
type Resolver = {
    /**
     * Original name or name resolved by `resolveName({ name: operation?.getOperationId() as string, pluginName })`
     */
    name: string;
    baseName: KubbFile.BaseName;
    path: KubbFile.Path;
};
type OperationSchema = {
    /**
     * Converted name, contains already `PathParams`, `QueryParams`, ...
     */
    name: string;
    schema: SchemaObject;
    operation?: Operation;
    /**
     * OperationName in PascalCase, only being used in OperationGenerator
     */
    operationName?: string;
    description?: string;
    statusCode?: number;
    keys?: string[];
    keysToOmit?: string[];
    withData?: boolean;
};
type OperationSchemas = {
    pathParams?: OperationSchema & {
        keysToOmit?: never;
    };
    queryParams?: OperationSchema & {
        keysToOmit?: never;
    };
    headerParams?: OperationSchema & {
        keysToOmit?: never;
    };
    request?: OperationSchema;
    response: OperationSchema;
    statusCodes?: Array<OperationSchema>;
    errors?: Array<OperationSchema>;
};
type OperationsByMethod = Record<string, Record<HttpMethod, {
    operation: Operation;
    schemas: OperationSchemas;
}>>;
type ByTag = {
    type: 'tag';
    pattern: string | RegExp;
};
type ByOperationId = {
    type: 'operationId';
    pattern: string | RegExp;
};
type ByPath = {
    type: 'path';
    pattern: string | RegExp;
};
type ByMethod = {
    type: 'method';
    pattern: HttpMethod | RegExp;
};
type BySchemaName = {
    type: 'schemaName';
    pattern: string | RegExp;
};
type Exclude = ByTag | ByOperationId | ByPath | ByMethod;
type Include = ByTag | ByOperationId | ByPath | ByMethod;
type Override<TOptions> = (ByTag | ByOperationId | ByPath | ByMethod | BySchemaName) & {
    options: Partial<TOptions>;
};
type PluginOas = PluginFactoryOptions<'plugin-oas', Options, Options, API, never>;
declare module '@kubb/core' {
    interface _Register {
        ['@kubb/plugin-oas']: PluginOas;
    }
}

export { type API as A, type Exclude as E, type GetSchemasProps as G, type Include as I, type Options as O, type PluginOas as P, type Refs as R, type OperationSchema as a, type Override as b, type ResolvePathOptions as c, type Ref as d, type Resolver as e, type OperationSchemas as f, type OperationsByMethod as g, getSchemas as h };
