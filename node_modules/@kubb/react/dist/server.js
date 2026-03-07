import {
  ReactTemplate,
  createNode
} from "./chunk-ZZLUX5JS.js";
import {
  init_esm_shims
} from "./chunk-UVP53KGX.js";

// src/server/index.ts
init_esm_shims();

// src/server/createRootServer.ts
init_esm_shims();

// src/server/format.ts
init_esm_shims();
import { format as prettierFormat } from "prettier";
import pluginTypescript from "prettier/plugins/typescript";
var formatOptions = {
  tabWidth: 2,
  printWidth: 160,
  parser: "typescript",
  singleQuote: true,
  semi: false,
  bracketSameLine: false,
  endOfLine: "auto",
  plugins: [pluginTypescript]
};
function format(source) {
  if (!source) {
    return Promise.resolve("");
  }
  return prettierFormat(source, formatOptions);
}

// src/server/createRootServer.ts
var instances = /* @__PURE__ */ new Map();
function createRootServer({ container, logger }) {
  if (!container) {
    container = createNode("kubb-root");
  }
  const instance = new ReactTemplate(container, { logger });
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
export {
  createRootServer,
  server_default as default
};
//# sourceMappingURL=server.js.map