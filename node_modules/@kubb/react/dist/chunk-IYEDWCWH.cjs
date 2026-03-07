"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkVJFHH3RAcjs = require('./chunk-VJFHH3RA.cjs');




var _chunkYTB6UVWKcjs = require('./chunk-YTB6UVWK.cjs');

// src/components/index.ts
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );

// src/components/Function.tsx
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );
var _transformers = require('@kubb/core/transformers');

// src/shared/utils/getParams.ts
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );

var _naturalorderby = require('natural-orderby');
function order(items) {
  return _naturalorderby.orderBy.call(void 0, 
    items.filter(Boolean),
    [
      ([_key, item]) => {
        if (_optionalChain([item, 'optionalAccess', _ => _.children])) {
          return void 0;
        }
        return !_optionalChain([item, 'optionalAccess', _2 => _2.default]);
      },
      ([_key, item]) => {
        if (_optionalChain([item, 'optionalAccess', _3 => _3.children])) {
          return void 0;
        }
        return !_optionalChain([item, 'optionalAccess', _4 => _4.optional]);
      }
    ],
    ["desc", "desc"]
  );
}
function parseChild(key, item, options) {
  const entries = order(Object.entries(item.children));
  const types = [];
  const names = [];
  const optional = entries.every(([_key, item2]) => _optionalChain([item2, 'optionalAccess', _5 => _5.optional]));
  entries.forEach(([key2, entryItem]) => {
    if (entryItem) {
      if (options.type === "call") {
        names.push(...parseItem(key2, { ...entryItem, type: void 0 }));
      } else {
        names.push(
          ...parseItem(key2, {
            ...entryItem,
            type: void 0,
            value: void 0
          })
        );
      }
      if (entries.some(([_key, item2]) => _optionalChain([item2, 'optionalAccess', _6 => _6.type]))) {
        types.push(...parseItem(key2, { ...entryItem, default: void 0 }));
      }
    }
  });
  const name = item.mode === "inline" ? key : names.length ? `{ ${names.join(", ")} }` : "";
  const type = item.type ? item.type : types.length ? `{ ${types.join("; ")} }` : void 0;
  return parseItem(name, {
    type: options.type === "constructor" ? type : void 0,
    default: item.default ? item.default : void 0,
    optional: !item.default ? optional : void 0
  });
}
function parseItem(name, item) {
  const acc = [];
  if (item.type) {
    if (item.optional) {
      acc.push(`${name}?: ${item.type}`);
    } else {
      acc.push(`${name}: ${item.type}${item.default ? ` = ${item.default}` : ""}`);
    }
  } else if (item.default) {
    acc.push(`${name} = ${item.default}`);
  } else if (item.value) {
    acc.push(`${name} : ${item.value}`);
  } else if (item.mode === "inlineSpread") {
    acc.push(`... ${name}`);
  } else {
    acc.push(name);
  }
  return acc;
}
function getParams(items, options) {
  const entries = order(Object.entries(items));
  return entries.reduce((acc, [key, item]) => {
    if (!item) {
      return acc;
    }
    if (item.children) {
      if (Object.keys(item.children).length === 0) {
        return acc;
      }
      if (item.mode === "inlineSpread") {
        return [...acc, getParams(item.children, options)];
      }
      const parsedItem2 = parseChild(key, item, options);
      return [...acc, ...parsedItem2];
    }
    const parsedItem = parseItem(_transformers.camelCase.call(void 0, key), item);
    return [...acc, ...parsedItem];
  }, []).join(", ");
}
function isParamItems(items) {
  return typeof items !== "string" && items && _optionalChain([Object, 'access', _7 => _7.keys, 'call', _8 => _8(items), 'optionalAccess', _9 => _9.length]);
}

// src/components/Text.tsx
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );

var import_jsx_runtime = _chunkYTB6UVWKcjs.__toESM.call(void 0, _chunkYTB6UVWKcjs.require_jsx_runtime.call(void 0, ), 1);
function Text({ indentSize = 0, children }) {
  const indentBefore = _chunkVJFHH3RAcjs.useIndent.call(void 0, { size: indentSize });
  const indentChildren = _chunkVJFHH3RAcjs.useIndent.call(void 0, { size: 4, children });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("kubb-text", { children: [
    indentBefore,
    indentChildren ? indentChildren : children
  ] });
}
function Const({ name, export: canExport, JSDoc, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    _optionalChain([JSDoc, 'optionalAccess', _10 => _10.comments]) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      _transformers.createJSDocBlockText.call(void 0, { comments: _optionalChain([JSDoc, 'optionalAccess', _11 => _11.comments]) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {})
    ] }),
    canExport && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, { children: [
      "export",
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text.Space, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, { children: [
      "const ",
      name,
      " =",
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text.Space, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, { children })
  ] });
}
function Space({ size = 1 }) {
  const indentBefore = _chunkVJFHH3RAcjs.useIndent.call(void 0, { size });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kubb-text", { children: indentBefore });
}
Text.Space = Space;
Text.Const = Const;

// src/components/Function.tsx
var import_jsx_runtime2 = _chunkYTB6UVWKcjs.__toESM.call(void 0, _chunkYTB6UVWKcjs.require_jsx_runtime.call(void 0, ), 1);
function Function({ name, export: canExport, async, generics, params, returnType, JSDoc, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    _optionalChain([JSDoc, 'optionalAccess', _12 => _12.comments]) && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      _transformers.createJSDocBlockText.call(void 0, { comments: _optionalChain([JSDoc, 'optionalAccess', _13 => _13.comments]) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("br", {})
    ] }),
    canExport && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      "export",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text.Space, {})
    ] }),
    async && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      "async",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text.Space, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      "function ",
      name
    ] }),
    generics && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children: "<" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children: Array.isArray(generics) ? generics.join(", ").trim() : generics }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children: ">" })
    ] }),
    isParamItems(params) ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      "(",
      getParams(params, { type: "constructor" }),
      ")"
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      "(",
      params,
      ")"
    ] }),
    returnType && !async && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      ": ",
      returnType
    ] }),
    returnType && async && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      ": Promise",
      "<",
      returnType,
      ">"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children: " {" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("br", {}),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { indentSize: 2, children }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("br", {}),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children: "}" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("br", {})
  ] });
}
function ArrowFunction({ name, export: canExport, async, generics, params, returnType, JSDoc, singleLine, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    _optionalChain([JSDoc, 'optionalAccess', _14 => _14.comments]) && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      _transformers.createJSDocBlockText.call(void 0, { comments: _optionalChain([JSDoc, 'optionalAccess', _15 => _15.comments]) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("br", {})
    ] }),
    canExport && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      "export",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text.Space, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      "const ",
      name,
      " =",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text.Space, {})
    ] }),
    async && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      "async",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text.Space, {})
    ] }),
    generics && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children: "<" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children: Array.isArray(generics) ? generics.join(", ").trim() : generics }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children: ">" })
    ] }),
    isParamItems(params) ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      "(",
      getParams(params, { type: "constructor" }),
      ")"
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      "(",
      params,
      ")"
    ] }),
    returnType && !async && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      ": ",
      returnType
    ] }),
    returnType && async && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      ": Promise",
      "<",
      returnType,
      ">"
    ] }),
    singleLine && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children: " => " }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { indentSize: 2, children }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("br", {})
    ] }),
    !singleLine && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children: " => {" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("br", {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { indentSize: 2, children }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("br", {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children: "}" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("br", {})
    ] })
  ] });
}
function CallFunction({ name, to }) {
  const { params, name: fnName, generics, async } = to.props;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    "const ",
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children: name }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children: " = " }),
    async && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      "await",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text.Space, {})
    ] }),
    fnName,
    generics && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children: "<" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children: Array.isArray(generics) ? generics.join(", ").trim() : generics }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children: ">" })
    ] }),
    isParamItems(params) ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      "(",
      getParams(params, { type: "call" }),
      ")"
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { children: [
      "(",
      params,
      ")"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("br", {})
  ] });
}
function ReturnFunction({ children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Text, { indentSize: 2, children: [
    "return ",
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Text, { children })
  ] });
}
Function.Arrow = ArrowFunction;
Function.Call = CallFunction;
Function.Return = ReturnFunction;

// src/components/Type.tsx
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );

var import_jsx_runtime3 = _chunkYTB6UVWKcjs.__toESM.call(void 0, _chunkYTB6UVWKcjs.require_jsx_runtime.call(void 0, ), 1);
function Type({ name, export: canExport, JSDoc, children }) {
  if (name.charAt(0).toUpperCase() !== name.charAt(0)) {
    throw new Error("Name should start with a capital letter(see TypeScript types)");
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
    _optionalChain([JSDoc, 'optionalAccess', _16 => _16.comments]) && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
      _transformers.createJSDocBlockText.call(void 0, { comments: _optionalChain([JSDoc, 'optionalAccess', _17 => _17.comments]) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("br", {})
    ] }),
    canExport && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { children: [
      "export",
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text.Space, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { children: [
      "type ",
      name,
      " =",
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text.Space, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("br", {})
  ] });
}

// src/components/Const.tsx
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );

var import_jsx_runtime4 = _chunkYTB6UVWKcjs.__toESM.call(void 0, _chunkYTB6UVWKcjs.require_jsx_runtime.call(void 0, ), 1);
function Const2({ name, export: canExport, JSDoc, asConst, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
    _optionalChain([JSDoc, 'optionalAccess', _18 => _18.comments]) && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
      _transformers.createJSDocBlockText.call(void 0, { comments: _optionalChain([JSDoc, 'optionalAccess', _19 => _19.comments]) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("br", {})
    ] }),
    canExport && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(Text, { children: [
      "export",
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Text.Space, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(Text, { children: [
      "const ",
      name,
      " =",
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Text.Space, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Text, { children }),
    asConst && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(Text, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Text.Space, {}),
      "as const"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("br", {})
  ] });
}






exports.Text = Text; exports.Function = Function; exports.Type = Type; exports.Const = Const2;
//# sourceMappingURL=chunk-IYEDWCWH.cjs.map