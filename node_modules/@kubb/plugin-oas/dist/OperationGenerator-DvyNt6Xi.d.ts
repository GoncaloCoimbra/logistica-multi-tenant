import { FileMetaBase, PluginFactoryOptions, Generator, PluginManager, Plugin } from '@kubb/core';
import * as KubbFile from '@kubb/fs/types';
import { Operation, Oas, contentType } from '@kubb/oas';
import { g as OperationsByMethod, f as OperationSchemas, E as Exclude, I as Include, b as Override } from './types-RVAPVtNi.js';

type GetOperationGeneratorOptions<T extends OperationGenerator<any, any, any>> = T extends OperationGenerator<infer Options, any, any> ? Options : never;
type OperationMethodResult<TFileMeta extends FileMetaBase> = Promise<KubbFile.File<TFileMeta> | Array<KubbFile.File<TFileMeta>> | null>;
type Context<TOptions, TPluginOptions extends PluginFactoryOptions> = {
    oas: Oas;
    exclude: Array<Exclude> | undefined;
    include: Array<Include> | undefined;
    override: Array<Override<TOptions>> | undefined;
    contentType: contentType | undefined;
    pluginManager: PluginManager;
    /**
     * Current plugin
     */
    plugin: Plugin<TPluginOptions>;
    mode: KubbFile.Mode;
};
declare abstract class OperationGenerator<TOptions = unknown, TPluginOptions extends PluginFactoryOptions = PluginFactoryOptions, TFileMeta extends FileMetaBase = FileMetaBase> extends Generator<TOptions, Context<TOptions, TPluginOptions>> {
    #private;
    get operationsByMethod(): OperationsByMethod;
    set operationsByMethod(paths: OperationsByMethod);
    getSchemas(operation: Operation, { forStatusCode, resolveName }?: {
        forStatusCode?: string | number;
        resolveName?: (name: string) => string;
    }): OperationSchemas;
    build(): Promise<Array<KubbFile.File<TFileMeta>>>;
    /**
     * Operation
     */
    operation(operation: Operation, options: TOptions): OperationMethodResult<TFileMeta>;
    /**
     * GET
     */
    get(operation: Operation, options: TOptions): OperationMethodResult<TFileMeta>;
    /**
     * POST
     */
    post(operation: Operation, options: TOptions): OperationMethodResult<TFileMeta>;
    /**
     * PATCH
     */
    patch(operation: Operation, options: TOptions): OperationMethodResult<TFileMeta>;
    /**
     * PUT
     */
    put(operation: Operation, options: TOptions): OperationMethodResult<TFileMeta>;
    /**
     * DELETE
     */
    delete(operation: Operation, options: TOptions): OperationMethodResult<TFileMeta>;
    /**
     * Combination of GET, POST, PATCH, PUT, DELETE
     */
    all(operations: Operation[], paths: OperationsByMethod): OperationMethodResult<TFileMeta>;
}

export { type GetOperationGeneratorOptions as G, type OperationMethodResult as O, OperationGenerator as a };
