import {
  searchAndReplace,
  transformers_default,
  trimExtName
} from "./chunk-OZKPV7RD.js";
import {
  getParser
} from "./chunk-5JZNFPUP.js";
import {
  orderBy
} from "./chunk-4X5FFJPJ.js";
import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet
} from "./chunk-HMLY7DHA.js";

// src/FileManager.ts
import crypto from "node:crypto";
import { extname, resolve } from "node:path";
import PQueue from "p-queue";
import { isDeepEqual } from "remeda";
import { getRelativePath, read, write } from "@kubb/fs";

// src/BarrelManager.ts
import { getExports } from "@kubb/parser-ts";
import path from "node:path";

// src/utils/TreeNode.ts
import dirTree from "directory-tree";
var TreeNode = class _TreeNode {
  constructor(data, parent) {
    this.children = [];
    this.data = data;
    this.parent = parent;
    return this;
  }
  addChild(data) {
    const child = new _TreeNode(data, this);
    if (!this.children) {
      this.children = [];
    }
    this.children.push(child);
    return child;
  }
  find(data) {
    if (!data) {
      return null;
    }
    if (data === this.data) {
      return this;
    }
    if (this.children?.length) {
      for (let i = 0, { length } = this.children, target = null; i < length; i++) {
        target = this.children[i].find(data);
        if (target) {
          return target;
        }
      }
    }
    return null;
  }
  get leaves() {
    if (!this.children || this.children.length === 0) {
      return [this];
    }
    const leaves = [];
    if (this.children) {
      for (let i = 0, { length } = this.children; i < length; i++) {
        leaves.push.apply(leaves, this.children[i].leaves);
      }
    }
    return leaves;
  }
  get root() {
    if (!this.parent) {
      return this;
    }
    return this.parent.root;
  }
  forEach(callback) {
    if (typeof callback !== "function") {
      throw new TypeError("forEach() callback must be a function");
    }
    callback(this);
    if (this.children) {
      for (let i = 0, { length } = this.children; i < length; i++) {
        this.children[i]?.forEach(callback);
      }
    }
    return this;
  }
  static build(path2, options = {}) {
    try {
      const exclude = Array.isArray(options.exclude) ? options.exclude : [options.exclude].filter(Boolean);
      const filteredTree = dirTree(path2, {
        extensions: options.extensions,
        exclude: [/node_modules/, ...exclude]
      });
      if (!filteredTree) {
        return null;
      }
      const treeNode = new _TreeNode({
        name: filteredTree.name,
        path: filteredTree.path,
        type: FileManager.getMode(filteredTree.path)
      });
      const recurse = (node, item) => {
        const subNode = node.addChild({
          name: item.name,
          path: item.path,
          type: FileManager.getMode(item.path)
        });
        if (item.children?.length) {
          item.children?.forEach((child) => {
            recurse(subNode, child);
          });
        }
      };
      filteredTree.children?.forEach((child) => recurse(treeNode, child));
      return treeNode;
    } catch (e) {
      throw new Error("Something went wrong with creating index files with the TreehNode class", { cause: e });
    }
  }
};

// src/BarrelManager.ts
var _options;
var BarrelManager = class {
  constructor(options = {}) {
    __privateAdd(this, _options);
    __privateSet(this, _options, options);
    return this;
  }
  getNamedExport(root, item) {
    const exportedNames = getExports(path.resolve(root, item.path));
    if (!exportedNames) {
      return [item];
    }
    return exportedNames.reduce(
      (prev, curr) => {
        if (!prev[0]?.name || !prev[1]?.name) {
          return prev;
        }
        if (curr.isTypeOnly) {
          prev[1] = { ...prev[1], name: [...prev[1].name, curr.name] };
        } else {
          prev[0] = { ...prev[0], name: [...prev[0].name, curr.name] };
        }
        return prev;
      },
      [
        {
          ...item,
          name: [],
          isTypeOnly: false
        },
        {
          ...item,
          name: [],
          isTypeOnly: true
        }
      ]
    );
  }
  getNamedExports(root, exports) {
    return exports?.flatMap((item) => {
      return this.getNamedExport(root, item);
    });
  }
  getIndexes(root) {
    const { treeNode = {}, isTypeOnly, extName } = __privateGet(this, _options);
    const tree = TreeNode.build(root, treeNode);
    if (!tree) {
      return null;
    }
    const fileReducer = (files, treeNode2) => {
      if (!treeNode2.children) {
        return [];
      }
      if (treeNode2.children.length > 1) {
        const indexPath = path.resolve(treeNode2.data.path, "index.ts");
        const exports = treeNode2.children.filter(Boolean).map((file) => {
          const importPath = file.data.type === "split" ? `./${file.data.name}/index` : `./${trimExtName(file.data.name)}`;
          if (importPath.endsWith("index") && file.data.type === "single") {
            return void 0;
          }
          return {
            path: extName ? `${importPath}${extName}` : importPath,
            isTypeOnly
          };
        }).filter(Boolean);
        files.push({
          path: indexPath,
          baseName: "index.ts",
          source: "",
          exports,
          exportable: true
        });
      } else if (treeNode2.children.length === 1) {
        const [treeNodeChild] = treeNode2.children;
        const indexPath = path.resolve(treeNode2.data.path, "index.ts");
        const importPath = treeNodeChild.data.type === "split" ? `./${treeNodeChild.data.name}/index` : `./${trimExtName(treeNodeChild.data.name)}`;
        const exports = [
          {
            path: extName ? `${importPath}${extName}` : importPath,
            isTypeOnly
          }
        ];
        files.push({
          path: indexPath,
          baseName: "index.ts",
          source: "",
          exports,
          exportable: true
        });
      }
      treeNode2.children.forEach((childItem) => {
        fileReducer(files, childItem);
      });
      return files;
    };
    return fileReducer([], tree).reverse();
  }
};
_options = new WeakMap();

// src/FileManager.ts
var _cache, _task, _queue, _FileManager_instances, add_fn, addOrAppend_fn;
var _FileManager = class _FileManager {
  constructor({ task = async (file) => file, queue = new PQueue() } = {}) {
    __privateAdd(this, _FileManager_instances);
    __privateAdd(this, _cache, /* @__PURE__ */ new Map());
    __privateAdd(this, _task);
    __privateAdd(this, _queue);
    __privateSet(this, _task, task);
    __privateSet(this, _queue, queue);
    return this;
  }
  get files() {
    const files = [];
    __privateGet(this, _cache).forEach((item) => {
      files.push(...item.flat(1));
    });
    return files;
  }
  get isExecuting() {
    return __privateGet(this, _queue).size !== 0 && __privateGet(this, _queue).pending !== 0;
  }
  async add(...files) {
    const promises = combineFiles(files).map((file) => {
      if (file.override) {
        return __privateMethod(this, _FileManager_instances, add_fn).call(this, file);
      }
      return __privateMethod(this, _FileManager_instances, addOrAppend_fn).call(this, file);
    });
    const resolvedFiles = await Promise.all(promises);
    if (files.length > 1) {
      return resolvedFiles;
    }
    return resolvedFiles[0];
  }
  async addIndexes({ root, output, meta, logger, options = {} }) {
    const { exportType = "barrel" } = output;
    if (exportType === false) {
      return void 0;
    }
    const pathToBuildFrom = resolve(root, output.path);
    if (transformers_default.trimExtName(pathToBuildFrom).endsWith("index")) {
      logger.emit("warning", "Output has the same fileName as the barrelFiles, please disable barrel generation");
      return;
    }
    const exportPath = output.path.startsWith("./") ? trimExtName(output.path) : `./${trimExtName(output.path)}`;
    const mode = _FileManager.getMode(output.path);
    const barrelManager = new BarrelManager({
      extName: output.extName,
      ...options
    });
    let files = barrelManager.getIndexes(pathToBuildFrom);
    if (!files) {
      return void 0;
    }
    if (exportType === "barrelNamed") {
      files = files.map((file) => {
        if (file.exports) {
          return {
            ...file,
            exports: barrelManager.getNamedExports(pathToBuildFrom, file.exports)
          };
        }
        return file;
      });
    }
    await Promise.all(
      files.map((file) => {
        return __privateMethod(this, _FileManager_instances, addOrAppend_fn).call(this, {
          ...file,
          meta: meta ? meta : file.meta
        });
      })
    );
    const rootPath = mode === "split" ? `${exportPath}/index${output.extName || ""}` : `${exportPath}${output.extName || ""}`;
    const rootFile = {
      path: resolve(root, "index.ts"),
      baseName: "index.ts",
      source: "",
      exports: [
        output.exportAs ? {
          name: output.exportAs,
          asAlias: true,
          path: rootPath,
          isTypeOnly: options.isTypeOnly
        } : {
          path: rootPath,
          isTypeOnly: options.isTypeOnly
        }
      ],
      exportable: true
    };
    if (exportType === "barrelNamed" && !output.exportAs && rootFile.exports?.[0]) {
      rootFile.exports = barrelManager.getNamedExport(root, rootFile.exports[0]);
    }
    await __privateMethod(this, _FileManager_instances, addOrAppend_fn).call(this, {
      ...rootFile,
      meta: meta ? meta : rootFile.meta
    });
  }
  getCacheByUUID(UUID) {
    let cache;
    __privateGet(this, _cache).forEach((files) => {
      cache = files.find((item) => item.id === UUID);
    });
    return cache;
  }
  get(path2) {
    return __privateGet(this, _cache).get(path2);
  }
  remove(path2) {
    const cacheItem = this.get(path2);
    if (!cacheItem) {
      return;
    }
    __privateGet(this, _cache).delete(path2);
  }
  async write(...params) {
    return write(...params);
  }
  async read(...params) {
    return read(...params);
  }
  // statics
  static async getSource(file) {
    return getSource(file);
  }
  static combineFiles(files) {
    return combineFiles(files);
  }
  static getMode(path2) {
    if (!path2) {
      return "split";
    }
    return extname(path2) ? "single" : "split";
  }
  static get extensions() {
    return [".js", ".ts", ".tsx"];
  }
  static isJavascript(baseName) {
    return _FileManager.extensions.some((extension) => baseName.endsWith(extension));
  }
};
_cache = new WeakMap();
_task = new WeakMap();
_queue = new WeakMap();
_FileManager_instances = new WeakSet();
add_fn = async function(file) {
  const controller = new AbortController();
  const resolvedFile = {
    id: crypto.randomUUID(),
    name: trimExtName(file.baseName),
    ...file
  };
  if (resolvedFile.exports?.length) {
    const folder = resolvedFile.path.replace(resolvedFile.baseName, "");
    resolvedFile.exports = resolvedFile.exports.filter((exportItem) => {
      const exportedFile = this.files.find((file2) => file2.path.includes(resolve(folder, exportItem.path)));
      if (exportedFile) {
        return exportedFile.exportable;
      }
      return true;
    });
  }
  __privateGet(this, _cache).set(resolvedFile.path, [{ cancel: () => controller.abort(), ...resolvedFile }]);
  return __privateGet(this, _queue).add(
    async () => {
      var _a;
      return (_a = __privateGet(this, _task)) == null ? void 0 : _a.call(this, resolvedFile);
    },
    { signal: controller.signal }
  );
};
addOrAppend_fn = async function(file) {
  const previousCaches = __privateGet(this, _cache).get(file.path);
  const previousCache = previousCaches ? previousCaches.at(previousCaches.length - 1) : void 0;
  if (previousCache) {
    __privateGet(this, _cache).delete(previousCache.path);
    return __privateMethod(this, _FileManager_instances, add_fn).call(this, {
      ...file,
      source: previousCache.source && file.source ? `${previousCache.source}
${file.source}` : "",
      imports: [...previousCache.imports || [], ...file.imports || []],
      exports: [...previousCache.exports || [], ...file.exports || []],
      env: { ...previousCache.env || {}, ...file.env || {} }
    });
  }
  return __privateMethod(this, _FileManager_instances, add_fn).call(this, file);
};
var FileManager = _FileManager;
function combineFiles(files) {
  return files.filter(Boolean).reduce(
    (acc, file) => {
      const prevIndex = acc.findIndex((item) => item.path === file.path);
      if (prevIndex === -1) {
        return [...acc, file];
      }
      const prev = acc[prevIndex];
      if (prev && file.override) {
        acc[prevIndex] = {
          imports: [],
          exports: [],
          ...file
        };
        return acc;
      }
      if (prev) {
        acc[prevIndex] = {
          ...file,
          source: prev.source && file.source ? `${prev.source}
${file.source}` : "",
          imports: [...prev.imports || [], ...file.imports || []],
          exports: [...prev.exports || [], ...file.exports || []],
          env: { ...prev.env || {}, ...file.env || {} }
        };
      }
      return acc;
    },
    []
  );
}
async function getSource(file) {
  if (file.language ? !["typescript", "javascript"].includes(file.language) : !FileManager.isJavascript(file.baseName)) {
    return file.source;
  }
  const parser = await getParser(file.language);
  const exports = file.exports ? combineExports(file.exports) : [];
  const imports = file.imports && file.source ? combineImports(file.imports, exports, file.source) : [];
  const importNodes = imports.filter((item) => {
    const path2 = item.root ? getRelativePath(item.root, item.path) : item.path;
    return path2 !== trimExtName(file.path);
  }).map((item) => {
    const path2 = item.root ? getRelativePath(item.root, item.path) : item.path;
    return parser.factory.createImportDeclaration({
      name: item.name,
      path: item.extName ? `${path2}${item.extName}` : path2,
      isTypeOnly: item.isTypeOnly
    });
  });
  const exportNodes = exports.map(
    (item) => parser.factory.createExportDeclaration({
      name: item.name,
      path: item.extName ? `${item.path}${item.extName}` : item.path,
      isTypeOnly: item.isTypeOnly,
      asAlias: item.asAlias
    })
  );
  const source = [parser.print([...importNodes, ...exportNodes]), getEnvSource(file.source, file.env)].join("\n");
  return parser.print([], { source, noEmitHelpers: false });
}
function combineExports(exports) {
  const combinedExports = orderBy(exports, [(v) => !v.isTypeOnly], ["asc"]).reduce(
    (prev, curr) => {
      const name = curr.name;
      const prevByPath = prev.findLast((imp) => imp.path === curr.path);
      const prevByPathAndIsTypeOnly = prev.findLast((imp) => imp.path === curr.path && isDeepEqual(imp.name, name) && imp.isTypeOnly);
      if (prevByPathAndIsTypeOnly) {
        return prev;
      }
      const uniquePrev = prev.findLast(
        (imp) => imp.path === curr.path && isDeepEqual(imp.name, name) && imp.isTypeOnly === curr.isTypeOnly && imp.asAlias === curr.asAlias
      );
      if (uniquePrev || Array.isArray(name) && !name.length || prevByPath?.asAlias && !curr.asAlias) {
        return prev;
      }
      if (!prevByPath) {
        return [
          ...prev,
          {
            ...curr,
            name: Array.isArray(name) ? [...new Set(name)] : name
          }
        ];
      }
      if (prevByPath && Array.isArray(prevByPath.name) && Array.isArray(curr.name) && prevByPath.isTypeOnly === curr.isTypeOnly) {
        prevByPath.name = [.../* @__PURE__ */ new Set([...prevByPath.name, ...curr.name])];
        return prev;
      }
      return [...prev, curr];
    },
    []
  );
  return orderBy(combinedExports, [(v) => !v.isTypeOnly, (v) => v.asAlias], ["desc", "desc"]);
}
function combineImports(imports, exports, source) {
  const combinedImports = orderBy(imports, [(v) => !v.isTypeOnly], ["asc"]).reduce(
    (prev, curr) => {
      let name = Array.isArray(curr.name) ? [...new Set(curr.name)] : curr.name;
      const hasImportInSource = (importName) => {
        if (!source) {
          return true;
        }
        const checker = (name2) => name2 && !!source.includes(name2);
        return checker(importName) || exports.some(({ name: name2 }) => Array.isArray(name2) ? name2.some(checker) : checker(name2));
      };
      if (curr.path === curr.root) {
        return prev;
      }
      if (Array.isArray(name)) {
        name = name.filter((item) => typeof item === "string" ? hasImportInSource(item) : hasImportInSource(item.propertyName));
      }
      const prevByPath = prev.findLast((imp) => imp.path === curr.path && imp.isTypeOnly === curr.isTypeOnly);
      const uniquePrev = prev.findLast((imp) => imp.path === curr.path && isDeepEqual(imp.name, name) && imp.isTypeOnly === curr.isTypeOnly);
      const prevByPathNameAndIsTypeOnly = prev.findLast((imp) => imp.path === curr.path && isDeepEqual(imp.name, name) && imp.isTypeOnly);
      if (prevByPathNameAndIsTypeOnly) {
        return prev;
      }
      if (uniquePrev || Array.isArray(name) && !name.length) {
        return prev;
      }
      if (!prevByPath) {
        return [
          ...prev,
          {
            ...curr,
            name
          }
        ];
      }
      if (prevByPath && Array.isArray(prevByPath.name) && Array.isArray(name) && prevByPath.isTypeOnly === curr.isTypeOnly) {
        prevByPath.name = [.../* @__PURE__ */ new Set([...prevByPath.name, ...name])];
        return prev;
      }
      if (!Array.isArray(name) && name && !hasImportInSource(name)) {
        return prev;
      }
      return [...prev, curr];
    },
    []
  );
  return orderBy(combinedImports, [(v) => !v.isTypeOnly], ["desc"]);
}
function getEnvSource(source, env) {
  if (!env) {
    return source;
  }
  const keys = Object.keys(env);
  if (!keys.length) {
    return source;
  }
  return keys.reduce((prev, key) => {
    const environmentValue = env[key];
    const replaceBy = environmentValue ? `'${environmentValue.replaceAll('"', "")?.replaceAll("'", "")}'` : "undefined";
    if (key.toUpperCase() !== key) {
      throw new TypeError(`Environment should be in upperCase for ${key}`);
    }
    if (typeof replaceBy === "string") {
      prev = searchAndReplace({
        text: prev.replaceAll(`process.env.${key}`, replaceBy),
        replaceBy,
        prefix: "process.env",
        key
      });
      prev = searchAndReplace({
        text: prev.replaceAll(/(declare const).*\n/gi, ""),
        replaceBy,
        key
      });
    }
    return prev;
  }, source);
}

export {
  FileManager
};
//# sourceMappingURL=chunk-WURRAECF.js.map