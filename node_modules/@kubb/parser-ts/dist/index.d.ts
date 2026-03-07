import ts, { PrinterOptions } from 'typescript';
export { default as ts } from 'typescript';
export { f as factory } from './factory-DPDFOC51.js';

type ExportsResult = {
    name: string;
    isTypeOnly: boolean;
};
/**
 * @link https://github.com/microsoft/TypeScript/issues/15840
 */
declare function getExports(filePath: string): undefined | Array<ExportsResult>;

type ParseResult = {
    ast: ts.Node;
    text: string;
};
declare function parse(ast: ts.Node): ParseResult;

type Options = {
    source?: string;
    baseName?: string;
} & PrinterOptions;
declare function print(elements: ts.Node | Array<ts.Node | undefined> | null, { source, baseName, removeComments, noEmitHelpers, newLine }?: Options): string;

export { getExports, parse, print };
