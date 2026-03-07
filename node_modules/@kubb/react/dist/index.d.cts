export { R as RootType, c as createRoot } from './createRoot-Bd88HlRN.cjs';
export { createContext, useContext } from 'react';
import { D as DOMElement } from './types-BUlEKKUx.cjs';
export { b as DOMNode, a as DOMNodeAttribute, E as ElementNames, J as JSDoc, K as KubbNode, N as Node, c as NodeNames, T as TextNode } from './types-BUlEKKUx.cjs';
export { F as File, a as Parser, P as ParserLanguage } from './File-DFVhsT40.cjs';
export { A as App, C as Const, F as Function, b as Param, P as Params, T as Text, a as Type } from './index-CnuXFYlb.cjs';
export { useApp, useEditor, useFile, useIndent, useParser } from './hooks.cjs';
import '@kubb/core/logger';
import './Root-TqieGMtR.cjs';
import '@kubb/fs/types';
import '@kubb/core';
import 'react/jsx-runtime';

declare const createNode: (nodeName: string) => DOMElement;

export { DOMElement, createNode };
