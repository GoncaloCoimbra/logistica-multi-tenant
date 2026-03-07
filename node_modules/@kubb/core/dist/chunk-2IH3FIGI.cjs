"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }


var _chunkKTZ6EAKPcjs = require('./chunk-KTZ6EAKP.cjs');





var _chunkNFUUQKWPcjs = require('./chunk-NFUUQKWP.cjs');

// src/utils/index.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );

// src/utils/FunctionParams.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var _items, _FunctionParams_static, orderItems_fn, addParams_fn;
var _FunctionParams = class _FunctionParams {
  constructor() {
    _chunkNFUUQKWPcjs.__privateAdd.call(void 0, this, _items, []);
    return this;
  }
  get items() {
    return _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _items).flat();
  }
  add(item) {
    if (!item) {
      return this;
    }
    if (Array.isArray(item)) {
      item.filter(Boolean).forEach((it) => _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _items).push(it));
      return this;
    }
    _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _items).push(item);
    return this;
  }
  static toObject(items) {
    let type = [];
    let name = [];
    const enabled = items.every((item) => item.enabled) ? _optionalChain([items, 'access', _ => _.at, 'call', _2 => _2(0), 'optionalAccess', _3 => _3.enabled]) : true;
    const required = _nullishCoalesce(items.every((item) => item.required), () => ( true));
    items.forEach((item) => {
      var _a, _b;
      name = _chunkNFUUQKWPcjs.__privateMethod.call(void 0, _a = _FunctionParams, _FunctionParams_static, addParams_fn).call(_a, name, { ...item, type: void 0 });
      if (items.some((item2) => item2.type)) {
        type = _chunkNFUUQKWPcjs.__privateMethod.call(void 0, _b = _FunctionParams, _FunctionParams_static, addParams_fn).call(_b, type, item);
      }
    });
    return {
      name: `{ ${name.join(", ")} }`,
      type: type.length ? `{ ${type.join("; ")} }` : void 0,
      enabled,
      required
    };
  }
  static toString(items) {
    var _a;
    const sortedData = _chunkNFUUQKWPcjs.__privateMethod.call(void 0, _a = _FunctionParams, _FunctionParams_static, orderItems_fn).call(_a, items);
    return sortedData.reduce((acc, item) => {
      var _a2, _b, _c;
      if (Array.isArray(item)) {
        if (item.length <= 0) {
          return acc;
        }
        const subItems = _chunkNFUUQKWPcjs.__privateMethod.call(void 0, _a2 = _FunctionParams, _FunctionParams_static, orderItems_fn).call(_a2, item);
        const objectItem = _FunctionParams.toObject(subItems);
        return _chunkNFUUQKWPcjs.__privateMethod.call(void 0, _b = _FunctionParams, _FunctionParams_static, addParams_fn).call(_b, acc, objectItem);
      }
      return _chunkNFUUQKWPcjs.__privateMethod.call(void 0, _c = _FunctionParams, _FunctionParams_static, addParams_fn).call(_c, acc, item);
    }, []).join(", ");
  }
  toObject() {
    var _a;
    const items = _chunkNFUUQKWPcjs.__privateMethod.call(void 0, _a = _FunctionParams, _FunctionParams_static, orderItems_fn).call(_a, _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _items)).flat();
    return _FunctionParams.toObject(items);
  }
  toString() {
    var _a;
    const items = _chunkNFUUQKWPcjs.__privateMethod.call(void 0, _a = _FunctionParams, _FunctionParams_static, orderItems_fn).call(_a, _chunkNFUUQKWPcjs.__privateGet.call(void 0, this, _items));
    return _FunctionParams.toString(items);
  }
};
_items = new WeakMap();
_FunctionParams_static = new WeakSet();
orderItems_fn = function(items) {
  return _chunkKTZ6EAKPcjs.orderBy.call(void 0, 
    items.filter(Boolean),
    [
      (v) => {
        if (Array.isArray(v)) {
          return void 0;
        }
        return !v.default;
      },
      (v) => {
        if (Array.isArray(v)) {
          return void 0;
        }
        return _nullishCoalesce(v.required, () => ( true));
      }
    ],
    ["desc", "desc"]
  );
};
addParams_fn = function(acc, item) {
  const { enabled = true, name, type, required = true, ...rest } = item;
  if (!enabled) {
    return acc;
  }
  if (!name) {
    acc.push(`${type}${rest.default ? ` = ${rest.default}` : ""}`);
    return acc;
  }
  const parameterName = name.startsWith("{") ? name : _chunkKTZ6EAKPcjs.camelCase.call(void 0, name);
  if (type) {
    if (required) {
      acc.push(`${parameterName}: ${type}${rest.default ? ` = ${rest.default}` : ""}`);
    } else {
      acc.push(`${parameterName}?: ${type}`);
    }
  } else {
    acc.push(`${parameterName}`);
  }
  return acc;
};
_chunkNFUUQKWPcjs.__privateAdd.call(void 0, _FunctionParams, _FunctionParams_static);
var FunctionParams = _FunctionParams;

// src/utils/promise.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
function isPromise(result) {
  return !!result && typeof _optionalChain([result, 'optionalAccess', _4 => _4.then]) === "function";
}
function isPromiseFulfilledResult(result) {
  return result.status === "fulfilled";
}
function isPromiseRejectedResult(result) {
  return result.status === "rejected";
}

// src/utils/renderTemplate.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
function renderTemplate(template, data = void 0) {
  if (!data || !Object.keys(data).length) {
    return template.replace(/{{(.*?)}}/g, "");
  }
  const matches = template.match(/{{(.*?)}}/g);
  return _optionalChain([matches, 'optionalAccess', _5 => _5.reduce, 'call', _6 => _6((prev, curr) => {
    const index = _optionalChain([curr, 'access', _7 => _7.split, 'call', _8 => _8(/{{|}}/), 'access', _9 => _9.filter, 'call', _10 => _10(Boolean), 'access', _11 => _11[0], 'optionalAccess', _12 => _12.trim, 'call', _13 => _13()]);
    if (index === void 0) {
      return prev;
    }
    const value = data[index];
    if (value === void 0) {
      return prev;
    }
    return prev.replace(curr, () => {
      if (typeof value === "boolean") {
        return `${value.toString()}` || "false";
      }
      return value || "";
    }).trim();
  }, template)]) || "";
}

// src/utils/timeout.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
async function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}

// src/utils/uniqueName.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
function getUniqueName(originalName, data) {
  let used = data[originalName] || 0;
  if (used) {
    data[originalName] = ++used;
    originalName += used;
  }
  data[originalName] = 1;
  return originalName;
}
function setUniqueName(originalName, data) {
  let used = data[originalName] || 0;
  if (used) {
    data[originalName] = ++used;
    return originalName;
  }
  data[originalName] = 1;
  return originalName;
}

// src/utils/URLPath.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var URLPath = class {
  constructor(path) {
    this.path = path;
    return this;
  }
  /**
   * Convert Swagger path to URLPath(syntax of Express)
   * @example /pet/{petId} => /pet/:petId
   */
  get URL() {
    return this.toURLPath();
  }
  get isURL() {
    try {
      const url = new URL(this.path);
      if (_optionalChain([url, 'optionalAccess', _14 => _14.href])) {
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  }
  /**
   * Convert Swagger path to template literals/ template strings(camelcase)
   * @example /pet/{petId} => `/pet/${petId}`
   * @example /account/monetary-accountID => `/account/${monetaryAccountId}`
   * @example /account/userID => `/account/${userId}`
   */
  get template() {
    return this.toTemplateString();
  }
  get object() {
    return this.toObject();
  }
  get params() {
    return this.getParams();
  }
  toObject({ type = "path", replacer, stringify } = {}) {
    const object = {
      url: type === "path" ? this.toURLPath() : this.toTemplateString(replacer),
      params: this.getParams()
    };
    if (stringify) {
      if (type === "template") {
        return JSON.stringify(object).replaceAll("'", "").replaceAll(`"`, "");
      }
      if (object.params) {
        return `{ url: '${object.url}', params: ${JSON.stringify(object.params).replaceAll("'", "").replaceAll(`"`, "")} }`;
      }
      return `{ url: '${object.url}' }`;
    }
    return object;
  }
  /**
   * Convert Swagger path to template literals/ template strings(camelcase)
   * @example /pet/{petId} => `/pet/${petId}`
   * @example /account/monetary-accountID => `/account/${monetaryAccountId}`
   * @example /account/userID => `/account/${userId}`
   */
  toTemplateString(replacer) {
    const regex = /{(\w|-)*}/g;
    const found = this.path.match(regex);
    let newPath = this.path.replaceAll("{", "${");
    if (found) {
      newPath = found.reduce((prev, curr) => {
        const pathParam = replacer ? replacer(_chunkKTZ6EAKPcjs.camelCase.call(void 0, curr)) : _chunkKTZ6EAKPcjs.camelCase.call(void 0, curr);
        const replacement = `\${${pathParam}}`;
        return prev.replace(curr, replacement);
      }, this.path);
    }
    return `\`${newPath}\``;
  }
  getParams(replacer) {
    const regex = /{(\w|-)*}/g;
    const found = this.path.match(regex);
    if (!found) {
      return void 0;
    }
    const params = {};
    found.forEach((item) => {
      item = item.replaceAll("{", "").replaceAll("}", "");
      const pathParam = replacer ? replacer(_chunkKTZ6EAKPcjs.camelCase.call(void 0, item)) : _chunkKTZ6EAKPcjs.camelCase.call(void 0, item);
      params[pathParam] = pathParam;
    }, this.path);
    return params;
  }
  /**
   * Convert Swagger path to URLPath(syntax of Express)
   * @example /pet/{petId} => /pet/:petId
   */
  toURLPath() {
    return this.path.replaceAll("{", ":").replaceAll("}", "");
  }
};

// src/utils/getParser.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
async function getParser(language) {
  let modulePromise;
  switch (language) {
    default:
      modulePromise = Promise.resolve().then(() => _interopRequireWildcard(require("@kubb/parser-ts")));
      break;
  }
  const module = await modulePromise;
  return module;
}












exports.FunctionParams = FunctionParams; exports.isPromise = isPromise; exports.isPromiseFulfilledResult = isPromiseFulfilledResult; exports.isPromiseRejectedResult = isPromiseRejectedResult; exports.renderTemplate = renderTemplate; exports.timeout = timeout; exports.getUniqueName = getUniqueName; exports.setUniqueName = setUniqueName; exports.URLPath = URLPath; exports.getParser = getParser;
//# sourceMappingURL=chunk-2IH3FIGI.cjs.map