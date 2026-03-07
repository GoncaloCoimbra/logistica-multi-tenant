import * as react from 'react';
import { ReactNode } from 'react';
import ReactJSXRuntime__default from 'react/jsx-runtime';
import * as KubbFile from '@kubb/fs/types';

/**
 * TODO add for Server Components
 * import type {} from 'react/experimental'
 */
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
declare const Fragment: react.ExoticComponent<{
    children?: ReactNode | undefined;
}>;
declare const jsx: typeof ReactJSXRuntime__default.jsx;
declare const jsxs: typeof ReactJSXRuntime__default.jsxs;
declare const jsxDEV: typeof ReactJSXRuntime__default.jsx;

export { Fragment, jsx, jsxDEV, jsxs };
