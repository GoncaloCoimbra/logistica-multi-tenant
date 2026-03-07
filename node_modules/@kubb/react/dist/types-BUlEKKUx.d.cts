import * as KubbFile from '@kubb/fs/types';
import { ReactNode } from 'react';

/**
 * TODO add for Server Components
 * import type {} from 'react/experimental'
 */
type ReactElementNames = 'br';
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'kubb-text': {
                children?: ReactNode;
            };
            'kubb-file': {
                id?: string;
                children?: ReactNode;
                baseName: string;
                path: string;
                env?: NodeJS.ProcessEnv;
                override?: boolean;
                exportable?: boolean;
                meta?: KubbFile.File['meta'];
            };
            'kubb-source': {
                children?: ReactNode;
                path?: string;
                print?: boolean;
            };
            'kubb-import': KubbFile.Import & {
                print?: boolean;
            };
            'kubb-export': KubbFile.Export & {
                print?: boolean;
            };
            'kubb-parser': {
                language?: string;
                children?: ReactNode;
            };
            'kubb-parser-provider': {
                language?: string;
                children?: ReactNode;
            };
        }
    }
}
type ElementNames = ReactElementNames | 'kubb-text' | 'kubb-file' | 'kubb-source' | 'kubb-import' | 'kubb-export' | 'kubb-root' | 'kubb-app' | 'kubb-language' | 'kubb-parser';
type Node = {
    parentNode: DOMElement | undefined;
    internal_static?: boolean;
};
type DOMNodeAttribute = boolean | string | number;
type TextName = '#text';
type TextNode = {
    nodeName: TextName;
    nodeValue: string;
} & Node;
type DOMNode<T = {
    nodeName: NodeNames;
}> = T extends {
    nodeName: infer U;
} ? U extends '#text' ? TextNode : DOMElement : never;
type OutputTransformer = (s: string, index: number) => string;
type DOMElement = {
    nodeName: ElementNames;
    attributes: Record<string, DOMNodeAttribute>;
    childNodes: DOMNode[];
    internal_transform?: OutputTransformer;
    isStaticDirty?: boolean;
    staticNode?: DOMElement;
    onComputeLayout?: () => void;
    onRender?: () => void;
    onImmediateRender?: () => void;
} & Node;
type NodeNames = ElementNames | TextName;
type KubbNode = ReactNode;
type JSDoc = {
    comments: string[];
};

export type { DOMElement as D, ElementNames as E, JSDoc as J, KubbNode as K, Node as N, TextNode as T, DOMNodeAttribute as a, DOMNode as b, NodeNames as c };
