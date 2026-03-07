// ../../node_modules/.pnpm/natural-orderby@3.0.2/node_modules/natural-orderby/dist/index.js
var compareNumbers = function compareNumbers2(numberA, numberB) {
  if (numberA < numberB) {
    return -1;
  }
  if (numberA > numberB) {
    return 1;
  }
  return 0;
};
var compareUnicode = function compareUnicode2(stringA, stringB) {
  var result = stringA.localeCompare(stringB);
  return result ? result / Math.abs(result) : 0;
};
var RE_NUMBERS = /(^0x[\da-fA-F]+$|^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?(?!\.\d+)(?=\D|\s|$))|\d+)/g;
var RE_LEADING_OR_TRAILING_WHITESPACES = /^\s+|\s+$/g;
var RE_WHITESPACES = /\s+/g;
var RE_INT_OR_FLOAT = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
var RE_DATE = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[/-]\d{1,4}[/-]\d{1,4}|^\w+, \w+ \d+, \d{4})/;
var RE_LEADING_ZERO = /^0+[1-9]{1}[0-9]*$/;
var RE_UNICODE_CHARACTERS = /[^\x00-\x80]/;
var stringCompare = function stringCompare2(stringA, stringB) {
  if (stringA < stringB) {
    return -1;
  }
  if (stringA > stringB) {
    return 1;
  }
  return 0;
};
var compareChunks = function compareChunks2(chunksA, chunksB) {
  var lengthA = chunksA.length;
  var lengthB = chunksB.length;
  var size = Math.min(lengthA, lengthB);
  for (var i = 0; i < size; i++) {
    var chunkA = chunksA[i];
    var chunkB = chunksB[i];
    if (chunkA.normalizedString !== chunkB.normalizedString) {
      if (chunkA.normalizedString === "" !== (chunkB.normalizedString === "")) {
        return chunkA.normalizedString === "" ? -1 : 1;
      }
      if (chunkA.parsedNumber !== void 0 && chunkB.parsedNumber !== void 0) {
        var result = compareNumbers(chunkA.parsedNumber, chunkB.parsedNumber);
        if (result === 0) {
          return stringCompare(chunkA.normalizedString, chunkB.normalizedString);
        }
        return result;
      } else if (chunkA.parsedNumber !== void 0 || chunkB.parsedNumber !== void 0) {
        return chunkA.parsedNumber !== void 0 ? -1 : 1;
      } else if (RE_UNICODE_CHARACTERS.test(chunkA.normalizedString + chunkB.normalizedString)) {
        return compareUnicode(chunkA.normalizedString, chunkB.normalizedString);
      } else {
        return stringCompare(chunkA.normalizedString, chunkB.normalizedString);
      }
    }
  }
  if (lengthA > size || lengthB > size) {
    return lengthA <= size ? -1 : 1;
  }
  return 0;
};
var compareOtherTypes = function compareOtherTypes2(valueA, valueB) {
  if (!valueA.chunks ? valueB.chunks : !valueB.chunks) {
    return !valueA.chunks ? 1 : -1;
  }
  if (valueA.isNaN ? !valueB.isNaN : valueB.isNaN) {
    return valueA.isNaN ? -1 : 1;
  }
  if (valueA.isSymbol ? !valueB.isSymbol : valueB.isSymbol) {
    return valueA.isSymbol ? -1 : 1;
  }
  if (valueA.isObject ? !valueB.isObject : valueB.isObject) {
    return valueA.isObject ? -1 : 1;
  }
  if (valueA.isArray ? !valueB.isArray : valueB.isArray) {
    return valueA.isArray ? -1 : 1;
  }
  if (valueA.isFunction ? !valueB.isFunction : valueB.isFunction) {
    return valueA.isFunction ? -1 : 1;
  }
  if (valueA.isNull ? !valueB.isNull : valueB.isNull) {
    return valueA.isNull ? -1 : 1;
  }
  return 0;
};
var compareValues = function compareValues2(valueA, valueB) {
  if (valueA.value === valueB.value) {
    return 0;
  }
  if (valueA.parsedNumber !== void 0 && valueB.parsedNumber !== void 0) {
    return compareNumbers(valueA.parsedNumber, valueB.parsedNumber);
  }
  if (valueA.chunks && valueB.chunks) {
    return compareChunks(valueA.chunks, valueB.chunks);
  }
  return compareOtherTypes(valueA, valueB);
};
var normalizeAlphaChunk = function normalizeAlphaChunk2(chunk) {
  return chunk.replace(RE_WHITESPACES, " ").replace(RE_LEADING_OR_TRAILING_WHITESPACES, "");
};
var parseNumber = function parseNumber2(value) {
  if (value.length !== 0) {
    var parsedNumber = Number(value);
    if (!Number.isNaN(parsedNumber)) {
      return parsedNumber;
    }
  }
  return void 0;
};
var normalizeNumericChunk = function normalizeNumericChunk2(chunk, index, chunks) {
  if (RE_INT_OR_FLOAT.test(chunk)) {
    if (!RE_LEADING_ZERO.test(chunk) || index === 0 || chunks[index - 1] !== ".") {
      return parseNumber(chunk) || 0;
    }
  }
  return void 0;
};
var createChunkMap = function createChunkMap2(chunk, index, chunks) {
  return {
    parsedNumber: normalizeNumericChunk(chunk, index, chunks),
    normalizedString: normalizeAlphaChunk(chunk)
  };
};
var createChunks = function createChunks2(value) {
  return value.replace(RE_NUMBERS, "\0$1\0").replace(/\0$/, "").replace(/^\0/, "").split("\0");
};
var createChunkMaps = function createChunkMaps2(value) {
  var chunksMaps = createChunks(value).map(createChunkMap);
  return chunksMaps;
};
var isFunction = function isFunction2(value) {
  return typeof value === "function";
};
var isNaN = function isNaN2(value) {
  return Number.isNaN(value) || value instanceof Number && Number.isNaN(value.valueOf());
};
var isNull = function isNull2(value) {
  return value === null;
};
var isObject = function isObject2(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof Number) && !(value instanceof String) && !(value instanceof Boolean) && !(value instanceof Date);
};
var isSymbol = function isSymbol2(value) {
  return typeof value === "symbol";
};
var isUndefined = function isUndefined2(value) {
  return value === void 0;
};
var parseDate = function parseDate2(value) {
  try {
    var parsedDate = Date.parse(value);
    if (!Number.isNaN(parsedDate)) {
      if (RE_DATE.test(value)) {
        return parsedDate;
      }
    }
    return void 0;
  } catch (_unused) {
    return void 0;
  }
};
var numberify = function numberify2(value) {
  var parsedNumber = parseNumber(value);
  if (parsedNumber !== void 0) {
    return parsedNumber;
  }
  return parseDate(value);
};
var stringify = function stringify2(value) {
  if (typeof value === "boolean" || value instanceof Boolean) {
    return Number(value).toString();
  }
  if (typeof value === "number" || value instanceof Number) {
    return value.toString();
  }
  if (value instanceof Date) {
    return value.getTime().toString();
  }
  if (typeof value === "string" || value instanceof String) {
    return value.toLowerCase().replace(RE_LEADING_OR_TRAILING_WHITESPACES, "");
  }
  return "";
};
var getMappedValueRecord = function getMappedValueRecord2(value) {
  if (typeof value === "string" || value instanceof String || (typeof value === "number" || value instanceof Number) && !isNaN(value) || typeof value === "boolean" || value instanceof Boolean || value instanceof Date) {
    var stringValue = stringify(value);
    var parsedNumber = numberify(stringValue);
    var chunks = createChunkMaps(parsedNumber ? "" + parsedNumber : stringValue);
    return {
      parsedNumber,
      chunks,
      value
    };
  }
  return {
    isArray: Array.isArray(value),
    isFunction: isFunction(value),
    isNaN: isNaN(value),
    isNull: isNull(value),
    isObject: isObject(value),
    isSymbol: isSymbol(value),
    isUndefined: isUndefined(value),
    value
  };
};
var compareMultiple = function compareMultiple2(recordA, recordB, orders) {
  var indexA = recordA.index, valuesA = recordA.values;
  var indexB = recordB.index, valuesB = recordB.values;
  var length = valuesA.length;
  var ordersLength = orders.length;
  for (var i = 0; i < length; i++) {
    var order = i < ordersLength ? orders[i] : null;
    if (order && typeof order === "function") {
      var result = order(valuesA[i].value, valuesB[i].value);
      if (result) {
        return result;
      }
    } else {
      var _result = compareValues(valuesA[i], valuesB[i]);
      if (_result) {
        return _result * (order === "desc" ? -1 : 1);
      }
    }
  }
  return indexA - indexB;
};
var createIdentifierFn = function createIdentifierFn2(identifier) {
  if (typeof identifier === "function") {
    return identifier;
  }
  return function(value) {
    if (Array.isArray(value)) {
      var index = Number(identifier);
      if (Number.isInteger(index)) {
        return value[index];
      }
    } else if (value && typeof value === "object") {
      var result = Object.getOwnPropertyDescriptor(value, identifier);
      return result == null ? void 0 : result.value;
    }
    return value;
  };
};
var getElementByIndex = function getElementByIndex2(collection, index) {
  return collection[index];
};
var getValueByIdentifier = function getValueByIdentifier2(value, getValue) {
  return getValue(value);
};
var baseOrderBy = function baseOrderBy2(collection, identifiers, orders) {
  var identifierFns = identifiers.length ? identifiers.map(createIdentifierFn) : [function(value) {
    return value;
  }];
  var mappedCollection = collection.map(function(element, index) {
    var values = identifierFns.map(function(identifier) {
      return getValueByIdentifier(element, identifier);
    }).map(getMappedValueRecord);
    return {
      index,
      values
    };
  });
  mappedCollection.sort(function(recordA, recordB) {
    return compareMultiple(recordA, recordB, orders);
  });
  return mappedCollection.map(function(element) {
    return getElementByIndex(collection, element.index);
  });
};
var getIdentifiers = function getIdentifiers2(identifiers) {
  if (!identifiers) {
    return [];
  }
  var identifierList = !Array.isArray(identifiers) ? [identifiers] : [].concat(identifiers);
  if (identifierList.some(function(identifier) {
    return typeof identifier !== "string" && typeof identifier !== "number" && typeof identifier !== "function";
  })) {
    return [];
  }
  return identifierList;
};
var getOrders = function getOrders2(orders) {
  if (!orders) {
    return [];
  }
  var orderList = !Array.isArray(orders) ? [orders] : [].concat(orders);
  if (orderList.some(function(order) {
    return order !== "asc" && order !== "desc" && typeof order !== "function";
  })) {
    return [];
  }
  return orderList;
};
function orderBy(collection, identifiers, orders) {
  if (!collection || !Array.isArray(collection)) {
    return [];
  }
  var validatedIdentifiers = getIdentifiers(identifiers);
  var validatedOrders = getOrders(orders);
  return baseOrderBy(collection, validatedIdentifiers, validatedOrders);
}

// src/transformers/casing.ts
import { camelCase as changeCamelCase, pascalCase as changePascalCase, pathCase as changePathCase } from "change-case";
function camelCase(text, { isFile, prefix = "", suffix = "" } = {}) {
  if (isFile) {
    const splitArray = text.split(".");
    return splitArray.map((item, i) => i === splitArray.length - 1 ? camelCase(item, { prefix, suffix }) : camelCase(item)).join("/");
  }
  return changeCamelCase(`${prefix} ${text} ${suffix}`, {
    delimiter: "",
    mergeAmbiguousCharacters: true
  });
}
function pascalCase(text, { isFile, prefix = "", suffix = "" } = {}) {
  if (isFile) {
    const splitArray = text.split(".");
    return splitArray.map((item, i) => i === splitArray.length - 1 ? pascalCase(item, { prefix, suffix }) : camelCase(item)).join("/");
  }
  return changePascalCase(`${prefix} ${text} ${suffix}`, {
    delimiter: "",
    mergeAmbiguousCharacters: true
  });
}
function pathCase(text, { isFile, prefix = "", suffix = "" } = {}) {
  if (isFile) {
    const splitArray = text.split(".");
    return splitArray.map((item, i) => i === splitArray.length - 1 ? pathCase(item, { prefix, suffix }) : camelCase(item)).join("/");
  }
  return changePathCase(`${prefix} ${text} ${suffix}`, { delimiter: "" });
}

export {
  orderBy,
  camelCase,
  pascalCase,
  pathCase
};
/*! Bundled license information:

natural-orderby/dist/index.js:
  (**
   * natural-orderby v3.0.2
   *
   * Copyright (c) Olaf Ennen
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)
*/
//# sourceMappingURL=chunk-4X5FFJPJ.js.map