"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }





var _chunkCUNH5H3Lcjs = require('./chunk-CUNH5H3L.cjs');



var _chunkAT6SMJQWcjs = require('./chunk-AT6SMJQW.cjs');


var _chunkXTU72BHDcjs = require('./chunk-XTU72BHD.cjs');



var _chunk2IH3FIGIcjs = require('./chunk-2IH3FIGI.cjs');
require('./chunk-KTZ6EAKP.cjs');








var _chunkNFUUQKWPcjs = require('./chunk-NFUUQKWP.cjs');

// src/index.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );

// src/build.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var _fs = require('@kubb/fs');

// src/PluginManager.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );


// src/PromiseManager.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );

// src/utils/executeStrategies.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
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
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _options, {});
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _options, options);
    return this;
  }
  run(strategy, promises) {
    if (strategy === "seq") {
      return hookSeq(promises);
    }
    if (strategy === "first") {
      return hookFirst(promises, _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _options).nullCheck);
    }
    if (strategy === "parallel") {
      return hookParallel(promises);
    }
    throw new Error(`${strategy} not implemented`);
  }
};
_options = new WeakMap();
function isPromise(result) {
  return !!result && typeof _optionalChain([result, 'optionalAccess', _2 => _2.then]) === "function";
}
function isPromiseRejectedResult(result) {
  return result.status === "rejected";
}

// src/errors.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var Warning = class extends Error {
  constructor(message, options) {
    super(message, { cause: _optionalChain([options, 'optionalAccess', _3 => _3.cause]) });
    this.name = "Warning";
  }
};
var ValidationPluginError = class extends Error {
};

// src/plugin.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var _path2 = require('path'); var _path3 = _interopRequireDefault(_path2);

// src/utils/cache.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
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
      const root = _path3.default.resolve(this.config.root, this.config.output.path);
      return _path3.default.resolve(root, baseName);
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
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _PluginManager_instances);
    this.events = new (0, _chunkCUNH5H3Lcjs.EventEmitter)();
    this.executed = [];
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _core);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _usedPluginNames, {});
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _promiseManager);
    this.resolvePath = (params) => {
      if (params.pluginKey) {
        const paths = this.hookForPluginSync({
          pluginKey: params.pluginKey,
          hookName: "resolvePath",
          parameters: [params.baseName, params.mode, params.options]
        });
        if (paths && _optionalChain([paths, 'optionalAccess', _4 => _4.length]) > 1) {
          this.logger.emit("debug", [
            `Cannot return a path where the 'pluginKey' ${params.pluginKey ? JSON.stringify(params.pluginKey) : '"'} is not unique enough

Paths: ${JSON.stringify(paths, void 0, 2)}

Falling back on the first item.
`
          ]);
        }
        return _optionalChain([paths, 'optionalAccess', _5 => _5.at, 'call', _6 => _6(0)]);
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
        if (names && _optionalChain([names, 'optionalAccess', _7 => _7.length]) > 1) {
          this.logger.emit("debug", [
            `Cannot return a name where the 'pluginKey' ${params.pluginKey ? JSON.stringify(params.pluginKey) : '"'} is not unique enough

Names: ${JSON.stringify(names, void 0, 2)}

Falling back on the first item.
`
          ]);
        }
        return _chunkXTU72BHDcjs.transformReservedWord.call(void 0, _optionalChain([names, 'optionalAccess', _8 => _8.at, 'call', _9 => _9(0)]) || params.name);
      }
      const name = this.hookFirstSync({
        hookName: "resolveName",
        parameters: [params.name, params.type]
      }).result;
      return _chunkXTU72BHDcjs.transformReservedWord.call(void 0, name);
    };
    this.config = config;
    this.logger = options.logger;
    this.queue = new (0, _chunkAT6SMJQWcjs.PQueue)({ concurrency: 1 });
    this.fileManager = new (0, _chunkAT6SMJQWcjs.FileManager)({
      task: options.task,
      queue: this.queue
    });
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _promiseManager, new PromiseManager({
      nullCheck: (state) => !!_optionalChain([state, 'optionalAccess', _10 => _10.result])
    }));
    const plugins = config.plugins || [];
    const core = pluginCore({
      config,
      logger: this.logger,
      pluginManager: this,
      fileManager: this.fileManager,
      resolvePath: this.resolvePath.bind(this),
      resolveName: this.resolveName.bind(this),
      getPlugins: _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, getSortedPlugins_fn).bind(this)
    });
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _core, _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, parse_fn).call(this, core, this, core.api.call(null)));
    this.plugins = [_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _core), ...plugins].map((plugin) => {
      return _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, parse_fn).call(this, plugin, this, _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _core).api);
    });
    return this;
  }
  getFile({ name, mode, extName, pluginKey, options }) {
    let source = "";
    const baseName = `${name}${extName}`;
    const path4 = this.resolvePath({ baseName, mode, pluginKey, options });
    if (!path4) {
      throw new Error(`Filepath should be defined for resolvedName "${name}" and pluginKey [${JSON.stringify(pluginKey)}]`);
    }
    try {
      source = _fs.readSync.call(void 0, path4);
    } catch (_e) {
    }
    return {
      path: path4,
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
      return _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, execute_fn).call(this, {
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
      return _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, executeSync_fn).call(this, {
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
    const promises = _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, getSortedPlugins_fn).call(this).filter((plugin) => {
      return skipped ? skipped.has(plugin) : true;
    }).map((plugin) => {
      return async () => {
        const value = await _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, execute_fn).call(this, {
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
    return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _promiseManager).run("first", promises);
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
    for (const plugin of _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, getSortedPlugins_fn).call(this)) {
      if (_optionalChain([skipped, 'optionalAccess', _11 => _11.has, 'call', _12 => _12(plugin)])) {
        continue;
      }
      parseResult = {
        result: _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, executeSync_fn).call(this, {
          strategy: "hookFirst",
          hookName,
          parameters,
          plugin
        }),
        plugin
      };
      if (_optionalChain([parseResult, 'optionalAccess', _13 => _13.result]) != null) {
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
    const promises = _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, getSortedPlugins_fn).call(this).map((plugin) => {
      return () => _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, execute_fn).call(this, {
        strategy: "hookParallel",
        hookName,
        parameters,
        plugin
      });
    });
    const results = await _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _promiseManager).run("parallel", promises);
    results.forEach((result, index) => {
      if (isPromiseRejectedResult(result)) {
        const plugin = _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, getSortedPlugins_fn).call(this)[index];
        _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, catcher_fn).call(this, result.reason, plugin, hookName);
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
    for (const plugin of _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, getSortedPlugins_fn).call(this)) {
      promise = promise.then((arg0) => {
        const value = _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, execute_fn).call(this, {
          strategy: "hookReduceArg0",
          hookName,
          parameters: [arg0, ...rest],
          plugin
        });
        return value;
      }).then((result) => reduce.call(_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _core).api, argument0, result, plugin));
    }
    return promise;
  }
  /**
   * Chains plugins
   */
  async hookSeq({ hookName, parameters }) {
    const promises = _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, getSortedPlugins_fn).call(this).map((plugin) => {
      return () => _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, execute_fn).call(this, {
        strategy: "hookSeq",
        hookName,
        parameters,
        plugin
      });
    });
    return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _promiseManager).run("seq", promises);
  }
  getPluginsByKey(hookName, pluginKey) {
    const plugins = [...this.plugins];
    const [searchPluginName, searchIdentifier] = pluginKey;
    const pluginByPluginName = plugins.filter((plugin) => plugin[hookName]).filter((item) => {
      const [name, identifier] = item.key;
      const identifierCheck = _optionalChain([identifier, 'optionalAccess', _14 => _14.toString, 'call', _15 => _15()]) === _optionalChain([searchIdentifier, 'optionalAccess', _16 => _16.toString, 'call', _17 => _17()]);
      const nameCheck = name === searchPluginName;
      if (searchIdentifier) {
        return identifierCheck && nameCheck;
      }
      return nameCheck;
    });
    if (!_optionalChain([pluginByPluginName, 'optionalAccess', _18 => _18.length])) {
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
    if (this.logger.logLevel === _chunkCUNH5H3Lcjs.LogLevel.info) {
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
    if (_optionalChain([b, 'access', _19 => _19.pre, 'optionalAccess', _20 => _20.includes, 'call', _21 => _21(a.name)])) {
      return 1;
    }
    if (_optionalChain([b, 'access', _22 => _22.post, 'optionalAccess', _23 => _23.includes, 'call', _24 => _24(a.name)])) {
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
      const possiblePromiseResult = hook.apply({ ..._chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _core).api, plugin }, parameters);
      if (isPromise(possiblePromiseResult)) {
        return Promise.resolve(possiblePromiseResult);
      }
      return possiblePromiseResult;
    }
    return hook;
  }).then((result) => {
    output = result;
    _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, addExecutedToCallStack_fn).call(this, {
      parameters,
      output,
      strategy,
      hookName,
      plugin
    });
    return result;
  }).catch((e) => {
    _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, catcher_fn).call(this, e, plugin, hookName);
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
      const fn = hook.apply({ ..._chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _core).api, plugin }, parameters);
      output = fn;
      return fn;
    }
    output = hook;
    _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, addExecutedToCallStack_fn).call(this, {
      parameters,
      output,
      strategy,
      hookName,
      plugin
    });
    return hook;
  } catch (e) {
    _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PluginManager_instances, catcher_fn).call(this, e, plugin, hookName);
    return null;
  }
};
catcher_fn = function(cause, plugin, hookName) {
  const text = `${cause.message} (plugin: ${_optionalChain([plugin, 'optionalAccess', _25 => _25.name]) || "unknown"}, hook: ${hookName || "unknown"})`;
  this.logger.emit("error", text, cause);
  this.events.emit("error", cause);
};
parse_fn = function(plugin, pluginManager, context) {
  const usedPluginNames = _chunkNFUUQKWPcjs.__privateGet.call(void 0, pluginManager, _usedPluginNames);
  _chunk2IH3FIGIcjs.setUniqueName.call(void 0, plugin.name, usedPluginNames);
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
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
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
  const { config, logger = _chunkCUNH5H3Lcjs.createLogger.call(void 0, { logLevel: _chunkCUNH5H3Lcjs.LogLevel.silent }) } = options;
  let count = 0;
  try {
    if (isInputPath(config) && !new (0, _chunk2IH3FIGIcjs.URLPath)(config.input.path).isURL) {
      await _fs.read.call(void 0, config.input.path);
    }
  } catch (e) {
    if (isInputPath(config)) {
      throw new Error(
        `Cannot read file/URL defined in \`input.path\` or set with \`kubb generate PATH\` in the CLI of your Kubb config ${_chunkCUNH5H3Lcjs.p.dim(config.input.path)}`,
        {
          cause: e
        }
      );
    }
  }
  if (config.output.clean) {
    await _fs.clean.call(void 0, config.output.path);
  }
  const task = async (file) => {
    const { path: path4 } = file;
    let source = await _chunkAT6SMJQWcjs.FileManager.getSource(file);
    const { result: loadedResult } = await pluginManager.hookFirst({
      hookName: "load",
      parameters: [path4]
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
        parameters: [path4, source],
        reduce: transformReducer
      });
      if (config.output.write || config.output.write === void 0) {
        if (_optionalChain([file, 'access', _26 => _26.meta, 'optionalAccess', _27 => _27.pluginKey])) {
          await pluginManager.hookForPlugin({
            pluginKey: _optionalChain([file, 'access', _28 => _28.meta, 'optionalAccess', _29 => _29.pluginKey]),
            hookName: "writeFile",
            parameters: [path4, source]
          });
        }
        await pluginManager.hookFirst({
          hookName: "writeFile",
          parameters: [path4, source]
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
      logger.emit("debug", [`PluginKey ${_chunkCUNH5H3Lcjs.p.dim(JSON.stringify(plugin.key))} 
with source

${code}`]);
    }
  });
  pluginManager.queue.on("add", () => {
    if (logger.logLevel !== _chunkCUNH5H3Lcjs.LogLevel.info) {
      return;
    }
    if (count === 0) {
      logger.emit("start", "\u{1F4BE} Writing");
    }
  });
  pluginManager.queue.on("active", () => {
    if (logger.logLevel !== _chunkCUNH5H3Lcjs.LogLevel.info) {
      return;
    }
    if (logger.spinner && pluginManager.queue.size > 0) {
      const text = `Item: ${count} Size: ${pluginManager.queue.size}  Pending: ${pluginManager.queue.pending}`;
      logger.spinner.suffixText = _chunkCUNH5H3Lcjs.p.dim(text);
    }
    ++count;
  });
  pluginManager.queue.on("completed", () => {
    if (logger.logLevel !== _chunkCUNH5H3Lcjs.LogLevel.info) {
      return;
    }
    if (logger.spinner) {
      const text = `Item: ${count} Size: ${pluginManager.queue.size}  Pending: ${pluginManager.queue.pending}`;
      logger.spinner.suffixText = _chunkCUNH5H3Lcjs.p.dim(text);
    }
  });
  pluginManager.on("executed", (executer) => {
    const { hookName, plugin, output, parameters } = executer;
    const logs = [
      `${_chunkCUNH5H3Lcjs.randomCliColour.call(void 0, plugin.name)} Executing ${hookName}`,
      parameters && `${_chunkCUNH5H3Lcjs.p.bgWhite("Parameters")} ${_chunkCUNH5H3Lcjs.randomCliColour.call(void 0, plugin.name)} ${hookName}`,
      JSON.stringify(parameters, void 0, 2),
      output && `${_chunkCUNH5H3Lcjs.p.bgWhite("Output")} ${_chunkCUNH5H3Lcjs.randomCliColour.call(void 0, plugin.name)} ${hookName}`,
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
  if (logger.logLevel === _chunkCUNH5H3Lcjs.LogLevel.info) {
    logger.emit("end", "\u{1F4BE} Writing completed");
  }
  const files = await Promise.all(
    fileManager.files.map(async (file) => ({
      ...file,
      source: await _chunkAT6SMJQWcjs.FileManager.getSource(file)
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
    if (logger.logLevel === _chunkCUNH5H3Lcjs.LogLevel.info) {
      logger.emit("end", "\u{1F4BE} Writing completed");
    }
  } catch (e) {
    const files2 = await Promise.all(
      fileManager.files.map(async (file) => ({
        ...file,
        source: await _chunkAT6SMJQWcjs.FileManager.getSource(file)
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
      source: await _chunkAT6SMJQWcjs.FileManager.getSource(file)
    }))
  );
  return {
    files,
    pluginManager
  };
}

// src/Generator.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var _options2, _context;
var Generator = class {
  constructor(options, context) {
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _options2, {});
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _context, {});
    if (context) {
      _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _context, context);
    }
    if (options) {
      _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _options2, options);
    }
    return this;
  }
  get options() {
    return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _options2);
  }
  get context() {
    return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _context);
  }
  set options(options) {
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _options2, { ..._chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _options2), ...options });
  }
};
_options2 = new WeakMap();
_context = new WeakMap();

// src/PackageManager.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var _module = require('module'); var _module2 = _interopRequireDefault(_module);
var _os = require('os'); var _os2 = _interopRequireDefault(_os);
var _url = require('url');

// ../../node_modules/.pnpm/find-up@7.0.0/node_modules/find-up/index.js
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );


// ../../node_modules/.pnpm/locate-path@7.2.0/node_modules/locate-path/index.js
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var _process = require('process'); var _process2 = _interopRequireDefault(_process);

var _fs3 = require('fs'); var _fs4 = _interopRequireDefault(_fs3);


// ../../node_modules/.pnpm/p-locate@6.0.0/node_modules/p-locate/index.js
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );

// ../../node_modules/.pnpm/p-limit@4.0.0/node_modules/p-limit/index.js
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );

// ../../node_modules/.pnpm/yocto-queue@1.0.0/node_modules/yocto-queue/index.js
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var Node = class {
  constructor(value) {
    _chunkNFUUQKWPcjs.__publicField.call(void 0, this, "value");
    _chunkNFUUQKWPcjs.__publicField.call(void 0, this, "next");
    this.value = value;
  }
};
var _head, _tail, _size;
var Queue = class {
  constructor() {
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _head);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _tail);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _size);
    this.clear();
  }
  enqueue(value) {
    const node = new Node(value);
    if (_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _head)) {
      _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _tail).next = node;
      _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _tail, node);
    } else {
      _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _head, node);
      _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _tail, node);
    }
    _chunkNFUUQKWPcjs.__privateWrapper.call(void 0, this, _size)._++;
  }
  dequeue() {
    const current = _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _head);
    if (!current) {
      return;
    }
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _head, _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _head).next);
    _chunkNFUUQKWPcjs.__privateWrapper.call(void 0, this, _size)._--;
    return current.value;
  }
  clear() {
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _head, void 0);
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _tail, void 0);
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _size, 0);
  }
  get size() {
    return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _size);
  }
  *[Symbol.iterator]() {
    let current = _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _head);
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
};
_head = new WeakMap();
_tail = new WeakMap();
_size = new WeakMap();

// ../../node_modules/.pnpm/p-limit@4.0.0/node_modules/p-limit/index.js
function pLimit(concurrency) {
  if (!((Number.isInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) && concurrency > 0)) {
    throw new TypeError("Expected `concurrency` to be a number from 1 and up");
  }
  const queue = new Queue();
  let activeCount = 0;
  const next = () => {
    activeCount--;
    if (queue.size > 0) {
      queue.dequeue()();
    }
  };
  const run = async (fn, resolve, args) => {
    activeCount++;
    const result = (async () => fn(...args))();
    resolve(result);
    try {
      await result;
    } catch (e2) {
    }
    next();
  };
  const enqueue = (fn, resolve, args) => {
    queue.enqueue(run.bind(void 0, fn, resolve, args));
    (async () => {
      await Promise.resolve();
      if (activeCount < concurrency && queue.size > 0) {
        queue.dequeue()();
      }
    })();
  };
  const generator = (fn, ...args) => new Promise((resolve) => {
    enqueue(fn, resolve, args);
  });
  Object.defineProperties(generator, {
    activeCount: {
      get: () => activeCount
    },
    pendingCount: {
      get: () => queue.size
    },
    clearQueue: {
      value: () => {
        queue.clear();
      }
    }
  });
  return generator;
}

// ../../node_modules/.pnpm/p-locate@6.0.0/node_modules/p-locate/index.js
var EndError = class extends Error {
  constructor(value) {
    super();
    this.value = value;
  }
};
var testElement = async (element, tester) => tester(await element);
var finder = async (element) => {
  const values = await Promise.all(element);
  if (values[1] === true) {
    throw new EndError(values[0]);
  }
  return false;
};
async function pLocate(iterable, tester, {
  concurrency = Number.POSITIVE_INFINITY,
  preserveOrder = true
} = {}) {
  const limit = pLimit(concurrency);
  const items = [...iterable].map((element) => [element, limit(testElement, element, tester)]);
  const checkLimit = pLimit(preserveOrder ? 1 : Number.POSITIVE_INFINITY);
  try {
    await Promise.all(items.map((element) => checkLimit(finder, element)));
  } catch (error) {
    if (error instanceof EndError) {
      return error.value;
    }
    throw error;
  }
}

// ../../node_modules/.pnpm/locate-path@7.2.0/node_modules/locate-path/index.js
var typeMappings = {
  directory: "isDirectory",
  file: "isFile"
};
function checkType(type) {
  if (Object.hasOwnProperty.call(typeMappings, type)) {
    return;
  }
  throw new Error(`Invalid type specified: ${type}`);
}
var matchType = (type, stat) => stat[typeMappings[type]]();
var toPath = (urlOrPath) => urlOrPath instanceof URL ? _url.fileURLToPath.call(void 0, urlOrPath) : urlOrPath;
async function locatePath(paths, {
  cwd = _process2.default.cwd(),
  type = "file",
  allowSymlinks = true,
  concurrency,
  preserveOrder
} = {}) {
  checkType(type);
  cwd = toPath(cwd);
  const statFunction = allowSymlinks ? _fs3.promises.stat : _fs3.promises.lstat;
  return pLocate(paths, async (path_) => {
    try {
      const stat = await statFunction(_path3.default.resolve(cwd, path_));
      return matchType(type, stat);
    } catch (e3) {
      return false;
    }
  }, { concurrency, preserveOrder });
}
function locatePathSync(paths, {
  cwd = _process2.default.cwd(),
  type = "file",
  allowSymlinks = true
} = {}) {
  checkType(type);
  cwd = toPath(cwd);
  const statFunction = allowSymlinks ? _fs4.default.statSync : _fs4.default.lstatSync;
  for (const path_ of paths) {
    try {
      const stat = statFunction(_path3.default.resolve(cwd, path_), {
        throwIfNoEntry: false
      });
      if (!stat) {
        continue;
      }
      if (matchType(type, stat)) {
        return path_;
      }
    } catch (e4) {
    }
  }
}

// ../../node_modules/.pnpm/unicorn-magic@0.1.0/node_modules/unicorn-magic/node.js
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );

function toPath2(urlOrPath) {
  return urlOrPath instanceof URL ? _url.fileURLToPath.call(void 0, urlOrPath) : urlOrPath;
}

// ../../node_modules/.pnpm/path-exists@5.0.0/node_modules/path-exists/index.js
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );


// ../../node_modules/.pnpm/find-up@7.0.0/node_modules/find-up/index.js
var findUpStop = Symbol("findUpStop");
async function findUpMultiple(name, options = {}) {
  let directory = _path3.default.resolve(_nullishCoalesce(toPath2(options.cwd), () => ( "")));
  const { root } = _path3.default.parse(directory);
  const stopAt = _path3.default.resolve(directory, toPath2(_nullishCoalesce(options.stopAt, () => ( root))));
  const limit = _nullishCoalesce(options.limit, () => ( Number.POSITIVE_INFINITY));
  const paths = [name].flat();
  const runMatcher = async (locateOptions) => {
    if (typeof name !== "function") {
      return locatePath(paths, locateOptions);
    }
    const foundPath = await name(locateOptions.cwd);
    if (typeof foundPath === "string") {
      return locatePath([foundPath], locateOptions);
    }
    return foundPath;
  };
  const matches = [];
  while (true) {
    const foundPath = await runMatcher({ ...options, cwd: directory });
    if (foundPath === findUpStop) {
      break;
    }
    if (foundPath) {
      matches.push(_path3.default.resolve(directory, foundPath));
    }
    if (directory === stopAt || matches.length >= limit) {
      break;
    }
    directory = _path3.default.dirname(directory);
  }
  return matches;
}
function findUpMultipleSync(name, options = {}) {
  let directory = _path3.default.resolve(_nullishCoalesce(toPath2(options.cwd), () => ( "")));
  const { root } = _path3.default.parse(directory);
  const stopAt = _path3.default.resolve(directory, _nullishCoalesce(toPath2(options.stopAt), () => ( root)));
  const limit = _nullishCoalesce(options.limit, () => ( Number.POSITIVE_INFINITY));
  const paths = [name].flat();
  const runMatcher = (locateOptions) => {
    if (typeof name !== "function") {
      return locatePathSync(paths, locateOptions);
    }
    const foundPath = name(locateOptions.cwd);
    if (typeof foundPath === "string") {
      return locatePathSync([foundPath], locateOptions);
    }
    return foundPath;
  };
  const matches = [];
  while (true) {
    const foundPath = runMatcher({ ...options, cwd: directory });
    if (foundPath === findUpStop) {
      break;
    }
    if (foundPath) {
      matches.push(_path3.default.resolve(directory, foundPath));
    }
    if (directory === stopAt || matches.length >= limit) {
      break;
    }
    directory = _path3.default.dirname(directory);
  }
  return matches;
}
async function findUp(name, options = {}) {
  const matches = await findUpMultiple(name, { ...options, limit: 1 });
  return matches[0];
}
function findUpSync(name, options = {}) {
  const matches = findUpMultipleSync(name, { ...options, limit: 1 });
  return matches[0];
}

// src/PackageManager.ts
var _semver = require('semver');

var _cache, _cwd, _SLASHES, _PackageManager_instances, match_fn;
var _PackageManager = class _PackageManager {
  constructor(workspace) {
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _PackageManager_instances);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _cwd);
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _SLASHES, /* @__PURE__ */ new Set(["/", "\\"]));
    if (workspace) {
      _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _cwd, workspace);
    }
    return this;
  }
  set workspace(workspace) {
    _chunkNFUUQKWPcjs.__privateSet.call(void 0, this, _cwd, workspace);
  }
  get workspace() {
    return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _cwd);
  }
  normalizeDirectory(directory) {
    if (!_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _SLASHES).has(directory[directory.length - 1])) {
      return `${directory}/`;
    }
    return directory;
  }
  getLocation(path4) {
    let location = path4;
    if (_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _cwd)) {
      const require2 = _module2.default.createRequire(this.normalizeDirectory(_chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _cwd)));
      location = require2.resolve(path4);
    }
    return location;
  }
  async import(path4) {
    try {
      let location = this.getLocation(path4);
      if (_os2.default.platform() === "win32") {
        location = _url.pathToFileURL.call(void 0, location).href;
      }
      const module = await Promise.resolve().then(() => _interopRequireWildcard(require(location)));
      return _nullishCoalesce(_optionalChain([module, 'optionalAccess', _30 => _30.default]), () => ( module));
    } catch (e) {
      console.log(e);
      return void 0;
    }
  }
  async getPackageJSON() {
    const pkgPath = await findUp(["package.json"], {
      cwd: _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _cwd)
    });
    if (!pkgPath) {
      return void 0;
    }
    const json = await _fs.read.call(void 0, pkgPath);
    return JSON.parse(json);
  }
  getPackageJSONSync() {
    const pkgPath = findUpSync(["package.json"], {
      cwd: _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _cwd)
    });
    if (!pkgPath) {
      return void 0;
    }
    const json = _fs.readSync.call(void 0, pkgPath);
    return JSON.parse(json);
  }
  static setVersion(dependency, version) {
    _chunkNFUUQKWPcjs.__privateGet.call(void 0, _PackageManager, _cache)[dependency] = version;
  }
  async getVersion(dependency) {
    if (typeof dependency === "string" && _chunkNFUUQKWPcjs.__privateGet.call(void 0, _PackageManager, _cache)[dependency]) {
      return _chunkNFUUQKWPcjs.__privateGet.call(void 0, _PackageManager, _cache)[dependency];
    }
    const packageJSON = await this.getPackageJSON();
    if (!packageJSON) {
      return void 0;
    }
    return _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PackageManager_instances, match_fn).call(this, packageJSON, dependency);
  }
  getVersionSync(dependency) {
    if (typeof dependency === "string" && _chunkNFUUQKWPcjs.__privateGet.call(void 0, _PackageManager, _cache)[dependency]) {
      return _chunkNFUUQKWPcjs.__privateGet.call(void 0, _PackageManager, _cache)[dependency];
    }
    const packageJSON = this.getPackageJSONSync();
    if (!packageJSON) {
      return void 0;
    }
    return _chunkNFUUQKWPcjs.__privateMethod.call(void 0, this, _PackageManager_instances, match_fn).call(this, packageJSON, dependency);
  }
  async isValid(dependency, version) {
    const packageVersion = await this.getVersion(dependency);
    if (!packageVersion) {
      return false;
    }
    if (packageVersion === version) {
      return true;
    }
    const semVer = _semver.coerce.call(void 0, packageVersion);
    if (!semVer) {
      throw new Error(`${packageVersion} is not valid`);
    }
    return _semver.satisfies.call(void 0, semVer, version);
  }
  isValidSync(dependency, version) {
    const packageVersion = this.getVersionSync(dependency);
    if (!packageVersion) {
      return false;
    }
    const semVer = _semver.coerce.call(void 0, packageVersion);
    if (!semVer) {
      throw new Error(`${packageVersion} is not valid`);
    }
    return _semver.satisfies.call(void 0, semVer, version);
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
_chunkNFUUQKWPcjs.__privateAdd.call(void 0, _PackageManager, _cache, {});
var PackageManager = _PackageManager;













exports.FileManager = _chunkAT6SMJQWcjs.FileManager; exports.Generator = Generator; exports.PackageManager = PackageManager; exports.PluginManager = PluginManager; exports.PromiseManager = PromiseManager; exports.Warning = Warning; exports.build = build; exports.createPlugin = createPlugin; exports.default = build; exports.defineConfig = defineConfig; exports.isInputPath = isInputPath; exports.safeBuild = safeBuild;
//# sourceMappingURL=index.cjs.map