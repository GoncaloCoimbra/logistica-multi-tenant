import {
  ReactTemplate,
  createNode
} from "./chunk-ZZLUX5JS.js";
import {
  init_esm_shims
} from "./chunk-UVP53KGX.js";

// src/client/index.ts
init_esm_shims();

// src/client/createRoot.ts
init_esm_shims();
var instances = /* @__PURE__ */ new Map();
function createRoot({ container, logger } = {}) {
  if (!container) {
    container = createNode("kubb-root");
  }
  const instance = new ReactTemplate(container, { logger });
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

export {
  createRoot,
  client_default
};
//# sourceMappingURL=chunk-NMF2IR6B.js.map