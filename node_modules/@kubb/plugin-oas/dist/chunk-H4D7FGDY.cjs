"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// ../../node_modules/.pnpm/tsup@8.3.0_@microsoft+api-extractor@7.47.9_@types+node@20.16.7__jiti@1.21.6_postcss@8.4.47_typescript@5.6.2_yaml@2.4.5/node_modules/tsup/assets/cjs_shims.js
var init_cjs_shims = __esm({
  "../../node_modules/.pnpm/tsup@8.3.0_@microsoft+api-extractor@7.47.9_@types+node@20.16.7__jiti@1.21.6_postcss@8.4.47_typescript@5.6.2_yaml@2.4.5/node_modules/tsup/assets/cjs_shims.js"() {
    "use strict";
  }
});

// src/utils/getSchemas.ts
init_cjs_shims();
function getSchemas({ oas, contentType, includes = ["schemas", "requestBodies", "responses"] }) {
  const components = oas.getDefinition().components;
  let schemas = {};
  if (includes.includes("schemas")) {
    schemas = {
      ...schemas,
      ..._optionalChain([components, 'optionalAccess', _ => _.schemas]) || {}
    };
  }
  const requestBodies = _optionalChain([components, 'optionalAccess', _2 => _2.requestBodies]) || {};
  if (includes.includes("responses")) {
    const responses = _optionalChain([components, 'optionalAccess', _3 => _3.responses]) || {};
    Object.entries(responses).forEach(([name, response]) => {
      if (response.content && !schemas[name]) {
        const firstContentType = Object.keys(response.content)[0] || "application/json";
        schemas[name] = _optionalChain([response, 'access', _4 => _4.content, 'optionalAccess', _5 => _5[contentType || firstContentType], 'optionalAccess', _6 => _6.schema]);
      }
    });
  }
  if (includes.includes("requestBodies")) {
    Object.entries(requestBodies).forEach(([name, request]) => {
      if (request.content && !schemas[name]) {
        const firstContentType = Object.keys(request.content)[0] || "application/json";
        schemas[name] = _optionalChain([request, 'access', _7 => _7.content, 'optionalAccess', _8 => _8[contentType || firstContentType], 'optionalAccess', _9 => _9.schema]);
      }
    });
  }
  return schemas;
}

// src/utils/getSchemaFactory.ts
init_cjs_shims();
var _oas = require('@kubb/oas');
function getSchemaFactory(oas) {
  return (schema) => {
    const version = _oas.isOpenApiV3_1Document.call(void 0, oas.api) ? "3.1" : "3.0";
    return {
      schema: oas.dereferenceWithRef(schema),
      version
    };
  };
}











exports.__commonJS = __commonJS; exports.__toESM = __toESM; exports.__privateGet = __privateGet; exports.__privateAdd = __privateAdd; exports.__privateSet = __privateSet; exports.__privateMethod = __privateMethod; exports.init_cjs_shims = init_cjs_shims; exports.getSchemas = getSchemas; exports.getSchemaFactory = getSchemaFactory;
//# sourceMappingURL=chunk-H4D7FGDY.cjs.map