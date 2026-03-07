import BaseOas from 'oas';
import { Operation } from 'oas/operation';
import * as OasTypes from 'oas/types';
import { OASDocument, User, SchemaObject as SchemaObject$1 } from 'oas/types';

type contentType = 'application/json' | (string & {});
type SchemaObject = OasTypes.SchemaObject & {
    'x-nullable'?: boolean;
    $ref?: string;
};
declare const HttpMethods: {
    GET: "get";
    POST: "post";
    PUT: "put";
    PATCH: "patch";
    DELETE: "delete";
    HEAD: "head";
    OPTIONS: "options";
    TRACE: "trace";
};

type Options = {
    contentType?: contentType;
};
declare class Oas<const TOAS = unknown> extends BaseOas {
    #private;
    document: TOAS;
    constructor({ oas, user }: {
        oas: TOAS | OASDocument | string;
        user?: User;
    }, options?: Options);
    get($ref: string): any;
    set($ref: string, value: unknown): false | undefined;
    resolveDiscriminators(): void;
    dereferenceWithRef(schema?: unknown): any;
    getResponseSchema(operation: Operation, statusCode: string | number): SchemaObject$1;
    getRequestSchema(operation: Operation): SchemaObject$1 | undefined;
    getParametersSchema(operation: Operation, inKey: 'path' | 'query' | 'header'): SchemaObject$1 | null;
    valdiate(): Promise<void>;
}

export { HttpMethods as H, Oas as O, type SchemaObject as S, type contentType as c };
