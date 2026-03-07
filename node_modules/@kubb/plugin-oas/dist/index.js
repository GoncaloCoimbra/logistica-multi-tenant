import {
  parseFromConfig
} from "./chunk-RFA6KMXR.js";
import {
  SchemaGenerator,
  isKeyword,
  schemaKeywords
} from "./chunk-IWUQTVK4.js";
import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet,
  getSchemas,
  init_esm_shims
} from "./chunk-DW4XVEE4.js";

// src/index.ts
init_esm_shims();

// src/plugin.ts
init_esm_shims();
import path from "node:path";
import { createPlugin } from "@kubb/core";
import { camelCase } from "@kubb/core/transformers";
var pluginOasName = "plugin-oas";
var pluginOas = createPlugin((options) => {
  const { output = { path: "schemas", export: false }, validate = true, serverIndex = 0, contentType, oasClass } = options;
  const getOas = async ({ config, logger }) => {
    try {
      const oas = await parseFromConfig(config, oasClass);
      if (validate) {
        await oas.valdiate();
      }
      return oas;
    } catch (e) {
      const error = e;
      logger.emit("warning", error?.message);
      return parseFromConfig(config, oasClass);
    }
  };
  return {
    name: pluginOasName,
    options,
    api() {
      const { config, logger } = this;
      return {
        getOas() {
          return getOas({ config, logger });
        },
        async getSchemas({ includes } = {}) {
          const oas = await this.getOas();
          return getSchemas({ oas, contentType, includes });
        },
        async getBaseURL() {
          const oasInstance = await this.getOas();
          const baseURL = oasInstance.api.servers?.at(serverIndex)?.url;
          return baseURL;
        },
        contentType
      };
    },
    resolvePath(baseName) {
      if (output === false) {
        return void 0;
      }
      const root = path.resolve(this.config.root, this.config.output.path);
      return path.resolve(root, output.path, baseName);
    },
    resolveName(name, type) {
      return camelCase(name, { isFile: type === "file" });
    },
    async writeFile(path2, source) {
      if (!path2.endsWith(".json") || !source) {
        return;
      }
      return this.fileManager.write(path2, source, { sanity: false });
    },
    async buildStart() {
      if (!output) {
        return;
      }
      const oas = await getOas({
        config: this.config,
        logger: this.logger
      });
      await oas.dereference();
      const schemas = getSchemas({ oas, contentType });
      const mapSchema = async ([name, schema]) => {
        const resolvedPath = this.resolvePath({
          baseName: `${name}.json`,
          pluginKey: this.plugin.key
        });
        const resvoledFileName = this.resolveName({
          name: `${name}.json`,
          pluginKey: [pluginOasName],
          type: "file"
        });
        if (!resolvedPath) {
          return;
        }
        await this.addFile({
          path: resolvedPath,
          baseName: resvoledFileName,
          source: JSON.stringify(schema),
          meta: {
            pluginKey: this.plugin.key
          }
        });
      };
      const promises = Object.entries(schemas).map(mapSchema);
      await Promise.all(promises);
    }
  };
});

// src/OperationGenerator.ts
init_esm_shims();
import { Generator } from "@kubb/core";
import transformers from "@kubb/core/transformers";
var _operationsByMethod, _OperationGenerator_instances, getOptions_fn, isExcluded_fn, isIncluded_fn, methods_get;
var OperationGenerator = class extends Generator {
  constructor() {
    super(...arguments);
    __privateAdd(this, _OperationGenerator_instances);
    __privateAdd(this, _operationsByMethod, {});
  }
  get operationsByMethod() {
    return __privateGet(this, _operationsByMethod);
  }
  set operationsByMethod(paths) {
    __privateSet(this, _operationsByMethod, paths);
  }
  getSchemas(operation, { forStatusCode, resolveName = (name) => name } = {}) {
    const pathParamsSchema = this.context.oas.getParametersSchema(operation, "path");
    const queryParamsSchema = this.context.oas.getParametersSchema(operation, "query");
    const headerParamsSchema = this.context.oas.getParametersSchema(operation, "header");
    const requestSchema = this.context.oas.getRequestSchema(operation);
    const responseStatusCode = forStatusCode || operation.schema.responses && Object.keys(operation.schema.responses).find((key) => key.startsWith("2")) || 200;
    const responseSchema = this.context.oas.getResponseSchema(operation, responseStatusCode);
    const statusCodes = operation.getResponseStatusCodes().map((statusCode) => {
      let name = statusCode;
      if (name === "default") {
        name = "error";
      }
      const schema = this.context.oas.getResponseSchema(operation, statusCode);
      return {
        name: resolveName(transformers.pascalCase(`${operation.getOperationId()} ${name}`)),
        description: operation.getResponseByStatusCode(statusCode)?.description,
        schema,
        operation,
        operationName: transformers.pascalCase(`${operation.getOperationId()}`),
        statusCode: name === "error" ? void 0 : Number(statusCode),
        keys: schema?.properties ? Object.keys(schema.properties) : void 0
      };
    });
    return {
      pathParams: pathParamsSchema ? {
        name: resolveName(transformers.pascalCase(`${operation.getOperationId()} PathParams`)),
        operation,
        operationName: transformers.pascalCase(`${operation.getOperationId()}`),
        schema: pathParamsSchema,
        keys: pathParamsSchema.properties ? Object.keys(pathParamsSchema.properties) : void 0
      } : void 0,
      queryParams: queryParamsSchema ? {
        name: resolveName(transformers.pascalCase(`${operation.getOperationId()} QueryParams`)),
        operation,
        operationName: transformers.pascalCase(`${operation.getOperationId()}`),
        schema: queryParamsSchema,
        keys: queryParamsSchema.properties ? Object.keys(queryParamsSchema.properties) : []
      } : void 0,
      headerParams: headerParamsSchema ? {
        name: resolveName(transformers.pascalCase(`${operation.getOperationId()} HeaderParams`)),
        operation,
        operationName: transformers.pascalCase(`${operation.getOperationId()}`),
        schema: headerParamsSchema,
        keys: headerParamsSchema.properties ? Object.keys(headerParamsSchema.properties) : void 0
      } : void 0,
      request: requestSchema ? {
        name: resolveName(transformers.pascalCase(`${operation.getOperationId()} ${operation.method === "get" ? "queryRequest" : "mutationRequest"}`)),
        description: operation.schema.requestBody?.description,
        operation,
        operationName: transformers.pascalCase(`${operation.getOperationId()}`),
        schema: requestSchema,
        keys: requestSchema.properties ? Object.keys(requestSchema.properties) : void 0,
        keysToOmit: requestSchema.properties ? Object.keys(requestSchema.properties).filter((key) => {
          const item = requestSchema.properties?.[key];
          return item?.readOnly;
        }) : void 0
      } : void 0,
      response: {
        name: resolveName(transformers.pascalCase(`${operation.getOperationId()} ${operation.method === "get" ? "queryResponse" : "mutationResponse"}`)),
        description: operation.getResponseAsJSONSchema(responseStatusCode)?.at(0)?.description,
        operation,
        operationName: transformers.pascalCase(`${operation.getOperationId()}`),
        schema: responseSchema,
        statusCode: Number(responseStatusCode),
        keys: responseSchema?.properties ? Object.keys(responseSchema.properties) : void 0,
        keysToOmit: responseSchema?.properties ? Object.keys(responseSchema.properties).filter((key) => {
          const item = responseSchema.properties?.[key];
          return item?.writeOnly;
        }) : void 0
      },
      errors: statusCodes.filter((item) => item.statusCode?.toString().startsWith("4") || item.statusCode?.toString().startsWith("5")),
      statusCodes
    };
  }
  async build() {
    const { oas } = this.context;
    const paths = oas.getPaths();
    this.operationsByMethod = Object.entries(paths).reduce((acc, [path2, method]) => {
      const methods = Object.keys(method);
      methods.forEach((method2) => {
        const operation = oas.operation(path2, method2);
        if (operation && __privateGet(this, _OperationGenerator_instances, methods_get)[method2]) {
          const isExcluded = __privateMethod(this, _OperationGenerator_instances, isExcluded_fn).call(this, operation, method2);
          const isIncluded = this.context.include ? __privateMethod(this, _OperationGenerator_instances, isIncluded_fn).call(this, operation, method2) : true;
          if (isIncluded && !isExcluded) {
            if (!acc[path2]) {
              acc[path2] = {};
            }
            acc[path2] = {
              ...acc[path2],
              [method2]: {
                operation,
                schemas: this.getSchemas(operation)
              }
            };
          }
        }
      });
      return acc;
    }, {});
    const promises = Object.keys(this.operationsByMethod).reduce((acc, path2) => {
      const methods = this.operationsByMethod[path2] ? Object.keys(this.operationsByMethod[path2]) : [];
      methods.forEach((method) => {
        const { operation } = this.operationsByMethod[path2]?.[method];
        const options = __privateMethod(this, _OperationGenerator_instances, getOptions_fn).call(this, operation, method);
        const promiseMethod = __privateGet(this, _OperationGenerator_instances, methods_get)[method]?.call(this, operation, {
          ...this.options,
          ...options
        });
        const promiseOperation = this.operation.call(this, operation, {
          ...this.options,
          ...options
        });
        if (promiseMethod) {
          acc.push(promiseMethod);
        }
        if (promiseOperation) {
          acc.push(promiseOperation);
        }
      });
      return acc;
    }, []);
    const operations = Object.values(this.operationsByMethod).map((item) => Object.values(item).map((item2) => item2.operation));
    promises.push(this.all(operations.flat().filter(Boolean), this.operationsByMethod));
    const files = await Promise.all(promises);
    return files.flat().filter(Boolean);
  }
  /**
   * Operation
   */
  async operation(operation, options) {
    return null;
  }
  /**
   * GET
   */
  async get(operation, options) {
    return null;
  }
  /**
   * POST
   */
  async post(operation, options) {
    return null;
  }
  /**
   * PATCH
   */
  async patch(operation, options) {
    return null;
  }
  /**
   * PUT
   */
  async put(operation, options) {
    return null;
  }
  /**
   * DELETE
   */
  async delete(operation, options) {
    return null;
  }
  /**
   * Combination of GET, POST, PATCH, PUT, DELETE
   */
  async all(operations, paths) {
    return null;
  }
};
_operationsByMethod = new WeakMap();
_OperationGenerator_instances = new WeakSet();
getOptions_fn = function(operation, method) {
  const { override = [] } = this.context;
  return override.find(({ pattern, type }) => {
    if (type === "tag") {
      return !!operation.getTags()[0]?.name.match(pattern);
    }
    if (type === "operationId") {
      return !!operation.getOperationId().match(pattern);
    }
    if (type === "path") {
      return !!operation.path.match(pattern);
    }
    if (type === "method") {
      return !!method.match(pattern);
    }
    return false;
  })?.options || {};
};
/**
 *
 * @deprecated
 */
isExcluded_fn = function(operation, method) {
  const { exclude = [] } = this.context;
  let matched = false;
  exclude.forEach(({ pattern, type }) => {
    if (type === "tag" && !matched) {
      matched = !!operation.getTags()[0]?.name.match(pattern);
    }
    if (type === "operationId" && !matched) {
      matched = !!operation.getOperationId().match(pattern);
    }
    if (type === "path" && !matched) {
      matched = !!operation.path.match(pattern);
    }
    if (type === "method" && !matched) {
      matched = !!method.match(pattern);
    }
  });
  return matched;
};
/**
 *
 * @deprecated
 */
isIncluded_fn = function(operation, method) {
  const { include = [] } = this.context;
  let matched = false;
  include.forEach(({ pattern, type }) => {
    if (type === "tag" && !matched) {
      matched = !!operation.getTags()[0]?.name.match(pattern);
    }
    if (type === "operationId" && !matched) {
      matched = !!operation.getOperationId().match(pattern);
    }
    if (type === "path" && !matched) {
      matched = !!operation.path.match(pattern);
    }
    if (type === "method" && !matched) {
      matched = !!method.match(pattern);
    }
  });
  return matched;
};
methods_get = function() {
  return {
    get: this.get,
    post: this.post,
    patch: this.patch,
    put: this.put,
    delete: this.delete,
    head: void 0,
    options: void 0,
    trace: void 0
  };
};

// src/index.ts
var definePluginDefault = pluginOas;
var src_default = definePluginDefault;
export {
  OperationGenerator,
  SchemaGenerator,
  src_default as default,
  isKeyword,
  pluginOas,
  pluginOasName,
  schemaKeywords
};
//# sourceMappingURL=index.js.map