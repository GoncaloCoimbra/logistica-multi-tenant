import * as react from 'react';
import { K as KubbNode } from './types-BUlEKKUx.cjs';
import { FileMetaBase } from '@kubb/core';
import * as KubbFile from '@kubb/fs/types';

type ParserLanguage = 'typescript' | 'text' | (string & {});
type ParserContextProps = {
    language: ParserLanguage;
};
type Props$1 = {
    /**
     * Name of the language used.
     * @default 'text'
     */
    language?: ParserContextProps['language'];
    children?: KubbNode;
};
declare function TypeScript({ children }: Omit<Props$1, 'language'>): KubbNode;
declare function Parser({ language, children }: Props$1): KubbNode;
declare namespace Parser {
    var TypeScript: typeof TypeScript;
    var Context: react.Context<ParserContextProps>;
}

type FileContextProps<TMeta extends FileMetaBase = FileMetaBase> = {
    /**
     * Name to be used to dynamicly create the baseName(based on input.path).
     * Based on UNIX basename
     * @link https://nodejs.org/api/path.html#pathbasenamepath-suffix
     */
    baseName: KubbFile.BaseName;
    /**
     * Path will be full qualified path to a specified file.
     */
    path: KubbFile.Path;
    meta?: TMeta;
};
type BasePropsWithBaseName = {
    /**
     * Name to be used to dynamicly create the baseName(based on input.path).
     * Based on UNIX basename
     * @link https://nodejs.org/api/path.html#pathbasenamepath-suffix
     */
    baseName: KubbFile.BaseName;
    /**
     * Path will be full qualified path to a specified file.
     */
    path: KubbFile.Path;
};
type BasePropsWithoutBaseName = {
    baseName?: never;
    /**
     * Path will be full qualified path to a specified file.
     */
    path?: KubbFile.Path;
};
type BaseProps = BasePropsWithBaseName | BasePropsWithoutBaseName;
type Props<TMeta extends FileMetaBase = FileMetaBase> = BaseProps & {
    /**
     * Unique identifier to reuse later.
     * @default crypto.randomUUID()
     */
    id?: KubbFile.File['id'];
    /**
     * This will override `process.env[key]` inside the `source`, see `getFileSource`.
     */
    env?: KubbFile.File['env'];
    /**
     * This will call fileManager.add instead of fileManager.addOrAppend, adding the source when the files already exists.
     * This will also ignore the combinefiles utils
     * @default `false`
     */
    override?: KubbFile.File['override'];
    /**
     * Override if a file can be exported by the BarrelManager
     * @default true
     */
    exportable?: boolean;
    meta?: TMeta;
    children?: KubbNode;
};
declare function File<TMeta extends FileMetaBase = FileMetaBase>({ children, exportable, ...rest }: Props<TMeta>): KubbNode;
declare namespace File {
    var Export: typeof FileExport;
    var Import: typeof FileImport;
    var Source: typeof FileSource;
    var Context: react.Context<FileContextProps<FileMetaBase>>;
}
type FileSourceUnionProps = {
    /**
     * When path is set it will copy-paste that file as a string inside the component.
     * Children will then be ignored
     */
    path?: string;
    children?: never;
} | {
    /**
     * When path is set it will copy-paste that file as a string inside the component.
     * Children will then be ignored
     */
    path?: never;
    children?: KubbNode;
};
type FileSourceProps = FileSourceUnionProps & {
    /**
     * When true, it will return the generated import.
     * When false, it will add the import to a KubbFile instance(see fileManager).
     */
    print?: boolean;
};
declare function FileSource({ path, print, children }: FileSourceProps): KubbNode;
type FileExportProps = KubbFile.Export & {
    /**
     * When true, it will return the generated import.
     * When false, it will add the import to a KubbFile instance(see fileManager)
     */
    print?: boolean;
};
declare function FileExport({ name, path, isTypeOnly, asAlias, print, extName }: FileExportProps): KubbNode;
type FileImportProps = KubbFile.Import & {
    /**
     * When true, it will return the generated import.
     * When false, it will add the import to a KubbFile instance(see fileManager).
     */
    print?: boolean;
};
declare function FileImport({ name, root, path, isTypeOnly, isNameSpace, extName, print }: FileImportProps): KubbNode;

export { File as F, type ParserLanguage as P, TypeScript as T, Parser as a, type FileContextProps as b, type ParserContextProps as c };
