import {
  EventEmitter,
  LogLevel,
  createLogger,
  p,
  randomCliColour
} from "./chunk-Q2IVZO4X.js";
import {
  FileManager
} from "./chunk-WURRAECF.js";
import {
  transformReservedWord
} from "./chunk-OZKPV7RD.js";
import {
  URLPath,
  setUniqueName
} from "./chunk-5JZNFPUP.js";
import "./chunk-4X5FFJPJ.js";
import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet
} from "./chunk-HMLY7DHA.js";

// src/build.ts
import { clean, read } from "@kubb/fs";

// src/PluginManager.ts
import PQueue from "p-queue";
import { readSync } from "@kubb/fs";

// src/utils/executeStrategies.ts
function hookSeq(promises) {
  return promises.filter(Boolean).reduce(
    (promise, func) => {
      if (typeof func !== "function") {
        throw new Error("HookSeq needs a function that returns a promise `() => Promise<unknown>`");
      }
      return promise.then((state) => {
        const calledFunc = func(state);
        if (calledFunc) {
          return calledFunc.then(Array.prototype.concat.bind(state));
        }
      });
    },
    Promise.resolve([])
  );
}
function hookFirst(promises, nullCheck = (state) => state !== null) {
  let promise = Promise.resolve(null);
  for (const func of promises.filter(Boolean)) {
    promise = promise.then((state) => {
      if (nullCheck(state)) {
        return state;
      }
      const calledFunc = func(state);
      return calledFunc;
    });
  }
  return promise;
}
function hookParallel(promises) {
  return Promise.allSettled(promises.filter(Boolean).map((promise) => promise()));
}

// src/PromiseManager.ts
var _options;
var PromiseManager = class {
  constructor(options = {}) {
    __privateAdd(this, _options, {});
    __privateSet(this, _options, options);
    return this;
  }
  run(strategy, promises) {
    if (strategy === "seq") {
      return hookSeq(promises);
    }
    if (strategy === "first") {
      return hookFirst(promises, __privateGet(this, _options).nullCheck);
    }
    if (strategy === "parallel") {
      return hookParallel(promises);
    }
    throw new Error(`${strategy} not implemented`);
  }
};
_options = new WeakMap();
function isPromise(result) {
  return !!result && typeof result?.then === "function";
}
function isPromiseRejectedResult(result) {
  return result.status === "rejected";
}

// src/errors.ts
var Warning = class extends Error {
  constructor(message, options) {
    super(message, { cause: options?.cause });
    this.name = "Warning";
  }
};
var ValidationPluginError = class extends Error {
};

// src/plugin.ts
import path from "node:path";

// src/utils/cache.ts
function createPluginCache(Store = /* @__PURE__ */ Object.create(null)) {
  return {
    set(id, value) {
      Store[id] = [0, value];
    },
    get(id) {
      const item = Store[id];
      if (!item) {
        return null;
      }
      item[0] = 0;
      return item[1];
    },
    has(id) {
      const item = Store[id];
      if (!item) {
        return false;
      }
      item[0] = 0;
      return true;
    },
    delete(id) {
      return delete Store[id];
    }
  };
}

// src/plugin.ts
function createPlugin(factory) {
  return (options = {}) => {
    return factory(options);
  };
}
var pluginCore = createPlugin((options) => {
  const { fileManager, pluginManager, resolvePath, resolveName, logger } = options;
  return {
    name: "core",
    options,
    key: ["core"],
    api() {
      return {
        get config() {
          return options.config;
        },
        get plugins() {
          return options.getPlugins();
        },
        get plugin() {
          return options.plugin;
        },
        logger,
        fileManager,
        pluginManager,
        async addFile(...files) {
          const resolvedFiles = await fileManager.add(...files);
          if (!Array.isArray(resolvedFiles)) {
            return [resolvedFiles];
          }
          return resolvedFiles;
        },
        resolvePath,
        resolveName,
        cache: createPluginCache()
      };
    },
    resolvePath(baseName) {
      const root = path.resolve(this.config.root, this.config.output.path);
      return path.resolve(root, baseName);
    },
    resolveName(name) {
      return name;
    }
  };
});

// src/PluginManager.ts
var _core, _usedPluginNames, _promiseManager, _PluginManager_instances, getSortedPlugins_fn, addExecutedToCallStack_fn, execute_fn, executeSync_fn, catcher_fn, parse_fn;
var PluginManager = class {
  constructor(config, options) {
    __privateAdd(this, _PluginManager_instances);
    this.events = new EventEmitter();
    this.executed = [];
    __privateAdd(this, _core);
    __privateAdd(this, _usedPluginNames, {});
    __privateAdd(this, _promiseManager);
    this.resolvePath = (params) => {
      if (params.pluginKey) {
        const paths = this.hookForPluginSync({
          pluginKey: params.pluginKey,
          hookName: "resolvePath",
          parameters: [params.baseName, params.mode, params.options]
        });
        if (paths && paths?.length > 1) {
          this.logger.emit("debug", [
            `Cannot return a path where the 'pluginKey' ${params.pluginKey ? JSON.stringify(params.pluginKey) : '"'} is not unique enough

Paths: ${JSON.stringify(paths, void 0, 2)}

Falling back on the first item.
`
          ]);
        }
        return paths?.at(0);
      }
      return this.hookFirstSync({
        hookName: "resolvePath",
        parameters: [params.baseName, params.mode, params.options]
      }).result;
    };
    this.resolveName = (params) => {
      if (params.pluginKey) {
        const names = this.hookForPluginSync({
          pluginKey: params.pluginKey,
          hookName: "resolveName",
          parameters: [params.name, params.type]
        });
        if (names && names?.length > 1) {
          this.logger.emit("debug", [
            `Cannot return a name where the 'pluginKey' ${params.pluginKey ? JSON.stringify(params.pluginKey) : '"'} is not unique enough

Names: ${JSON.stringify(names, void 0, 2)}

Falling back on the first item.
`
          ]);
        }
        return transformReservedWord(names?.at(0) || params.name);
      }
      const name = this.hookFirstSync({
        hookName: "resolveName",
        parameters: [params.name, params.type]
      }).result;
      return transformReservedWord(name);
    };
    this.config = config;
    this.logger = options.logger;
    this.queue = new PQueue({ concurrency: 1 });
    this.fileManager = new FileManager({
      task: options.task,
      queue: this.queue
    });
    __privateSet(this, _promiseManager, new PromiseManager({
      nullCheck: (state) => !!state?.result
    }));
    const plugins = config.plugins || [];
    const core = pluginCore({
      config,
      logger: this.logger,
      pluginManager: this,
      fileManager: this.fileManager,
      resolvePath: this.resolvePath.bind(this),
      resolveName: this.resolveName.bind(this),
      getPlugins: __privateMethod(this, _PluginManager_instances, getSortedPlugins_fn).bind(this)
    });
    __privateSet(this, _core, __privateMethod(this, _PluginManager_instances, parse_fn).call(this, core, this, core.api.call(null)));
    this.plugins = [__privateGet(this, _core), ...plugins].map((plugin) => {
      return __privateMethod(this, _PluginManager_instances, parse_fn).call(this, plugin, this, __privateGet(this, _core).api);
    });
    return this;
  }
  getFile({ name, mode, extName, pluginKey, options }) {
    let source = "";
    const baseName = `${name}${extName}`;
    const path2 = this.resolvePath({ baseName, mode, pluginKey, options });
    if (!path2) {
      throw new Error(`Filepath should be defined for resolvedName "${name}" and pluginKey [${JSON.stringify(pluginKey)}]`);
    }
    try {
      source = readSync(path2);
    } catch (_e) {
    }
    return {
      path: path2,
      baseName,
      meta: {
        pluginKey
      },
      source
    };
  }
  /**
   * Instead of calling `pluginManager.events.on` you can use `pluginManager.on`. This one also has better types.
   */
  on(eventName, handler) {
    this.events.on(eventName, handler);
  }
  /**
   * Run a specific hookName for plugin x.
   */
  hookForPlugin({
    pluginKey,
    hookName,
    parameters
  }) {
    const plugins = this.getPluginsByKey(hookName, pluginKey);
    const promises = plugins.map((plugin) => {
      return __privateMethod(this, _PluginManager_instances, execute_fn).call(this, {
        strategy: "hookFirst",
        hookName,
        parameters,
        plugin
      });
    }).filter(Boolean);
    return Promise.all(promises);
  }
  /**
   * Run a specific hookName for plugin x.
   */
  hookForPluginSync({
    pluginKey,
    hookName,
    parameters
  }) {
    const plugins = this.getPluginsByKey(hookName, pluginKey);
    return plugins.map((plugin) => {
      return __privateMethod(this, _PluginManager_instances, executeSync_fn).call(this, {
        strategy: "hookFirst",
        hookName,
        parameters,
        plugin
      });
    }).filter(Boolean);
  }
  /**
   * First non-null result stops and will return it's value.
   */
  async hookFirst({
    hookName,
    parameters,
    skipped
  }) {
    const promises = __privateMethod(this, _PluginManager_instances, getSortedPlugins_fn).call(this).filter((plugin) => {
      return skipped ? skipped.has(plugin) : true;
    }).map((plugin) => {
      return async () => {
        const value = await __privateMethod(this, _PluginManager_instances, execute_fn).call(this, {
          strategy: "hookFirst",
          hookName,
          parameters,
          plugin
        });
        return Promise.resolve({
          plugin,
          result: value
        });
      };
    });
    return __privateGet(this, _promiseManager).run("first", promises);
  }
  /**
   * First non-null result stops and will return it's value.
   */
  hookFirstSync({
    hookName,
    parameters,
    skipped
  }) {
    let parseResult = null;
    for (const plugin of __privateMethod(this, _PluginManager_instances, getSortedPlugins_fn).call(this)) {
      if (skipped?.has(plugin)) {
        continue;
      }
      parseResult = {
        result: __privateMethod(this, _PluginManager_instances, executeSync_fn).call(this, {
          strategy: "hookFirst",
          hookName,
          parameters,
          plugin
        }),
        plugin
      };
      if (parseResult?.result != null) {
        break;
      }
    }
    return parseResult;
  }
  /**
   * Run all plugins in parallel(order will be based on `this.plugin` and if `pre` or `post` is set).
   */
  async hookParallel({
    hookName,
    parameters
  }) {
    const promises = __privateMethod(this, _PluginManager_instances, getSortedPlugins_fn).call(this).map((plugin) => {
      return () => __privateMethod(this, _PluginManager_instances, execute_fn).call(this, {
        strategy: "hookParallel",
        hookName,
        parameters,
        plugin
      });
    });
    const results = await __privateGet(this, _promiseManager).run("parallel", promises);
    results.forEach((result, index) => {
      if (isPromiseRejectedResult(result)) {
        const plugin = __privateMethod(this, _PluginManager_instances, getSortedPlugins_fn).call(this)[index];
        __privateMethod(this, _PluginManager_instances, catcher_fn).call(this, result.reason, plugin, hookName);
      }
    });
    return results.filter((result) => result.status === "fulfilled").map((result) => result.value);
  }
  /**
   * Chain all plugins, `reduce` can be passed through to handle every returned value. The return value of the first plugin will be used as the first parameter for the plugin after that.
   */
  hookReduceArg0({
    hookName,
    parameters,
    reduce
  }) {
    const [argument0, ...rest] = parameters;
    let promise = Promise.resolve(argument0);
    for (const plugin of __privateMethod(this, _PluginManager_instances, getSortedPlugins_fn).call(this)) {
      promise = promise.then((arg0) => {
        const value = __privateMethod(this, _PluginManager_instances, execute_fn).call(this, {
          strategy: "hookReduceArg0",
          hookName,
          parameters: [arg0, ...rest],
          plugin
        });
        return value;
      }).then((result) => reduce.call(__privateGet(this, _core).api, argument0, result, plugin));
    }
    return promise;
  }
  /**
   * Chains plugins
   */
  async hookSeq({ hookName, parameters }) {
    const promises = __privateMethod(this, _PluginManager_instances, getSortedPlugins_fn).call(this).map((plugin) => {
      return () => __privateMethod(this, _PluginManager_instances, execute_fn).call(this, {
        strategy: "hookSeq",
        hookName,
        parameters,
        plugin
      });
    });
    return __privateGet(this, _promiseManager).run("seq", promises);
  }
  getPluginsByKey(hookName, pluginKey) {
    const plugins = [...this.plugins];
    const [searchPluginName, searchIdentifier] = pluginKey;
    const pluginByPluginName = plugins.filter((plugin) => plugin[hookName]).filter((item) => {
      const [name, identifier] = item.key;
      const identifierCheck = identifier?.toString() === searchIdentifier?.toString();
      const nameCheck = name === searchPluginName;
      if (searchIdentifier) {
        return identifierCheck && nameCheck;
      }
      return nameCheck;
    });
    if (!pluginByPluginName?.length) {
      const corePlugin = plugins.find((plugin) => plugin.name === "core" && plugin[hookName]);
      if (corePlugin) {
        this.logger.emit("debug", [`No hook '${hookName}' for pluginKey '${JSON.stringify(pluginKey)}' found, falling back on the '@kubb/core' plugin`]);
      } else {
        this.logger.emit("debug", [`No hook '${hookName}' for pluginKey '${JSON.stringify(pluginKey)}' found, no fallback found in the '@kubb/core' plugin`]);
      }
      return corePlugin ? [corePlugin] : [];
    }
    return pluginByPluginName;
  }
  static getDependedPlugins(plugins, dependedPluginNames) {
    let pluginNames = [];
    if (typeof dependedPluginNames === "string") {
      pluginNames = [dependedPluginNames];
    } else {
      pluginNames = dependedPluginNames;
    }
    return pluginNames.map((pluginName) => {
      const plugin = plugins.find((plugin2) => plugin2.name === pluginName);
      if (!plugin) {
        throw new ValidationPluginError(`This plugin depends on the ${pluginName} plugin.`);
      }
      return plugin;
    });
  }
  static get hooks() {
    return ["buildStart", "resolvePath", "resolveName", "load", "transform", "writeFile", "buildEnd"];
  }
};
_core = new WeakMap();
_usedPluginNames = new WeakMap();
_promiseManager = new WeakMap();
_PluginManager_instances = new WeakSet();
getSortedPlugins_fn = function(hookName) {
  const plugins = [...this.plugins].filter((plugin) => plugin.name !== "core");
  if (hookName) {
    if (this.logger.logLevel === LogLevel.info) {
      const containsHookName = plugins.some((item) => item[hookName]);
      if (!containsHookName) {
        this.logger.emit("warning", `No hook ${hookName} found`);
      }
    }
    return plugins.filter((item) => item[hookName]);
  }
  return plugins.map((plugin) => {
    if (plugin.pre) {
      const isValid = plugin.pre.every((pluginName) => plugins.find((pluginToFind) => pluginToFind.name === pluginName));
      if (!isValid) {
        throw new ValidationPluginError(`This plugin has a pre set that is not valid(${JSON.stringify(plugin.pre, void 0, 2)})`);
      }
    }
    return plugin;
  }).sort((a, b) => {
    if (b.pre?.includes(a.name)) {
      return 1;
    }
    if (b.post?.includes(a.name)) {
      return -1;
    }
    return 0;
  });
};
addExecutedToCallStack_fn = function(executer) {
  if (executer) {
    this.events.emit("executed", executer);
    this.executed.push(executer);
  }
};
/**
 * Run an async plugin hook and return the result.
 * @param hookName Name of the plugin hook. Must be either in `PluginHooks` or `OutputPluginValueHooks`.
 * @param args Arguments passed to the plugin hook.
 * @param plugin The actual pluginObject to run.
 */
// Implementation signature
execute_fn = function({
  strategy,
  hookName,
  parameters,
  plugin
}) {
  const hook = plugin[hookName];
  let output;
  if (!hook) {
    return null;
  }
  this.events.emit("execute", { strategy, hookName, parameters, plugin });
  const task = Promise.resolve().then(() => {
    if (typeof hook === "function") {
      const possiblePromiseResult = hook.apply({ ...__privateGet(this, _core).api, plugin }, parameters);
      if (isPromise(possiblePromiseResult)) {
        return Promise.resolve(possiblePromiseResult);
      }
      return possiblePromiseResult;
    }
    return hook;
  }).then((result) => {
    output = result;
    __privateMethod(this, _PluginManager_instances, addExecutedToCallStack_fn).call(this, {
      parameters,
      output,
      strategy,
      hookName,
      plugin
    });
    return result;
  }).catch((e) => {
    __privateMethod(this, _PluginManager_instances, catcher_fn).call(this, e, plugin, hookName);
    return null;
  });
  return task;
};
/**
 * Run a sync plugin hook and return the result.
 * @param hookName Name of the plugin hook. Must be in `PluginHooks`.
 * @param args Arguments passed to the plugin hook.
 * @param plugin The acutal plugin
 * @param replaceContext When passed, the plugin context can be overridden.
 */
executeSync_fn = function({
  strategy,
  hookName,
  parameters,
  plugin
}) {
  const hook = plugin[hookName];
  let output;
  if (!hook) {
    return null;
  }
  this.events.emit("execute", { strategy, hookName, parameters, plugin });
  try {
    if (typeof hook === "function") {
      const fn = hook.apply({ ...__privateGet(this, _core).api, plugin }, parameters);
      output = fn;
      return fn;
    }
    output = hook;
    __privateMethod(this, _PluginManager_instances, addExecutedToCallStack_fn).call(this, {
      parameters,
      output,
      strategy,
      hookName,
      plugin
    });
    return hook;
  } catch (e) {
    __privateMethod(this, _PluginManager_instances, catcher_fn).call(this, e, plugin, hookName);
    return null;
  }
};
catcher_fn = function(cause, plugin, hookName) {
  const text = `${cause.message} (plugin: ${plugin?.name || "unknown"}, hook: ${hookName || "unknown"})`;
  this.logger.emit("error", text, cause);
  this.events.emit("error", cause);
};
parse_fn = function(plugin, pluginManager, context) {
  const usedPluginNames = __privateGet(pluginManager, _usedPluginNames);
  setUniqueName(plugin.name, usedPluginNames);
  const key = [plugin.name, usedPluginNames[plugin.name]].filter(Boolean);
  if (!plugin.transform) {
    plugin.transform = function transform(_path, code) {
      return code;
    };
  }
  if (plugin.api && typeof plugin.api === "function") {
    const api = plugin.api.call(context);
    return {
      ...plugin,
      key,
      api
    };
  }
  return {
    ...plugin,
    key
  };
};

// src/config.ts
function defineConfig(options) {
  return options;
}
function isInputPath(result) {
  return !!result && "path" in result;
}

// src/build.ts
async function transformReducer(_previousCode, result, _plugin) {
  return result;
}
async function setup(options) {
  const { config, logger = createLogger({ logLevel: LogLevel.silent }) } = options;
  let count = 0;
  try {
    if (isInputPath(config) && !new URLPath(config.input.path).isURL) {
      await read(config.input.path);
    }
  } catch (e) {
    if (isInputPath(config)) {
      throw new Error(
        `Cannot read file/URL defined in \`input.path\` or set with \`kubb generate PATH\` in the CLI of your Kubb config ${p.dim(config.input.path)}`,
        {
          cause: e
        }
      );
    }
  }
  if (config.output.clean) {
    await clean(config.output.path);
  }
  const task = async (file) => {
    const { path: path2 } = file;
    let source = await FileManager.getSource(file);
    const { result: loadedResult } = await pluginManager.hookFirst({
      hookName: "load",
      parameters: [path2]
    });
    if (loadedResult && isPromise(loadedResult)) {
      source = await loadedResult;
    }
    if (loadedResult && !isPromise(loadedResult)) {
      source = loadedResult;
    }
    if (source) {
      source = await pluginManager.hookReduceArg0({
        hookName: "transform",
        parameters: [path2, source],
        reduce: transformReducer
      });
      if (config.output.write || config.output.write === void 0) {
        if (file.meta?.pluginKey) {
          await pluginManager.hookForPlugin({
            pluginKey: file.meta?.pluginKey,
            hookName: "writeFile",
            parameters: [path2, source]
          });
        }
        await pluginManager.hookFirst({
          hookName: "writeFile",
          parameters: [path2, source]
        });
      }
    }
    return {
      ...file,
      source: source || ""
    };
  };
  const pluginManager = new PluginManager(config, { logger, task });
  pluginManager.on("execute", (executer) => {
    const { hookName, parameters, plugin } = executer;
    if (hookName === "writeFile") {
      const [code] = parameters;
      logger.emit("debug", [`PluginKey ${p.dim(JSON.stringify(plugin.key))} 
with source

${code}`]);
    }
  });
  pluginManager.queue.on("add", () => {
    if (logger.logLevel !== LogLevel.info) {
      return;
    }
    if (count === 0) {
      logger.emit("start", "\u{1F4BE} Writing");
    }
  });
  pluginManager.queue.on("active", () => {
    if (logger.logLevel !== LogLevel.info) {
      return;
    }
    if (logger.spinner && pluginManager.queue.size > 0) {
      const text = `Item: ${count} Size: ${pluginManager.queue.size}  Pending: ${pluginManager.queue.pending}`;
      logger.spinner.suffixText = p.dim(text);
    }
    ++count;
  });
  pluginManager.queue.on("completed", () => {
    if (logger.logLevel !== LogLevel.info) {
      return;
    }
    if (logger.spinner) {
      const text = `Item: ${count} Size: ${pluginManager.queue.size}  Pending: ${pluginManager.queue.pending}`;
      logger.spinner.suffixText = p.dim(text);
    }
  });
  pluginManager.on("executed", (executer) => {
    const { hookName, plugin, output, parameters } = executer;
    const logs = [
      `${randomCliColour(plugin.name)} Executing ${hookName}`,
      parameters && `${p.bgWhite("Parameters")} ${randomCliColour(plugin.name)} ${hookName}`,
      JSON.stringify(parameters, void 0, 2),
      output && `${p.bgWhite("Output")} ${randomCliColour(plugin.name)} ${hookName}`,
      output
    ].filter(Boolean);
    logger.emit("debug", logs);
  });
  return pluginManager;
}
async function build(options) {
  const pluginManager = await setup(options);
  const { fileManager, logger } = pluginManager;
  await pluginManager.hookParallel({
    hookName: "buildStart",
    parameters: [options.config]
  });
  await pluginManager.hookParallel({ hookName: "buildEnd" });
  if (logger.logLevel === LogLevel.info) {
    logger.emit("end", "\u{1F4BE} Writing completed");
  }
  const files = await Promise.all(
    fileManager.files.map(async (file) => ({
      ...file,
      source: await FileManager.getSource(file)
    }))
  );
  return {
    files,
    pluginManager
  };
}
async function safeBuild(options) {
  const pluginManager = await setup(options);
  const { fileManager, logger } = pluginManager;
  try {
    await pluginManager.hookParallel({
      hookName: "buildStart",
      parameters: [options.config]
    });
    await pluginManager.hookParallel({ hookName: "buildEnd" });
    if (logger.logLevel === LogLevel.info) {
      logger.emit("end", "\u{1F4BE} Writing completed");
    }
  } catch (e) {
    const files2 = await Promise.all(
      fileManager.files.map(async (file) => ({
        ...file,
        source: await FileManager.getSource(file)
      }))
    );
    return {
      files: files2,
      pluginManager,
      error: e
    };
  }
  const files = await Promise.all(
    fileManager.files.map(async (file) => ({
      ...file,
      source: await FileManager.getSource(file)
    }))
  );
  return {
    files,
    pluginManager
  };
}

// src/Generator.ts
var _options2, _context;
var Generator = class {
  constructor(options, context) {
    __privateAdd(this, _options2, {});
    __privateAdd(this, _context, {});
    if (context) {
      __privateSet(this, _context, context);
    }
    if (options) {
      __privateSet(this, _options2, options);
    }
    return this;
  }
  get options() {
    return __privateGet(this, _options2);
  }
  get context() {
    return __privateGet(this, _context);
  }
  set options(options) {
    __privateSet(this, _options2, { ...__privateGet(this, _options2), ...options });
  }
};
_options2 = new WeakMap();
_context = new WeakMap();

// src/PackageManager.ts
import mod from "node:module";
import os from "node:os";
import { pathToFileURL } from "node:url";
import { findUp, findUpSync } from "find-up";
import { coerce, satisfies } from "semver";
import { read as read2, readSync as readSync2 } from "@kubb/fs";
var _cache, _cwd, _SLASHES, _PackageManager_instances, match_fn;
var _PackageManager = class _PackageManager {
  constructor(workspace) {
    __privateAdd(this, _PackageManager_instances);
    __privateAdd(this, _cwd);
    __privateAdd(this, _SLASHES, /* @__PURE__ */ new Set(["/", "\\"]));
    if (workspace) {
      __privateSet(this, _cwd, workspace);
    }
    return this;
  }
  set workspace(workspace) {
    __privateSet(this, _cwd, workspace);
  }
  get workspace() {
    return __privateGet(this, _cwd);
  }
  normalizeDirectory(directory) {
    if (!__privateGet(this, _SLASHES).has(directory[directory.length - 1])) {
      return `${directory}/`;
    }
    return directory;
  }
  getLocation(path2) {
    let location = path2;
    if (__privateGet(this, _cwd)) {
      const require2 = mod.createRequire(this.normalizeDirectory(__privateGet(this, _cwd)));
      location = require2.resolve(path2);
    }
    return location;
  }
  async import(path2) {
    try {
      let location = this.getLocation(path2);
      if (os.platform() === "win32") {
        location = pathToFileURL(location).href;
      }
      const module = await import(location);
      return module?.default ?? module;
    } catch (e) {
      console.log(e);
      return void 0;
    }
  }
  async getPackageJSON() {
    const pkgPath = await findUp(["package.json"], {
      cwd: __privateGet(this, _cwd)
    });
    if (!pkgPath) {
      return void 0;
    }
    const json = await read2(pkgPath);
    return JSON.parse(json);
  }
  getPackageJSONSync() {
    const pkgPath = findUpSync(["package.json"], {
      cwd: __privateGet(this, _cwd)
    });
    if (!pkgPath) {
      return void 0;
    }
    const json = readSync2(pkgPath);
    return JSON.parse(json);
  }
  static setVersion(dependency, version) {
    __privateGet(_PackageManager, _cache)[dependency] = version;
  }
  async getVersion(dependency) {
    if (typeof dependency === "string" && __privateGet(_PackageManager, _cache)[dependency]) {
      return __privateGet(_PackageManager, _cache)[dependency];
    }
    const packageJSON = await this.getPackageJSON();
    if (!packageJSON) {
      return void 0;
    }
    return __privateMethod(this, _PackageManager_instances, match_fn).call(this, packageJSON, dependency);
  }
  getVersionSync(dependency) {
    if (typeof dependency === "string" && __privateGet(_PackageManager, _cache)[dependency]) {
      return __privateGet(_PackageManager, _cache)[dependency];
    }
    const packageJSON = this.getPackageJSONSync();
    if (!packageJSON) {
      return void 0;
    }
    return __privateMethod(this, _PackageManager_instances, match_fn).call(this, packageJSON, dependency);
  }
  async isValid(dependency, version) {
    const packageVersion = await this.getVersion(dependency);
    if (!packageVersion) {
      return false;
    }
    if (packageVersion === version) {
      return true;
    }
    const semVer = coerce(packageVersion);
    if (!semVer) {
      throw new Error(`${packageVersion} is not valid`);
    }
    return satisfies(semVer, version);
  }
  isValidSync(dependency, version) {
    const packageVersion = this.getVersionSync(dependency);
    if (!packageVersion) {
      return false;
    }
    const semVer = coerce(packageVersion);
    if (!semVer) {
      throw new Error(`${packageVersion} is not valid`);
    }
    return satisfies(semVer, version);
  }
};
_cache = new WeakMap();
_cwd = new WeakMap();
_SLASHES = new WeakMap();
_PackageManager_instances = new WeakSet();
match_fn = function(packageJSON, dependency) {
  const dependencies = {
    ...packageJSON["dependencies"] || {},
    ...packageJSON["devDependencies"] || {}
  };
  if (typeof dependency === "string" && dependencies[dependency]) {
    return dependencies[dependency];
  }
  const matchedDependency = Object.keys(dependencies).find((dep) => dep.match(dependency));
  return matchedDependency ? dependencies[matchedDependency] : void 0;
};
__privateAdd(_PackageManager, _cache, {});
var PackageManager = _PackageManager;
export {
  FileManager,
  Generator,
  PackageManager,
  PluginManager,
  PromiseManager,
  Warning,
  build,
  createPlugin,
  build as default,
  defineConfig,
  isInputPath,
  safeBuild
};
//# sourceMappingURL=index.js.map