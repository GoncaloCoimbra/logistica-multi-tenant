"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _chunkH4D7FGDYcjs = require('./chunk-H4D7FGDY.cjs');

// src/utils/parseFromConfig.ts
_chunkH4D7FGDYcjs.init_cjs_shims.call(void 0, );
var _path = require('path');
var _utils = require('@kubb/core/utils');
var _parser = require('@kubb/oas/parser');
var _oas = require('@kubb/oas');
var _yaml = require('@stoplight/yaml'); var _yaml2 = _interopRequireDefault(_yaml);
function parseFromConfig(config, oasClass = _oas.Oas) {
  if ("data" in config.input) {
    if (typeof config.input.data === "object") {
      const api2 = JSON.parse(JSON.stringify(config.input.data));
      return _parser.parse.call(void 0, api2, oasClass);
    }
    try {
      const api2 = _yaml2.default.parse(config.input.data);
      return _parser.parse.call(void 0, api2, oasClass);
    } catch (e) {
    }
    const api = JSON.parse(JSON.stringify(config.input.data));
    return _parser.parse.call(void 0, api, oasClass);
  }
  if (new (0, _utils.URLPath)(config.input.path).isURL) {
    return _parser.parse.call(void 0, config.input.path, oasClass);
  }
  return _parser.parse.call(void 0, _path.resolve.call(void 0, config.root, config.input.path), oasClass);
}



exports.parseFromConfig = parseFromConfig;
//# sourceMappingURL=chunk-6I26SJV6.cjs.map