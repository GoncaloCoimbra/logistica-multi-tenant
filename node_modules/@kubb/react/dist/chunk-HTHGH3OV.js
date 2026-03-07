import {
  useIndent
} from "./chunk-YZNUOYKQ.js";
import {
  __toESM,
  init_esm_shims,
  require_jsx_runtime
} from "./chunk-UVP53KGX.js";

// src/components/index.ts
init_esm_shims();

// src/components/Function.tsx
init_esm_shims();
import { createJSDocBlockText as createJSDocBlockText2 } from "@kubb/core/transformers";

// src/shared/utils/getParams.ts
init_esm_shims();
import { camelCase } from "@kubb/core/transformers";
import { orderBy } from "natural-orderby";
function order(items) {
  return orderBy(
    items.filter(Boolean),
    [
      ([_key, item]) => {
        if (item?.children) {
          return void 0;
        }
        return !item?.default;
      },
      ([_key, item]) => {
        if (item?.children) {
          return void 0;
        }
        return !item?.optional;
      }
    ],
    ["desc", "desc"]
  );
}
function parseChild(key, item, options) {
  const entries = order(Object.entries(item.children));
  const types = [];
  const names = [];
  const optional = entries.every(([_key, item2]) => item2?.optional);
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
      if (entries.some(([_key, item2]) => item2?.type)) {
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
    const parsedItem = parseItem(camelCase(key), item);
    return [...acc, ...parsedItem];
  }, []).join(", ");
}
function isParamItems(items) {
  return typeof items !== "string" && items && Object.keys(items)?.length;
}

// src/components/Text.tsx
init_esm_shims();
import { createJSDocBlockText } from "@kubb/core/transformers";
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function Text({ indentSize = 0, children }) {
  const indentBefore = useIndent({ size: indentSize });
  const indentChildren = useIndent({ size: 4, children });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("kubb-text", { children: [
    indentBefore,
    indentChildren ? indentChildren : children
  ] });
}
function Const({ name, export: canExport, JSDoc, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    JSDoc?.comments && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      createJSDocBlockText({ comments: JSDoc?.comments }),
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
  const indentBefore = useIndent({ size });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kubb-text", { children: indentBefore });
}
Text.Space = Space;
Text.Const = Const;

// src/components/Function.tsx
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
function Function({ name, export: canExport, async, generics, params, returnType, JSDoc, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    JSDoc?.comments && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      createJSDocBlockText2({ comments: JSDoc?.comments }),
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
    JSDoc?.comments && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      createJSDocBlockText2({ comments: JSDoc?.comments }),
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
init_esm_shims();
import { createJSDocBlockText as createJSDocBlockText3 } from "@kubb/core/transformers";
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
function Type({ name, export: canExport, JSDoc, children }) {
  if (name.charAt(0).toUpperCase() !== name.charAt(0)) {
    throw new Error("Name should start with a capital letter(see TypeScript types)");
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
    JSDoc?.comments && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
      createJSDocBlockText3({ comments: JSDoc?.comments }),
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
init_esm_shims();
import { createJSDocBlockText as createJSDocBlockText4 } from "@kubb/core/transformers";
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
function Const2({ name, export: canExport, JSDoc, asConst, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
    JSDoc?.comments && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
      createJSDocBlockText4({ comments: JSDoc?.comments }),
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

export {
  Text,
  Function,
  Type,
  Const2 as Const
};
//# sourceMappingURL=chunk-HTHGH3OV.js.map