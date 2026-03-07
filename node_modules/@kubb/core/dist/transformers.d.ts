import { orderBy } from 'natural-orderby';
export { orderBy } from 'natural-orderby';
import { merge } from 'remeda';
export { merge } from 'remeda';

type Options$1 = {
    /**
     * When set it will replace all `.` with `/`.
     */
    isFile?: boolean;
    prefix?: string;
    suffix?: string;
};
declare function camelCase(text: string, { isFile, prefix, suffix }?: Options$1): string;
declare function pascalCase(text: string, { isFile, prefix, suffix }?: Options$1): string;
declare function pathCase(text: string, { isFile, prefix, suffix }?: Options$1): string;

declare function combineCodes(codes: string[]): string;

declare function createJSDocBlockText({ comments }: {
    comments: Array<string>;
}): string;

declare function escape(text?: string): string;
/**
 * Escape all characters not included in SingleStringCharacters and DoubleStringCharacters on
 * @link http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
 * @link https://github.com/joliss/js-string-escape/blob/master/index.js
 */
declare function jsStringEscape(input: any): string;

declare function createIndent(size: number): string;

declare function nameSorter<T extends {
    name: string;
}>(a: T, b: T): 0 | 1 | -1;

type Options = {
    text: string;
    replaceBy: string;
    prefix?: string;
    key: string;
    searchValues?: (prefix: string, key: string) => Array<RegExp | string>;
};
declare function searchAndReplace(options: Options): string;

declare function stringify(value: string | number | boolean | undefined): string;
declare function stringifyObject(value: object): string;

/**
 * @experimental
 */
declare function toRegExp(text: string | RegExp): RegExp;
declare function toRegExpString(text: string, func?: string): string;

declare function transformReservedWord(word: string): string;

declare function trim(text: string): string;
declare function trimQuotes(text: string): string;
declare function trimExtName(text: string): string;

declare const _default: {
    readonly combineCodes: typeof combineCodes;
    readonly escape: typeof escape;
    readonly jsStringEscape: typeof jsStringEscape;
    readonly createIndent: typeof createIndent;
    readonly transformReservedWord: typeof transformReservedWord;
    readonly nameSorter: typeof nameSorter;
    readonly searchAndReplace: typeof searchAndReplace;
    readonly stringify: typeof stringify;
    readonly stringifyObject: typeof stringifyObject;
    readonly toRegExp: typeof toRegExp;
    readonly toRegExpString: typeof toRegExpString;
    readonly trim: typeof trim;
    readonly trimQuotes: typeof trimQuotes;
    readonly trimExtName: typeof trimExtName;
    readonly JSDoc: {
        readonly createJSDocBlockText: typeof createJSDocBlockText;
    };
    readonly orderBy: typeof orderBy;
    readonly merge: typeof merge;
    readonly camelCase: typeof camelCase;
    readonly pascalCase: typeof pascalCase;
    readonly pathCase: typeof pathCase;
};

export { camelCase, combineCodes, createIndent, createJSDocBlockText, _default as default, escape, jsStringEscape, nameSorter, pascalCase, pathCase, searchAndReplace, stringify, stringifyObject, toRegExp, toRegExpString, transformReservedWord, trim, trimExtName, trimQuotes };
