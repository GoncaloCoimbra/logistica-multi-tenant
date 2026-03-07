import { Operation, Oas, SchemaObject, OpenAPIV3, OpenAPIV3_1 } from '@kubb/oas';
import { Plugin, Config } from '@kubb/core';
import { Logger } from '@kubb/core/logger';
import * as KubbFile from '@kubb/fs/types';
import { FunctionParamsAST } from '@kubb/core/utils';
import { Params } from '@kubb/react';
import { a as OperationSchema, R as Refs } from './types-RVAPVtNi.js';
export { G as GetSchemasProps, h as getSchemas } from './types-RVAPVtNi.js';

declare function getComments(operation: Operation): string[];

type Options = {
    logger: Logger;
    files: Array<KubbFile.File<FileMeta>>;
    plugin: Plugin;
    template: string;
    exportAs: string;
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
};
type FileMeta = {
    pluginKey?: Plugin['key'];
    tag?: string;
};
declare function getGroupedByTagFiles({ logger, files, plugin, template, exportAs, root, output }: Options): Promise<KubbFile.File<FileMeta>[]>;

/**
 *
 * @deprecated
 * TODO move to operationManager hook
 */
declare function getASTParams(operationSchema: OperationSchema | undefined, { typed, override, }?: {
    typed?: boolean;
    override?: (data: FunctionParamsAST) => FunctionParamsAST;
}): FunctionParamsAST[];
declare function getPathParams(operationSchema: OperationSchema | undefined, options?: {
    typed?: boolean;
    override?: (data: FunctionParamsAST) => FunctionParamsAST;
}): Params;

/**
 * Make it possible to narrow down the schema based on a specific version(3 or 3.1)
 */
type SchemaResult<TWithRef extends boolean = false> = {
    schema?: (TWithRef extends true ? OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject : OpenAPIV3.SchemaObject) & {
        nullable?: boolean;
        'x-nullable'?: boolean;
    };
    version: '3.0';
} | {
    schema?: (TWithRef extends true ? OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject : OpenAPIV3_1.SchemaObject) & {
        nullable?: boolean;
        'x-nullable'?: boolean;
    };
    version: '3.1';
};
declare function getSchemaFactory<TWithRef extends boolean = false>(oas: Oas): (schema?: SchemaObject) => SchemaResult<TWithRef>;

type Generated = {
    import: {
        refs: Refs;
        name: string;
    };
};
declare function refsSorter<T extends Generated>(a: T, b: T): number;

declare function parseFromConfig(config: Config, oasClass?: typeof Oas): Promise<Oas>;

export { getASTParams, getComments, getGroupedByTagFiles, getPathParams, getSchemaFactory, parseFromConfig, refsSorter };
