"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunk6I26SJV6cjs = require('./chunk-6I26SJV6.cjs');




var _chunkVSCBUJRScjs = require('./chunk-VSCBUJRS.cjs');







var _chunkH4D7FGDYcjs = require('./chunk-H4D7FGDY.cjs');

// src/index.ts
_chunkH4D7FGDYcjs.init_cjs_shims.call(void 0, );

// src/plugin.ts
_chunkH4D7FGDYcjs.init_cjs_shims.call(void 0, );
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _core = require('@kubb/core');
var _transformers = require('@kubb/core/transformers'); var _transformers2 = _interopRequireDefault(_transformers);
var pluginOasName = "plugin-oas";
var pluginOas = _core.createPlugin.call(void 0, (options) => {
  const { output = { path: "schemas", export: false }, validate = true, serverIndex = 0, contentType, oasClass } = options;
  const getOas = async ({ config, logger }) => {
    try {
      const oas = await _chunk6I26SJV6cjs.parseFromConfig.call(void 0, config, oasClass);
      if (validate) {
        await oas.valdiate();
      }
      return oas;
    } catch (e) {
      const error = e;
      logger.emit("warning", _optionalChain([error, 'optionalAccess', _ => _.message]));
      return _chunk6I26SJV6cjs.parseFromConfig.call(void 0, config, oasClass);
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
          return _chunkH4D7FGDYcjs.getSchemas.call(void 0, { oas, contentType, includes });
        },
        async getBaseURL() {
          const oasInstance = await this.getOas();
          const baseURL = _optionalChain([oasInstance, 'access', _2 => _2.api, 'access', _3 => _3.servers, 'optionalAccess', _4 => _4.at, 'call', _5 => _5(serverIndex), 'optionalAccess', _6 => _6.url]);
          return baseURL;
        },
        contentType
      };
    },
    resolvePath(baseName) {
      if (output === false) {
        return void 0;
      }
      const root = _path2.default.resolve(this.config.root, this.config.output.path);
      return _path2.default.resolve(root, output.path, baseName);
    },
    resolveName(name, type) {
      return _transformers.camelCase.call(void 0, name, { isFile: type === "file" });
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
      const schemas = _chunkH4D7FGDYcjs.getSchemas.call(void 0, { oas, contentType });
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
_chunkH4D7FGDYcjs.init_cjs_shims.call(void 0, );


var _operationsByMethod, _OperationGenerator_instances, getOptions_fn, isExcluded_fn, isIncluded_fn, methods_get;
var OperationGenerator = class extends _core.Generator {
  constructor() {
    super(...arguments);
    _chunkH4D7FGDYcjs.__privateAdd.call(void 0, this, _OperationGenerator_instances);
    _chunkH4D7FGDYcjs.__privateAdd.call(void 0, this, _operationsByMethod, {});
  }
  get operationsByMethod() {
    return _chunkH4D7FGDYcjs.__privateGet.call(void 0, this, _operationsByMethod);
  }
  set operationsByMethod(paths) {
    _chunkH4D7FGDYcjs.__privateSet.call(void 0, this, _operationsByMethod, paths);
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
        name: resolveName(_transformers2.default.pascalCase(`${operation.getOperationId()} ${name}`)),
        description: _optionalChain([operation, 'access', _7 => _7.getResponseByStatusCode, 'call', _8 => _8(statusCode), 'optionalAccess', _9 => _9.description]),
        schema,
        operation,
        operationName: _transformers2.default.pascalCase(`${operation.getOperationId()}`),
        statusCode: name === "error" ? void 0 : Number(statusCode),
        keys: _optionalChain([schema, 'optionalAccess', _10 => _10.properties]) ? Object.keys(schema.properties) : void 0
      };
    });
    return {
      pathParams: pathParamsSchema ? {
        name: resolveName(_transformers2.default.pascalCase(`${operation.getOperationId()} PathParams`)),
        operation,
        operationName: _transformers2.default.pascalCase(`${operation.getOperationId()}`),
        schema: pathParamsSchema,
        keys: pathParamsSchema.properties ? Object.keys(pathParamsSchema.properties) : void 0
      } : void 0,
      queryParams: queryParamsSchema ? {
        name: resolveName(_transformers2.default.pascalCase(`${operation.getOperationId()} QueryParams`)),
        operation,
        operationName: _transformers2.default.pascalCase(`${operation.getOperationId()}`),
        schema: queryParamsSchema,
        keys: queryParamsSchema.properties ? Object.keys(queryParamsSchema.properties) : []
      } : void 0,
      headerParams: headerParamsSchema ? {
        name: resolveName(_transformers2.default.pascalCase(`${operation.getOperationId()} HeaderParams`)),
        operation,
        operationName: _transformers2.default.pascalCase(`${operation.getOperationId()}`),
        schema: headerParamsSchema,
        keys: headerParamsSchema.properties ? Object.keys(headerParamsSchema.properties) : void 0
      } : void 0,
      request: requestSchema ? {
        name: resolveName(_transformers2.default.pascalCase(`${operation.getOperationId()} ${operation.method === "get" ? "queryRequest" : "mutationRequest"}`)),
        description: _optionalChain([operation, 'access', _11 => _11.schema, 'access', _12 => _12.requestBody, 'optionalAccess', _13 => _13.description]),
        operation,
        operationName: _transformers2.default.pascalCase(`${operation.getOperationId()}`),
        schema: requestSchema,
        keys: requestSchema.properties ? Object.keys(requestSchema.properties) : void 0,
        keysToOmit: requestSchema.properties ? Object.keys(requestSchema.properties).filter((key) => {
          const item = _optionalChain([requestSchema, 'access', _14 => _14.properties, 'optionalAccess', _15 => _15[key]]);
          return _optionalChain([item, 'optionalAccess', _16 => _16.readOnly]);
        }) : void 0
      } : void 0,
      response: {
        name: resolveName(_transformers2.default.pascalCase(`${operation.getOperationId()} ${operation.method === "get" ? "queryResponse" : "mutationResponse"}`)),
        description: _optionalChain([operation, 'access', _17 => _17.getResponseAsJSONSchema, 'call', _18 => _18(responseStatusCode), 'optionalAccess', _19 => _19.at, 'call', _20 => _20(0), 'optionalAccess', _21 => _21.description]),
        operation,
        operationName: _transformers2.default.pascalCase(`${operation.getOperationId()}`),
        schema: responseSchema,
        statusCode: Number(responseStatusCode),
        keys: _optionalChain([responseSchema, 'optionalAccess', _22 => _22.properties]) ? Object.keys(responseSchema.properties) : void 0,
        keysToOmit: _optionalChain([responseSchema, 'optionalAccess', _23 => _23.properties]) ? Object.keys(responseSchema.properties).filter((key) => {
          const item = _optionalChain([responseSchema, 'access', _24 => _24.properties, 'optionalAccess', _25 => _25[key]]);
          return _optionalChain([item, 'optionalAccess', _26 => _26.writeOnly]);
        }) : void 0
      },
      errors: statusCodes.filter((item) => _optionalChain([item, 'access', _27 => _27.statusCode, 'optionalAccess', _28 => _28.toString, 'call', _29 => _29(), 'access', _30 => _30.startsWith, 'call', _31 => _31("4")]) || _optionalChain([item, 'access', _32 => _32.statusCode, 'optionalAccess', _33 => _33.toString, 'call', _34 => _34(), 'access', _35 => _35.startsWith, 'call', _36 => _36("5")])),
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
        if (operation && _chunkH4D7FGDYcjs.__privateGet.call(void 0, this, _OperationGenerator_instances, methods_get)[method2]) {
          const isExcluded = _chunkH4D7FGDYcjs.__privateMethod.call(void 0, this, _OperationGenerator_instances, isExcluded_fn).call(this, operation, method2);
          const isIncluded = this.context.include ? _chunkH4D7FGDYcjs.__privateMethod.call(void 0, this, _OperationGenerator_instances, isIncluded_fn).call(this, operation, method2) : true;
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
        const { operation } = _optionalChain([this, 'access', _37 => _37.operationsByMethod, 'access', _38 => _38[path2], 'optionalAccess', _39 => _39[method]]);
        const options = _chunkH4D7FGDYcjs.__privateMethod.call(void 0, this, _OperationGenerator_instances, getOptions_fn).call(this, operation, method);
        const promiseMethod = _optionalChain([_chunkH4D7FGDYcjs.__privateGet.call(void 0, this, _OperationGenerator_instances, methods_get), 'access', _40 => _40[method], 'optionalAccess', _41 => _41.call, 'call', _42 => _42(this, operation, {
          ...this.options,
          ...options
        })]);
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
  return _optionalChain([override, 'access', _43 => _43.find, 'call', _44 => _44(({ pattern, type }) => {
    if (type === "tag") {
      return !!_optionalChain([operation, 'access', _45 => _45.getTags, 'call', _46 => _46(), 'access', _47 => _47[0], 'optionalAccess', _48 => _48.name, 'access', _49 => _49.match, 'call', _50 => _50(pattern)]);
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
  }), 'optionalAccess', _51 => _51.options]) || {};
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
      matched = !!_optionalChain([operation, 'access', _52 => _52.getTags, 'call', _53 => _53(), 'access', _54 => _54[0], 'optionalAccess', _55 => _55.name, 'access', _56 => _56.match, 'call', _57 => _57(pattern)]);
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
      matched = !!_optionalChain([operation, 'access', _58 => _58.getTags, 'call', _59 => _59(), 'access', _60 => _60[0], 'optionalAccess', _61 => _61.name, 'access', _62 => _62.match, 'call', _63 => _63(pattern)]);
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








exports.OperationGenerator = OperationGenerator; exports.SchemaGenerator = _chunkVSCBUJRScjs.SchemaGenerator; exports.default = src_default; exports.isKeyword = _chunkVSCBUJRScjs.isKeyword; exports.pluginOas = pluginOas; exports.pluginOasName = pluginOasName; exports.schemaKeywords = _chunkVSCBUJRScjs.schemaKeywords;
//# sourceMappingURL=index.cjs.map