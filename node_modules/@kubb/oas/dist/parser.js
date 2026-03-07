import {
  Oas,
  isOpenApiV2Document
} from "./chunk-HGPATTCE.js";

// src/parser/index.ts
import { bundle, loadConfig } from "@redocly/openapi-core";
import OASNormalize from "oas-normalize";
import swagger2openapi from "swagger2openapi";
async function parse(pathOrApi, oasClass = Oas) {
  if (typeof pathOrApi === "string") {
    const config = await loadConfig();
    const bundleResults = await bundle({ ref: pathOrApi, config, base: pathOrApi });
    return parse(bundleResults.bundle.parsed);
  }
  const oasNormalize = new OASNormalize(pathOrApi, {
    enablePaths: true,
    colorizeErrors: true
  });
  const document = await oasNormalize.load();
  if (isOpenApiV2Document(document)) {
    const { openapi } = await swagger2openapi.convertObj(document, {
      anchors: true
    });
    return new oasClass({ oas: openapi });
  }
  return new oasClass({ oas: document });
}
export {
  parse
};
//# sourceMappingURL=parser.js.map