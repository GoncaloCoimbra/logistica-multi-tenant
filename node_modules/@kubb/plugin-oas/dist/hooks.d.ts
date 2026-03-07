import { Oas, Operation, HttpMethod } from '@kubb/oas';
import { Plugin, ResolveNameParams, FileMetaBase } from '@kubb/core';
import * as KubbFile from '@kubb/fs/types';
import { f as OperationSchemas } from './types-RVAPVtNi.js';
import { a as SchemaContextProps } from './Schema-CuyurjSt.js';
import 'react';
import '@kubb/react';
import './SchemaMapper-BpjlzuXc.js';

declare function useOas(): Oas;

/**
 * `useOperation` will return the current `Operation`
 */
declare function useOperation(): Operation;

type FileMeta = FileMetaBase & {
    pluginKey: Plugin['key'];
    name: string;
    tag?: string;
};
type SchemaNames = {
    request: string | undefined;
    parameters: {
        path: string | undefined;
        query: string | undefined;
        header: string | undefined;
    };
    responses: {
        default?: string;
    } & Record<number | string, string>;
    errors: Record<number | string, string>;
};
type UseOperationManagerResult = {
    getName: (operation: Operation, params: {
        pluginKey?: Plugin['key'];
        type: ResolveNameParams['type'];
    }) => string;
    getFile: (operation: Operation, params?: {
        pluginKey?: Plugin['key'];
        extName?: KubbFile.Extname;
    }) => KubbFile.File<FileMeta>;
    groupSchemasByName: (operation: Operation, params: {
        pluginKey?: Plugin['key'];
        type: ResolveNameParams['type'];
    }) => SchemaNames;
    getSchemas: (operation: Operation, params?: {
        pluginKey?: Plugin['key'];
        type?: ResolveNameParams['type'];
    }, forStatusCode?: string | number) => OperationSchemas;
};
/**
 * `useOperationManager` will return some helper functions that can be used to get the operation file, get the operation name.
 */
declare function useOperationManager(): UseOperationManagerResult;

type UseOperationsProps = {
    /**
     * Filter based on path
     * Weight: 2
     */
    path?: string;
    /**
     * Filter based on method
     * Weight: 1
     */
    method?: HttpMethod;
};
/**
 * `useOperations` will return all the Operations
 */
declare function useOperations({ method, path }?: UseOperationsProps): Operation[];

type UseSchemaResult = SchemaContextProps;
/**
 * `useSchema` will return the current `schema properties`
 */
declare function useSchema(): UseSchemaResult;

export { useOas, useOperation, useOperationManager, useOperations, useSchema };
