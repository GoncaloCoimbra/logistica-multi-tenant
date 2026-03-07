import { FileMetaBase, PluginFactoryOptions, Plugin, PluginManager, FileManager } from '@kubb/core';
import { b as FileContextProps, c as ParserContextProps } from './File-DFVhsT40.cjs';
import * as KubbFile from '@kubb/fs/types';
import { K as KubbNode } from './types-BUlEKKUx.cjs';
import 'react';

/**
 * `useFile` will return the current file when <File/> is used.
 */
declare function useFile<TMeta extends FileMetaBase = FileMetaBase>(): FileContextProps<TMeta>;

type AppResult<TOptions extends PluginFactoryOptions = PluginFactoryOptions> = {
    plugin: Plugin<TOptions>;
    mode: KubbFile.Mode;
    pluginManager: PluginManager;
    fileManager: FileManager;
    getFile: PluginManager['getFile'];
};
/**
 * `useApp` will return the current App with plugin, pluginManager, fileManager and mode.
 */
declare function useApp<TOptions extends PluginFactoryOptions = PluginFactoryOptions>(): AppResult<TOptions>;

type Props = {
    /**
     * Size to use for the indenting
     */
    size: number;
    children?: KubbNode;
};
declare function useIndent({ size, children }: Props): KubbNode;

/**
 * `useEditor` will return the current language set by the parent `Editor` component.
 * @deprecated use `useParser` instead
 */
declare function useEditor(): ParserContextProps;
declare function useParser(): ParserContextProps;

export { useApp, useEditor, useFile, useIndent, useParser };
