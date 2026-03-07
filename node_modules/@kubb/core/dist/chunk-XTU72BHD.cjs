"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }




var _chunkKTZ6EAKPcjs = require('./chunk-KTZ6EAKP.cjs');


var _chunkNFUUQKWPcjs = require('./chunk-NFUUQKWP.cjs');

// src/transformers/index.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var _remeda = require('remeda');

// src/transformers/combineCodes.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
function combineCodes(codes) {
  return codes.join("\n");
}

// src/transformers/createJSDocBlockText.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
function createJSDocBlockText({ comments }) {
  const filteredComments = comments.filter(Boolean);
  if (!filteredComments.length) {
    return "";
  }
  return `/**
 * ${filteredComments.join("\n * ")}
 */`;
}

// src/transformers/escape.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
function escape(text) {
  return text ? text.replaceAll("`", "\\`") : "";
}
function jsStringEscape(input) {
  return `${input}`.replace(/["'\\\n\r\u2028\u2029]/g, (character) => {
    switch (character) {
      case '"':
      case "'":
      case "\\":
        return `\\${character}`;
      // Four possible LineTerminator characters need to be escaped:
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\u2028":
        return "\\u2028";
      case "\u2029":
        return "\\u2029";
      default:
        return "";
    }
  });
}

// src/transformers/indent.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
function createIndent(size) {
  return Array.from({ length: size + 1 }).join(" ");
}

// src/transformers/nameSorter.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
function nameSorter(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

// src/transformers/searchAndReplace.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
function searchAndReplace(options) {
  const { text, replaceBy, prefix = "", key } = options;
  const searchValues = _optionalChain([options, 'access', _ => _.searchValues, 'optionalCall', _2 => _2(prefix, key)]) || [
    `${prefix}["${key}"]`,
    `${prefix}['${key}']`,
    `${prefix}[\`${key}\`]`,
    `${prefix}"${key}"`,
    `${prefix}'${key}'`,
    `${prefix}\`${key}\``,
    new RegExp(`${prefix}${key}`, "g")
  ];
  return searchValues.reduce((prev, searchValue) => {
    return prev.toString().replaceAll(searchValue, replaceBy);
  }, text);
}

// src/transformers/stringify.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );

// src/transformers/trim.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
function trim(text) {
  return text.replaceAll(/\n/g, "").trim();
}
function trimQuotes(text) {
  if (text.match(/^"(.*)"$/)) {
    return text.replace(/^"(.*)"$/, "$1");
  }
  if (text.match(/^'(.*)'$/)) {
    return text.replace(/^'(.*)'$/, "$1");
  }
  if (text.match(/^`(.*)`$/)) {
    return text.replace(/^`(.*)`$/, "$1");
  }
  return text;
}
function trimExtName(text) {
  return text.replace(/\.[^/.]+$/, "");
}

// src/transformers/stringify.ts
function stringify(value) {
  if (value === void 0 || value === null) {
    return '""';
  }
  return JSON.stringify(trimQuotes(value.toString()));
}
function stringifyObject(value) {
  const items = Object.entries(value).map(([key, value2]) => {
    if (typeof value2 === "object") {
      return `${key}: {
        ${stringifyObject(value2)}
      }`;
    }
    return `${key}: ${value2}`;
  }).filter(Boolean);
  return items.join(",\n");
}

// src/transformers/toRegExp.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
function stringToRegex(text) {
  const isStartWithSlash = text.startsWith("/");
  const isEndWithSlash = text.endsWith("/");
  return new RegExp(text.slice(isStartWithSlash ? 1 : 0, isEndWithSlash ? -1 : void 0));
}
function toRegExp(text) {
  if (typeof text === "string") {
    const source = trimQuotes(text);
    return stringToRegex(source);
  }
  return stringToRegex(text.toString());
}
function toRegExpString(text, func = "RegExp") {
  const isStartWithSlash = text.startsWith("/");
  const isEndWithSlash = text.endsWith("/");
  const regexp = `new ${func}('${jsStringEscape(text.slice(isStartWithSlash ? 1 : 0, isEndWithSlash ? -1 : void 0))}')`;
  return regexp;
}

// src/transformers/transformReservedWord.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var reservedWords = [
  "abstract",
  "arguments",
  "boolean",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "double",
  "else",
  "enum",
  "eval",
  "export",
  "extends",
  "false",
  "final",
  "finally",
  "float",
  "for",
  "function",
  "goto",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "int",
  "interface",
  "let",
  "long",
  "native",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "short",
  "static",
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "transient",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "volatile",
  "while",
  "with",
  "yield",
  "Array",
  "Date",
  "eval",
  "function",
  "hasOwnProperty",
  "Infinity",
  "isFinite",
  "isNaN",
  "isPrototypeOf",
  "length",
  "Math",
  "name",
  "NaN",
  "Number",
  "Object",
  "prototype",
  "String",
  "toString",
  "undefined",
  "valueOf"
];
function transformReservedWord(word) {
  if (word && reservedWords.includes(word) || _optionalChain([word, 'optionalAccess', _3 => _3.match, 'call', _4 => _4(/^\d/)])) {
    return `_${word}`;
  }
  return word;
}

// src/transformers/index.ts

var transformers_default = {
  combineCodes,
  escape,
  jsStringEscape,
  createIndent,
  transformReservedWord,
  nameSorter,
  searchAndReplace,
  stringify,
  stringifyObject,
  toRegExp,
  toRegExpString,
  trim,
  trimQuotes,
  trimExtName,
  JSDoc: {
    createJSDocBlockText
  },
  orderBy: _chunkKTZ6EAKPcjs.orderBy,
  merge: _remeda.merge,
  camelCase: _chunkKTZ6EAKPcjs.camelCase,
  pascalCase: _chunkKTZ6EAKPcjs.pascalCase,
  pathCase: _chunkKTZ6EAKPcjs.pathCase
};



















exports.trim = trim; exports.trimQuotes = trimQuotes; exports.trimExtName = trimExtName; exports.searchAndReplace = searchAndReplace; exports.combineCodes = combineCodes; exports.createJSDocBlockText = createJSDocBlockText; exports.escape = escape; exports.jsStringEscape = jsStringEscape; exports.createIndent = createIndent; exports.nameSorter = nameSorter; exports.stringify = stringify; exports.stringifyObject = stringifyObject; exports.toRegExp = toRegExp; exports.toRegExpString = toRegExpString; exports.transformReservedWord = transformReservedWord; exports.transformers_default = transformers_default; exports.merge = _remeda.merge;
//# sourceMappingURL=chunk-XTU72BHD.cjs.map