"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _chunkBNKXOCXZcjs = require('./chunk-BNKXOCXZ.cjs');


var _chunkYTB6UVWKcjs = require('./chunk-YTB6UVWK.cjs');

// src/client/index.ts
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );

// src/client/createRoot.ts
_chunkYTB6UVWKcjs.init_cjs_shims.call(void 0, );
var instances = /* @__PURE__ */ new Map();
function createRoot({ container, logger } = {}) {
  if (!container) {
    container = _chunkBNKXOCXZcjs.createNode.call(void 0, "kubb-root");
  }
  const instance = new (0, _chunkBNKXOCXZcjs.ReactTemplate)(container, { logger });
  instances.set(instance.id, instance);
  return {
    render(children, context) {
      return instance.render(children, context);
    },
    unmount() {
      instance.unmount();
      instances.delete(instance.id);
    },
    get output() {
      return instance.output;
    },
    get files() {
      return instance.files;
    },
    getFile(id) {
      return instance.files.find((file) => file.id === id);
    }
  };
}

// src/client/index.ts
var client_default = createRoot;




exports.createRoot = createRoot; exports.client_default = client_default;
//# sourceMappingURL=chunk-QS27IWQK.cjs.map