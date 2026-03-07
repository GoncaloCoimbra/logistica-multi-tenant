"use strict";Object.defineProperty(exports, "__esModule", {value: true});



var _chunkVJFHH3RAcjs = require('./chunk-VJFHH3RA.cjs');




var _chunkYTB6UVWKcjs = require('./chunk-YTB6UVWK.cjs');

// src/hooks/index.ts
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );

// src/hooks/useFile.ts
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );
var import_react = _chunkYTB6UVWKcjs.__toESM.call(void 0, _chunkYTB6UVWKcjs.require_react.call(void 0, ), 1);
function useFile() {
  const file = (0, import_react.useContext)(_chunkVJFHH3RAcjs.File.Context);
  return file;
}

// src/hooks/useApp.ts
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );
var import_react2 = _chunkYTB6UVWKcjs.__toESM.call(void 0, _chunkYTB6UVWKcjs.require_react.call(void 0, ), 1);
function useApp() {
  const app = (0, import_react2.useContext)(_chunkVJFHH3RAcjs.App.Context);
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
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );
var import_react3 = _chunkYTB6UVWKcjs.__toESM.call(void 0, _chunkYTB6UVWKcjs.require_react.call(void 0, ), 1);
function useEditor() {
  return (0, import_react3.useContext)(_chunkVJFHH3RAcjs.Parser.Context);
}
function useParser() {
  return (0, import_react3.useContext)(_chunkVJFHH3RAcjs.Parser.Context);
}






exports.useFile = useFile; exports.useApp = useApp; exports.useEditor = useEditor; exports.useParser = useParser;
//# sourceMappingURL=chunk-36QRHFUN.cjs.map