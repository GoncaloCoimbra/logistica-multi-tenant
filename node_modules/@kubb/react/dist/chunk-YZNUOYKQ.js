import {
  __toESM,
  init_esm_shims,
  require_jsx_runtime,
  require_react
} from "./chunk-UVP53KGX.js";

// src/components/Parser.tsx
init_esm_shims();
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var ParserContext = (0, import_react.createContext)({ language: "text" });
function TypeScript({ children }) {
  const context = (0, import_react.useContext)(ParserContext);
  if (context.language !== "typescript") {
    return null;
  }
  return children;
}
function Parser({ language = "text", children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kubb-parser", { language, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParserContext.Provider, { value: { language }, children }) });
}
Parser.TypeScript = TypeScript;
Parser.Context = ParserContext;

// src/components/File.tsx
init_esm_shims();
var import_react2 = __toESM(require_react(), 1);
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
var FileContext = (0, import_react2.createContext)({});
function File({ children, exportable = true, ...rest }) {
  if (!rest.baseName || !rest.path) {
    return children;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("kubb-file", { exportable, ...rest, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(FileContext.Provider, { value: { baseName: rest.baseName, path: rest.path, meta: rest.meta }, children }) });
}
function FileSource({ path, print, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("kubb-source", { path, print, children });
}
function FileExport({ name, path, isTypeOnly, asAlias, print, extName }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("kubb-export", { name, path, isTypeOnly: isTypeOnly || false, extName, asAlias, print });
}
function FileImport({ name, root, path, isTypeOnly, isNameSpace, extName, print }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("kubb-import", { name, root, path, isNameSpace, extName, isTypeOnly: isTypeOnly || false, print });
}
File.Export = FileExport;
File.Import = FileImport;
File.Source = FileSource;
File.Context = FileContext;

// src/hooks/useIndent.ts
init_esm_shims();
import transformers from "@kubb/core/transformers";
function useIndent({ size, children }) {
  let indentWithChildren;
  if (!children) {
    return transformers.createIndent(size);
  }
  if (typeof children === "string") {
    indentWithChildren = children.replaceAll("\n", `
${transformers.createIndent(size)}`);
  }
  if (Array.isArray(children)) {
    indentWithChildren = children.map((child) => {
      let text = child;
      if (typeof text === "string") {
        if (text.startsWith("\n")) {
          text = text.replace("\n", "");
        }
        if (text.substring(text.length - 1, text.length) === "\n") {
          text = text.substring(0, text.length - 2);
        }
        text = text.replaceAll("\n", `
${transformers.createIndent(size)}`);
      }
      return text;
    });
  }
  return indentWithChildren;
}

// src/components/App.tsx
init_esm_shims();
var import_react3 = __toESM(require_react(), 1);
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
var AppContext = (0, import_react3.createContext)(void 0);
function App({ plugin, pluginManager, mode, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(AppContext.Provider, { value: { plugin, pluginManager, mode }, children });
}
App.Context = AppContext;

export {
  TypeScript,
  Parser,
  File,
  useIndent,
  App
};
//# sourceMappingURL=chunk-YZNUOYKQ.js.map