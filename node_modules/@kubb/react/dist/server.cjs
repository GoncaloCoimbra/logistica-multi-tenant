"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


var _chunkBNKXOCXZcjs = require('./chunk-BNKXOCXZ.cjs');


var _chunkYTB6UVWKcjs = require('./chunk-YTB6UVWK.cjs');

// src/server/index.ts
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );

// src/server/createRootServer.ts
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );

// src/server/format.ts
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );
var _prettier = require('prettier');
var _typescript = require('prettier/plugins/typescript'); var _typescript2 = _interopRequireDefault(_typescript);
var formatOptions = {
  tabWidth: 2,
  printWidth: 160,
  parser: "typescript",
  singleQuote: true,
  semi: false,
  bracketSameLine: false,
  endOfLine: "auto",
  plugins: [_typescript2.default]
};
function format(source) {
  if (!source) {
    return Promise.resolve("");
  }
  return _prettier.format.call(void 0, source, formatOptions);
}

// src/server/createRootServer.ts
var instances = /* @__PURE__ */ new Map();
function createRootServer({ container, logger }) {
  if (!container) {
    container = _chunkBNKXOCXZcjs.createNode.call(void 0, "kubb-root");
  }
  const instance = new (0, _chunkBNKXOCXZcjs.ReactTemplate)(container, { logger });
  instances.set(instance.id, instance);
  return {
    renderToString(children, context) {
      instance.render(children, context);
      return format(instance.output);
    },
    unmount() {
      instance.unmount();
      instances.delete(instance.id);
    },
    get files() {
      return instance.files;
    },
    getFile(id) {
      return instance.files.find((file) => file.id === id);
    }
  };
}

// src/server/index.ts
var server_default = createRootServer;



exports.createRootServer = createRootServer; exports.default = server_default;
//# sourceMappingURL=server.cjs.map