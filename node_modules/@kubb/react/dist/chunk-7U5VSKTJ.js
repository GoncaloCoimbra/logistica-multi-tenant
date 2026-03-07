import {
  App,
  File,
  Parser
} from "./chunk-YZNUOYKQ.js";
import {
  __toESM,
  init_esm_shims,
  require_react
} from "./chunk-UVP53KGX.js";

// src/hooks/index.ts
init_esm_shims();

// src/hooks/useFile.ts
init_esm_shims();
var import_react = __toESM(require_react(), 1);
function useFile() {
  const file = (0, import_react.useContext)(File.Context);
  return file;
}

// src/hooks/useApp.ts
init_esm_shims();
var import_react2 = __toESM(require_react(), 1);
function useApp() {
  const app = (0, import_react2.useContext)(App.Context);
  if (!app) {
    throw new Error("<App/> should be set");
  }
  return {
    plugin: app.plugin,
    pluginManager: app.pluginManager,
    fileManager: app.pluginManager.fileManager,
    getFile: app.pluginManager.getFile.bind(app.pluginManager),
    mode: app.mode
  };
}

// src/hooks/useParser.ts
init_esm_shims();
var import_react3 = __toESM(require_react(), 1);
function useEditor() {
  return (0, import_react3.useContext)(Parser.Context);
}
function useParser() {
  return (0, import_react3.useContext)(Parser.Context);
}

export {
  useFile,
  useApp,
  useEditor,
  useParser
};
//# sourceMappingURL=chunk-7U5VSKTJ.js.map