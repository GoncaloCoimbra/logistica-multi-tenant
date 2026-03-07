import { Logger } from '@kubb/core/logger';
import { R as RootContextProps } from './Root-TqieGMtR.cjs';
import { D as DOMElement } from './types-BUlEKKUx.cjs';
import * as KubbFile from '@kubb/fs/types';
import { ReactNode } from 'react';

type RootType<T = unknown> = {
    renderToString(children: ReactNode, context?: T): Promise<string>;
    unmount(): void;
    files: KubbFile.File[];
    getFile: (id: string) => KubbFile.File | undefined;
};

type Props = {
    container?: DOMElement;
    logger?: Logger;
};
declare function createRootServer<Context extends RootContextProps = RootContextProps>({ container, logger }: Props): RootType<Context>;

export { type RootType, createRootServer, createRootServer as default };
