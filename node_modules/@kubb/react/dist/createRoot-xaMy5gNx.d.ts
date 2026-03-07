import { Logger } from '@kubb/core/logger';
import { R as RootContextProps } from './Root-C7nIPwER.js';
import { D as DOMElement } from './types-BUlEKKUx.js';
import * as KubbFile from '@kubb/fs/types';
import { ReactNode } from 'react';

type RootType<T = unknown> = {
    render(children: ReactNode, context?: T): void;
    unmount(): void;
    output: string;
    files: KubbFile.File[];
    getFile: (id: string) => KubbFile.File | undefined;
};

type Props = {
    container?: DOMElement;
    logger?: Logger;
};
declare function createRoot<Context extends RootContextProps = RootContextProps>({ container, logger }?: Props): RootType<Context>;

export { type RootType as R, createRoot as c };
