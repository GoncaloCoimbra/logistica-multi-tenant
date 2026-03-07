"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }




var _chunkYTB6UVWKcjs = require('./chunk-YTB6UVWK.cjs');

// src/components/Parser.tsx
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );
var import_react = _chunkYTB6UVWKcjs.__toESM.call(void 0, _chunkYTB6UVWKcjs.require_react.call(void 0, ), 1);
var import_jsx_runtime = _chunkYTB6UVWKcjs.__toESM.call(void 0, _chunkYTB6UVWKcjs.require_jsx_runtime.call(void 0, ), 1);
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
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );
var import_react2 = _chunkYTB6UVWKcjs.__toESM.call(void 0, _chunkYTB6UVWKcjs.require_react.call(void 0, ), 1);
var import_jsx_runtime2 = _chunkYTB6UVWKcjs.__toESM.call(void 0, _chunkYTB6UVWKcjs.require_jsx_runtime.call(void 0, ), 1);
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
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );
var _transformers = require('@kubb/core/transformers'); var _transformers2 = _interopRequireDefault(_transformers);
function useIndent({ size, children }) {
  let indentWithChildren;
  if (!children) {
    return _transformers2.default.createIndent(size);
  }
  if (typeof children === "string") {
    indentWithChildren = children.replaceAll("\n", `
${_transformers2.default.createIndent(size)}`);
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
${_transformers2.default.createIndent(size)}`);
      }
      return text;
    });
  }
  return indentWithChildren;
}

// src/components/App.tsx
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );
var import_react3 = _chunkYTB6UVWKcjs.__toESM.call(void 0, _chunkYTB6UVWKcjs.require_react.call(void 0, ), 1);
var import_jsx_runtime3 = _chunkYTB6UVWKcjs.__toESM.call(void 0, _chunkYTB6UVWKcjs.require_jsx_runtime.call(void 0, ), 1);
var AppContext = (0, import_react3.createContext)(void 0);
function App({ plugin, pluginManager, mode, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(AppContext.Provider, { value: { plugin, pluginManager, mode }, children });
}
App.Context = AppContext;







exports.TypeScript = TypeScript; exports.Parser = Parser; exports.File = File; exports.useIndent = useIndent; exports.App = App;
//# sourceMappingURL=chunk-VJFHH3RA.cjs.map