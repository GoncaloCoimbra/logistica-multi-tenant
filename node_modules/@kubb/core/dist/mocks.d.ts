import * as KubbFile from '@kubb/fs/types';
import { PluginManager } from './index.js';
import 'p-queue';
import '@kubb/fs';
import '@kubb/fs/src/types.ts';
import '@kubb/types';
import 'directory-tree';
import './logger-DChjnJMn.js';
import 'consola';
import 'ora';

declare const mockedPluginManager: PluginManager;
declare function matchFiles(files: KubbFile.File[]): Promise<void>;

export { matchFiles, mockedPluginManager };
