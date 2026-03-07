import {
  camelCase,
  orderBy,
  pascalCase,
  pathCase
} from "./chunk-4X5FFJPJ.js";

// src/transformers/index.ts
import { merge } from "remeda";

// src/transformers/combineCodes.ts
function combineCodes(codes) {
  return codes.join("\n");
}

// src/transformers/createJSDocBlockText.ts
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
function createIndent(size) {
  return Array.from({ length: size + 1 }).join(" ");
}

// src/transformers/nameSorter.ts
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
function searchAndReplace(options) {
  const { text, replaceBy, prefix = "", key } = options;
  const searchValues = options.searchValues?.(prefix, key) || [
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

// src/transformers/trim.ts
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
  if (word && reservedWords.includes(word) || word?.match(/^\d/)) {
    return `_${word}`;
  }
  return word;
}

// src/transformers/index.ts
import { merge as merge2 } from "remeda";
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
  orderBy,
  merge,
  camelCase,
  pascalCase,
  pathCase
};

export {
  trim,
  trimQuotes,
  trimExtName,
  searchAndReplace,
  combineCodes,
  createJSDocBlockText,
  escape,
  jsStringEscape,
  createIndent,
  nameSorter,
  stringify,
  stringifyObject,
  toRegExp,
  toRegExpString,
  transformReservedWord,
  transformers_default,
  merge2 as merge
};
//# sourceMappingURL=chunk-OZKPV7RD.js.map