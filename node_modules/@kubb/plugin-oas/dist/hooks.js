import {
  Oas,
  Operation,
  useSchema
} from "./chunk-P7OMLU5B.js";
import "./chunk-IWUQTVK4.js";
import {
  init_esm_shims
} from "./chunk-DW4XVEE4.js";

// src/hooks/index.ts
init_esm_shims();

// src/hooks/useOas.ts
init_esm_shims();
import { useContext } from "@kubb/react";
function useOas() {
  const { oas } = useContext(Oas.Context);
  if (!oas) {
    throw new Error("Oas is not defined");
  }
  return oas;
}

// src/hooks/useOperation.ts
init_esm_shims();
import { useContext as useContext2 } from "@kubb/react";
function useOperation() {
  const { operation } = useContext2(Operation.Context);
  if (!operation) {
    throw new Error("Operation is not defined");
  }
  return operation;
}

// src/hooks/useOperationManager.ts
init_esm_shims();
import { useApp, useContext as useContext3 } from "@kubb/react";
function useOperationManager() {
  const { plugin, pluginManager } = useApp();
  const { generator } = useContext3(Oas.Context);
  if (!generator) {
    throw new Error(`'generator' is not defined`);
  }
  const getName = (operation, { pluginKey = plugin.key, type }) => {
    return pluginManager.resolveName({
      name: operation.getOperationId(),
      pluginKey,
      type
    });
  };
  const getFile = (operation, { pluginKey = plugin.key, extName = ".ts" } = {}) => {
    const tag = operation.getTags().at(0)?.name;
    const name = getName(operation, { type: "file", pluginKey });
    const file = pluginManager.getFile({
      name,
      extName,
      pluginKey,
      options: { type: "file", pluginKey, tag }
    });
    return {
      ...file,
      meta: {
        ...file.meta,
        name,
        pluginKey,
        tag
      }
    };
  };
  const groupSchemasByName = (operation, { pluginKey = plugin.key, type }) => {
    const schemas = generator.getSchemas(operation);
    const errors = (schemas.errors || []).reduce(
      (prev, acc) => {
        if (!acc.statusCode) {
          return prev;
        }
        prev[acc.statusCode] = pluginManager.resolveName({
          name: acc.name,
          pluginKey,
          type
        });
        return prev;
      },
      {}
    );
    return {
      request: schemas.request?.name ? pluginManager.resolveName({
        name: schemas.request.name,
        pluginKey,
        type
      }) : void 0,
      parameters: {
        path: schemas.pathParams?.name ? pluginManager.resolveName({
          name: schemas.pathParams.name,
          pluginKey,
          type
        }) : void 0,
        query: schemas.queryParams?.name ? pluginManager.resolveName({
          name: schemas.queryParams.name,
          pluginKey,
          type
        }) : void 0,
        header: schemas.headerParams?.name ? pluginManager.resolveName({
          name: schemas.headerParams.name,
          pluginKey,
          type
        }) : void 0
      },
      responses: {
        [schemas.response.statusCode || "default"]: pluginManager.resolveName({
          name: schemas.response.name,
          pluginKey,
          type
        }),
        ["default"]: pluginManager.resolveName({
          name: schemas.response.name,
          pluginKey,
          type
        }),
        ...errors
      },
      errors
    };
  };
  return {
    getName,
    getFile,
    getSchemas: (operation, params, forStatusCode) => generator.getSchemas(operation, {
      forStatusCode,
      resolveName: (name) => pluginManager.resolveName({
        name,
        pluginKey: params?.pluginKey,
        type: params?.type
      })
    }),
    groupSchemasByName
  };
}

// src/hooks/useOperations.ts
init_esm_shims();
import { useContext as useContext4 } from "@kubb/react";
function useOperations({ method, path } = {}) {
  const { operations } = useContext4(Oas.Context);
  if (!operations) {
    throw new Error("Operations is not defined");
  }
  let items = operations;
  if (path) {
    items = items.filter((item) => item.path === path);
  }
  if (method) {
    items = items.filter((item) => item.method === method);
  }
  return items;
}
export {
  useOas,
  useOperation,
  useOperationManager,
  useOperations,
  useSchema
};
//# sourceMappingURL=hooks.js.map