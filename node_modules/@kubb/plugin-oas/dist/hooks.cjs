"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }



var _chunkKMF5VE6Jcjs = require('./chunk-KMF5VE6J.cjs');
require('./chunk-VSCBUJRS.cjs');


var _chunkH4D7FGDYcjs = require('./chunk-H4D7FGDY.cjs');

// src/hooks/index.ts
_chunkH4D7FGDYcjs.init_cjs_shims.call(void 0, );

// src/hooks/useOas.ts
_chunkH4D7FGDYcjs.init_cjs_shims.call(void 0, );
var _react = require('@kubb/react');
function useOas() {
  const { oas } = _react.useContext.call(void 0, _chunkKMF5VE6Jcjs.Oas.Context);
  if (!oas) {
    throw new Error("Oas is not defined");
  }
  return oas;
}

// src/hooks/useOperation.ts
_chunkH4D7FGDYcjs.init_cjs_shims.call(void 0, );

function useOperation() {
  const { operation } = _react.useContext.call(void 0, _chunkKMF5VE6Jcjs.Operation.Context);
  if (!operation) {
    throw new Error("Operation is not defined");
  }
  return operation;
}

// src/hooks/useOperationManager.ts
_chunkH4D7FGDYcjs.init_cjs_shims.call(void 0, );

function useOperationManager() {
  const { plugin, pluginManager } = _react.useApp.call(void 0, );
  const { generator } = _react.useContext.call(void 0, _chunkKMF5VE6Jcjs.Oas.Context);
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
    const tag = _optionalChain([operation, 'access', _ => _.getTags, 'call', _2 => _2(), 'access', _3 => _3.at, 'call', _4 => _4(0), 'optionalAccess', _5 => _5.name]);
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
      request: _optionalChain([schemas, 'access', _6 => _6.request, 'optionalAccess', _7 => _7.name]) ? pluginManager.resolveName({
        name: schemas.request.name,
        pluginKey,
        type
      }) : void 0,
      parameters: {
        path: _optionalChain([schemas, 'access', _8 => _8.pathParams, 'optionalAccess', _9 => _9.name]) ? pluginManager.resolveName({
          name: schemas.pathParams.name,
          pluginKey,
          type
        }) : void 0,
        query: _optionalChain([schemas, 'access', _10 => _10.queryParams, 'optionalAccess', _11 => _11.name]) ? pluginManager.resolveName({
          name: schemas.queryParams.name,
          pluginKey,
          type
        }) : void 0,
        header: _optionalChain([schemas, 'access', _12 => _12.headerParams, 'optionalAccess', _13 => _13.name]) ? pluginManager.resolveName({
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
        pluginKey: _optionalChain([params, 'optionalAccess', _14 => _14.pluginKey]),
        type: _optionalChain([params, 'optionalAccess', _15 => _15.type])
      })
    }),
    groupSchemasByName
  };
}

// src/hooks/useOperations.ts
_chunkH4D7FGDYcjs.init_cjs_shims.call(void 0, );

function useOperations({ method, path } = {}) {
  const { operations } = _react.useContext.call(void 0, _chunkKMF5VE6Jcjs.Oas.Context);
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






exports.useOas = useOas; exports.useOperation = useOperation; exports.useOperationManager = useOperationManager; exports.useOperations = useOperations; exports.useSchema = _chunkKMF5VE6Jcjs.useSchema;
//# sourceMappingURL=hooks.cjs.map