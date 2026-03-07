import {
  init_esm_shims
} from "./chunk-DW4XVEE4.js";

// src/utils/parseFromConfig.ts
init_esm_shims();
import { resolve } from "node:path";
import { URLPath } from "@kubb/core/utils";
import { parse } from "@kubb/oas/parser";
import { Oas } from "@kubb/oas";
import yaml from "@stoplight/yaml";
function parseFromConfig(config, oasClass = Oas) {
  if ("data" in config.input) {
    if (typeof config.input.data === "object") {
      const api2 = JSON.parse(JSON.stringify(config.input.data));
      return parse(api2, oasClass);
    }
    try {
      const api2 = yaml.parse(config.input.data);
      return parse(api2, oasClass);
    } catch (e) {
    }
    const api = JSON.parse(JSON.stringify(config.input.data));
    return parse(api, oasClass);
  }
  if (new URLPath(config.input.path).isURL) {
    return parse(config.input.path, oasClass);
  }
  return parse(resolve(config.root, config.input.path), oasClass);
}

export {
  parseFromConfig
};
//# sourceMappingURL=chunk-RFA6KMXR.js.map