import './Root-C7nIPwER.js';
import './File-DxZloO47.js';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import * as react from 'react';
import { ReactElement } from 'react';
import { K as KubbNode, J as JSDoc } from './types-BUlEKKUx.js';
import { PluginManager, Plugin } from '@kubb/core';
import * as KubbFile from '@kubb/fs/types';

type Param = {
    /**
     * `object` will return the pathParams as an object.
     *
     * `inline` will return the pathParams as comma separated params.
     * @default `'inline'`
     * @private
     */
    mode?: 'object' | 'inline' | 'inlineSpread';
    type?: 'string' | 'number' | (string & {});
    optional?: boolean;
    /**
     * @example test = "default"
     */
    default?: string;
    /**
     * Used for no TypeScript(with mode object)
     * @example test: "default"
     */
    value?: string;
    children?: Params;
};
type Params = Record<string, Param | undefined>;

type Props$4 = {
    /**
     * Name of the function.
     */
    name: string;
    /**
     * Parameters/options/props that need to be used.
     */
    params?: string | Params;
    /**
     * Does this function need to be exported.
     */
    export?: boolean;
    /**
     * Does the function has async/promise behaviour.
     * This will also add `Promise<returnType>` as the returnType.
     */
    async?: boolean;
    /**
     * Generics that needs to be added for TypeScript.
     */
    generics?: string | string[];
    /**
     * ReturnType(see async for adding Promise type).
     */
    returnType?: string;
    /**
     * Options for JSdocs.
     */
    JSDoc?: JSDoc;
    children?: KubbNode;
};
declare function Function({ name, export: canExport, async, generics, params, returnType, JSDoc, children }: Props$4): KubbNode;
declare namespace Function {
    var Arrow: typeof ArrowFunction;
    var Call: typeof CallFunction;
    var Return: typeof ReturnFunction;
}
type ArrowFunctionProps = Props$4 & {
    /**
     * Create Arrow function in one line
     */
    singleLine?: boolean;
};
declare function ArrowFunction({ name, export: canExport, async, generics, params, returnType, JSDoc, singleLine, children }: ArrowFunctionProps): KubbNode;
/**
 *
 * @deprecated
 */
type CallFunctionProps = {
    /**
     * Name of the caller.
     */
    name: string;
    to: ReactElement<Props$4>;
};
/**
 *
 * @deprecated
 */
declare function CallFunction({ name, to }: CallFunctionProps): ReactJSXRuntime.JSX.Element;
/**
 *
 * @deprecated
 */
type ReturnFunctionProps = {
    children: KubbNode;
};
/**
 *
 * @deprecated
 */
declare function ReturnFunction({ children }: ReturnFunctionProps): ReactJSXRuntime.JSX.Element;

type Props$3 = {
    /**
     * Change the indent.
     * @default 0
     */
    indentSize?: number;
    children?: KubbNode;
};
declare function Text({ indentSize, children }: Props$3): KubbNode;
declare namespace Text {
    var Space: ({ size }: SpaceProps) => KubbNode;
    var Const: typeof Const$1;
}
type ConstProps = Props$3 & {
    /**
     * Name of the const.
     */
    name: string;
    /**
     * Does this const need to be exported.
     */
    export?: boolean;
    /**
     * Options for JSdocs.
     */
    JSDoc?: JSDoc;
};
/**
 * @deprecated
 */
declare function Const$1({ name, export: canExport, JSDoc, children }: ConstProps): KubbNode;
type SpaceProps = {
    /**
     * Change the indent
     * @default 1
     */
    size?: number;
};

type Props$2 = {
    /**
     * Name of the type, this needs to start with a capital letter.
     */
    name: string;
    /**
     * Does this type need to be exported.
     */
    export?: boolean;
    /**
     * Options for JSdocs.
     */
    JSDoc?: JSDoc;
    children?: KubbNode;
};
declare function Type({ name, export: canExport, JSDoc, children }: Props$2): KubbNode;

type Props$1 = {
    /**
     * Name of the const
     */
    name: string;
    /**
     * Does this type need to be exported.
     */
    export?: boolean;
    /**
     * Options for JSdocs.
     */
    JSDoc?: JSDoc;
    /**
     * Use of `const` assertions
     */
    asConst?: boolean;
    children?: KubbNode;
};
declare function Const({ name, export: canExport, JSDoc, asConst, children }: Props$1): KubbNode;

type AppContextProps = {
    mode: KubbFile.Mode;
    pluginManager: PluginManager;
    plugin: Plugin;
};
type Props = {
    mode: KubbFile.Mode;
    pluginManager: PluginManager;
    plugin: Plugin;
    children?: KubbNode;
};
declare function App({ plugin, pluginManager, mode, children }: Props): KubbNode;
declare namespace App {
    var Context: react.Context<AppContextProps | undefined>;
}

export { App as A, Const as C, Function as F, type Params as P, Text as T, Type as a, type Param as b };
