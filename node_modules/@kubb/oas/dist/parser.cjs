"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


var _chunkATRCKZ2Kcjs = require('./chunk-ATRCKZ2K.cjs');

// src/parser/index.ts
var _openapicore = require('@redocly/openapi-core');
var _oasnormalize = require('oas-normalize'); var _oasnormalize2 = _interopRequireDefault(_oasnormalize);
var _swagger2openapi = require('swagger2openapi'); var _swagger2openapi2 = _interopRequireDefault(_swagger2openapi);
async function parse(pathOrApi, oasClass = _chunkATRCKZ2Kcjs.Oas) {
  if (typeof pathOrApi === "string") {
    const config = await _openapicore.loadConfig.call(void 0, );
    const bundleResults = await _openapicore.bundle.call(void 0, { ref: pathOrApi, config, base: pathOrApi });
    return parse(bundleResults.bundle.parsed);
  }
  const oasNormalize = new (0, _oasnormalize2.default)(pathOrApi, {
    enablePaths: true,
    colorizeErrors: true
  });
  const document = await oasNormalize.load();
  if (_chunkATRCKZ2Kcjs.isOpenApiV2Document.call(void 0, document)) {
    const { openapi } = await _swagger2openapi2.default.convertObj(document, {
      anchors: true
    });
    return new oasClass({ oas: openapi });
  }
  return new oasClass({ oas: document });
}


exports.parse = parse;
//# sourceMappingURL=parser.cjs.map