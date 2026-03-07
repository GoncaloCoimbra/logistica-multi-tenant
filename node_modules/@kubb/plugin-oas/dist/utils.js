import {
  parseFromConfig
} from "./chunk-RFA6KMXR.js";
import {
  getSchemaFactory,
  getSchemas,
  init_esm_shims
} from "./chunk-DW4XVEE4.js";

// src/utils/index.ts
init_esm_shims();

// src/utils/getComments.ts
init_esm_shims();
import transformers from "@kubb/core/transformers";
import { URLPath } from "@kubb/core/utils";
function getComments(operation) {
  return [
    operation.getDescription() && `@description ${operation.getDescription()}`,
    operation.getSummary() && `@summary ${operation.getSummary()}`,
    operation.path && `@link ${new URLPath(operation.path).URL}`,
    operation.isDeprecated() && "@deprecated"
  ].filter(Boolean).map((text) => transformers.trim(text));
}

// src/utils/getGroupedByTagFiles.ts
init_esm_shims();
import { resolve } from "node:path";
import { FileManager } from "@kubb/core";
import transformers2 from "@kubb/core/transformers";
import { renderTemplate } from "@kubb/core/utils";
import { getRelativePath } from "@kubb/fs";
async function getGroupedByTagFiles({ logger, files, plugin, template, exportAs, root, output }) {
  const { path, exportType = "barrel" } = output;
  const mode = FileManager.getMode(resolve(root, path));
  if (mode === "single" || exportType === false) {
    return [];
  }
  return files.filter((file) => {
    const name = file.meta?.pluginKey?.[0];
    return name === plugin.name;
  }).map((file) => {
    if (!file.meta?.tag) {
      logger?.emit("debug", [`Could not find a tagName for ${JSON.stringify(file, void 0, 2)}`]);
      return;
    }
    const tag = file.meta?.tag && transformers2.camelCase(file.meta.tag);
    const tagPath = getRelativePath(resolve(root, output.path), resolve(root, renderTemplate(template, { tag })));
    const tagName = renderTemplate(exportAs, { tag });
    if (tagName) {
      return {
        baseName: "index.ts",
        path: resolve(root, output.path, "index.ts"),
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
init_esm_shims();
import { isParameterObject } from "@kubb/oas";
import { camelCase } from "@kubb/core/transformers";
function getASTParams(operationSchema, {
  typed = false,
  override
} = {}) {
  if (!operationSchema || !operationSchema.schema.properties || !operationSchema.name) {
    return [];
  }
  return Object.entries(operationSchema.schema.properties).map(([name, schema]) => {
    const isParam = isParameterObject(schema);
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
      acc[camelCase(curr.name)] = {
        default: curr.default,
        type: curr.type,
        optional: !curr.required
      };
    }
    return acc;
  }, {});
}

// src/utils/refSorter.ts
init_esm_shims();
function refsSorter(a, b) {
  if (Object.keys(a.import.refs)?.length < Object.keys(b.import.refs)?.length) {
    return -1;
  }
  if (Object.keys(a.import.refs)?.length > Object.keys(b.import.refs)?.length) {
    return 1;
  }
  return 0;
}
export {
  getASTParams,
  getComments,
  getGroupedByTagFiles,
  getPathParams,
  getSchemaFactory,
  getSchemas,
  parseFromConfig,
  refsSorter
};
//# sourceMappingURL=utils.js.map