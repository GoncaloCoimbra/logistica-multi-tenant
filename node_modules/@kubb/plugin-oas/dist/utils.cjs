"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunk6I26SJV6cjs = require('./chunk-6I26SJV6.cjs');




var _chunkH4D7FGDYcjs = require('./chunk-H4D7FGDY.cjs');

// src/utils/index.ts
_chunkH4D7FGDYcjs.init_cjs_shims.call(void 0, );

// src/utils/getComments.ts
_chunkH4D7FGDYcjs.init_cjs_shims.call(void 0, );
var _transformers = require('@kubb/core/transformers'); var _transformers2 = _interopRequireDefault(_transformers);
var _utils = require('@kubb/core/utils');
function getComments(operation) {
  return [
    operation.getDescription() && `@description ${operation.getDescription()}`,
    operation.getSummary() && `@summary ${operation.getSummary()}`,
    operation.path && `@link ${new (0, _utils.URLPath)(operation.path).URL}`,
    operation.isDeprecated() && "@deprecated"
  ].filter(Boolean).map((text) => _transformers2.default.trim(text));
}

// src/utils/getGroupedByTagFiles.ts
_chunkH4D7FGDYcjs.init_cjs_shims.call(void 0, );
var _path = require('path');
var _core = require('@kubb/core');


var _fs = require('@kubb/fs');
async function getGroupedByTagFiles({ logger, files, plugin, template, exportAs, root, output }) {
  const { path, exportType = "barrel" } = output;
  const mode = _core.FileManager.getMode(_path.resolve.call(void 0, root, path));
  if (mode === "single" || exportType === false) {
    return [];
  }
  return files.filter((file) => {
    const name = _optionalChain([file, 'access', _ => _.meta, 'optionalAccess', _2 => _2.pluginKey, 'optionalAccess', _3 => _3[0]]);
    return name === plugin.name;
  }).map((file) => {
    if (!_optionalChain([file, 'access', _4 => _4.meta, 'optionalAccess', _5 => _5.tag])) {
      _optionalChain([logger, 'optionalAccess', _6 => _6.emit, 'call', _7 => _7("debug", [`Could not find a tagName for ${JSON.stringify(file, void 0, 2)}`])]);
      return;
    }
    const tag = _optionalChain([file, 'access', _8 => _8.meta, 'optionalAccess', _9 => _9.tag]) && _transformers2.default.camelCase(file.meta.tag);
    const tagPath = _fs.getRelativePath.call(void 0, _path.resolve.call(void 0, root, output.path), _path.resolve.call(void 0, root, _utils.renderTemplate.call(void 0, template, { tag })));
    const tagName = _utils.renderTemplate.call(void 0, exportAs, { tag });
    if (tagName) {
      return {
        baseName: "index.ts",
        path: _path.resolve.call(void 0, root, output.path, "index.ts"),
        source: "",
        exports: [
          {
            path: output.extName ? `${tagPath}/index${output.extName}` : `${tagPath}/index`,
            asAlias: true,
            name: tagName
          }
        ],
        meta: {
          pluginKey: plugin.key
        },
        exportable: true
      };
    }
  }).filter(Boolean);
}

// src/utils/getParams.ts
_chunkH4D7FGDYcjs.init_cjs_shims.call(void 0, );
var _oas = require('@kubb/oas');

function getASTParams(operationSchema, {
  typed = false,
  override
} = {}) {
  if (!operationSchema || !operationSchema.schema.properties || !operationSchema.name) {
    return [];
  }
  return Object.entries(operationSchema.schema.properties).map(([name, schema]) => {
    const isParam = _oas.isParameterObject.call(void 0, schema);
    const data = {
      name,
      enabled: !!name,
      required: isParam ? schema.required : true,
      type: typed ? `${operationSchema.name}["${name}"]` : void 0
    };
    return override ? override(data) : data;
  });
}
function getPathParams(operationSchema, options = {}) {
  return getASTParams(operationSchema, options).reduce((acc, curr) => {
    if (curr.name && curr.enabled) {
      acc[_transformers.camelCase.call(void 0, curr.name)] = {
        default: curr.default,
        type: curr.type,
        optional: !curr.required
      };
    }
    return acc;
  }, {});
}

// src/utils/refSorter.ts
_chunkH4D7FGDYcjs.init_cjs_shims.call(void 0, );
function refsSorter(a, b) {
  if (_optionalChain([Object, 'access', _10 => _10.keys, 'call', _11 => _11(a.import.refs), 'optionalAccess', _12 => _12.length]) < _optionalChain([Object, 'access', _13 => _13.keys, 'call', _14 => _14(b.import.refs), 'optionalAccess', _15 => _15.length])) {
    return -1;
  }
  if (_optionalChain([Object, 'access', _16 => _16.keys, 'call', _17 => _17(a.import.refs), 'optionalAccess', _18 => _18.length]) > _optionalChain([Object, 'access', _19 => _19.keys, 'call', _20 => _20(b.import.refs), 'optionalAccess', _21 => _21.length])) {
    return 1;
  }
  return 0;
}









exports.getASTParams = getASTParams; exports.getComments = getComments; exports.getGroupedByTagFiles = getGroupedByTagFiles; exports.getPathParams = getPathParams; exports.getSchemaFactory = _chunkH4D7FGDYcjs.getSchemaFactory; exports.getSchemas = _chunkH4D7FGDYcjs.getSchemas; exports.parseFromConfig = _chunk6I26SJV6cjs.parseFromConfig; exports.refsSorter = refsSorter;
//# sourceMappingURL=utils.cjs.map