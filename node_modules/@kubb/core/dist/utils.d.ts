import { PossiblePromise } from '@kubb/types';
import * as _kubb_parser_ts from '@kubb/parser-ts';

type FunctionParamsASTWithoutType = {
    name?: string;
    type?: string;
    /**
     * @default true
     */
    required?: boolean;
    /**
     * @default true
     */
    enabled?: boolean;
    default?: string;
};
type FunctionParamsASTWithType = {
    name?: never;
    type: string;
    /**
     * @default true
     */
    required?: boolean;
    /**
     * @default true
     */
    enabled?: boolean;
    default?: string;
};
/**
 * @deprecated
 */
type FunctionParamsAST = FunctionParamsASTWithoutType | FunctionParamsASTWithType;
/**
 * @deprecated
 */
declare class FunctionParams {
    #private;
    constructor();
    get items(): FunctionParamsAST[];
    add(item: FunctionParamsAST | Array<FunctionParamsAST | FunctionParamsAST[] | undefined> | undefined): FunctionParams;
    static toObject(items: FunctionParamsAST[]): FunctionParamsAST;
    static toString(items: (FunctionParamsAST | FunctionParamsAST[])[]): string;
    toObject(): FunctionParamsAST;
    toString(): string;
}

declare function isPromise<T>(result: PossiblePromise<T>): result is Promise<T>;
declare function isPromiseFulfilledResult<T = unknown>(result: PromiseSettledResult<unknown>): result is PromiseFulfilledResult<T>;
declare function isPromiseRejectedResult<T>(result: PromiseSettledResult<unknown>): result is Omit<PromiseRejectedResult, 'reason'> & {
    reason: T;
};

declare function renderTemplate<TData extends Record<string, unknown> = Record<string, unknown>>(template: string, data?: TData | undefined): string;

declare function timeout(ms: number): Promise<unknown>;

declare function getUniqueName(originalName: string, data: Record<string, number>): string;
declare function setUniqueName(originalName: string, data: Record<string, number>): string;

type URLObject = {
    url: string;
    params?: Record<string, string>;
};
type ObjectOptions = {
    type?: 'path' | 'template';
    replacer?: (pathParam: string) => string;
    stringify?: boolean;
};
declare class URLPath {
    path: string;
    constructor(path: string);
    /**
     * Convert Swagger path to URLPath(syntax of Express)
     * @example /pet/{petId} => /pet/:petId
     */
    get URL(): string;
    get isURL(): boolean;
    /**
     * Convert Swagger path to template literals/ template strings(camelcase)
     * @example /pet/{petId} => `/pet/${petId}`
     * @example /account/monetary-accountID => `/account/${monetaryAccountId}`
     * @example /account/userID => `/account/${userId}`
     */
    get template(): string;
    get object(): URLObject | string;
    get params(): Record<string, string> | undefined;
    toObject({ type, replacer, stringify }?: ObjectOptions): URLObject | string;
    /**
     * Convert Swagger path to template literals/ template strings(camelcase)
     * @example /pet/{petId} => `/pet/${petId}`
     * @example /account/monetary-accountID => `/account/${monetaryAccountId}`
     * @example /account/userID => `/account/${userId}`
     */
    toTemplateString(replacer?: (pathParam: string) => string): string;
    getParams(replacer?: (pathParam: string) => string): Record<string, string> | undefined;
    /**
     * Convert Swagger path to URLPath(syntax of Express)
     * @example /pet/{petId} => /pet/:petId
     */
    toURLPath(): string;
}

declare function getParser(language: string | undefined): Promise<typeof _kubb_parser_ts>;

export { FunctionParams, type FunctionParamsAST, type URLObject, URLPath, getParser, getUniqueName, isPromise, isPromiseFulfilledResult, isPromiseRejectedResult, renderTemplate, setUniqueName, timeout };
