import {
  camelCase,
  orderBy
} from "./chunk-4X5FFJPJ.js";
import {
  __privateAdd,
  __privateGet,
  __privateMethod
} from "./chunk-HMLY7DHA.js";

// src/utils/FunctionParams.ts
var _items, _FunctionParams_static, orderItems_fn, addParams_fn;
var _FunctionParams = class _FunctionParams {
  constructor() {
    __privateAdd(this, _items, []);
    return this;
  }
  get items() {
    return __privateGet(this, _items).flat();
  }
  add(item) {
    if (!item) {
      return this;
    }
    if (Array.isArray(item)) {
      item.filter(Boolean).forEach((it) => __privateGet(this, _items).push(it));
      return this;
    }
    __privateGet(this, _items).push(item);
    return this;
  }
  static toObject(items) {
    let type = [];
    let name = [];
    const enabled = items.every((item) => item.enabled) ? items.at(0)?.enabled : true;
    const required = items.every((item) => item.required) ?? true;
    items.forEach((item) => {
      var _a, _b;
      name = __privateMethod(_a = _FunctionParams, _FunctionParams_static, addParams_fn).call(_a, name, { ...item, type: void 0 });
      if (items.some((item2) => item2.type)) {
        type = __privateMethod(_b = _FunctionParams, _FunctionParams_static, addParams_fn).call(_b, type, item);
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
    const sortedData = __privateMethod(_a = _FunctionParams, _FunctionParams_static, orderItems_fn).call(_a, items);
    return sortedData.reduce((acc, item) => {
      var _a2, _b, _c;
      if (Array.isArray(item)) {
        if (item.length <= 0) {
          return acc;
        }
        const subItems = __privateMethod(_a2 = _FunctionParams, _FunctionParams_static, orderItems_fn).call(_a2, item);
        const objectItem = _FunctionParams.toObject(subItems);
        return __privateMethod(_b = _FunctionParams, _FunctionParams_static, addParams_fn).call(_b, acc, objectItem);
      }
      return __privateMethod(_c = _FunctionParams, _FunctionParams_static, addParams_fn).call(_c, acc, item);
    }, []).join(", ");
  }
  toObject() {
    var _a;
    const items = __privateMethod(_a = _FunctionParams, _FunctionParams_static, orderItems_fn).call(_a, __privateGet(this, _items)).flat();
    return _FunctionParams.toObject(items);
  }
  toString() {
    var _a;
    const items = __privateMethod(_a = _FunctionParams, _FunctionParams_static, orderItems_fn).call(_a, __privateGet(this, _items));
    return _FunctionParams.toString(items);
  }
};
_items = new WeakMap();
_FunctionParams_static = new WeakSet();
orderItems_fn = function(items) {
  return orderBy(
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
        return v.required ?? true;
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
  const parameterName = name.startsWith("{") ? name : camelCase(name);
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
__privateAdd(_FunctionParams, _FunctionParams_static);
var FunctionParams = _FunctionParams;

// src/utils/promise.ts
function isPromise(result) {
  return !!result && typeof result?.then === "function";
}
function isPromiseFulfilledResult(result) {
  return result.status === "fulfilled";
}
function isPromiseRejectedResult(result) {
  return result.status === "rejected";
}

// src/utils/renderTemplate.ts
function renderTemplate(template, data = void 0) {
  if (!data || !Object.keys(data).length) {
    return template.replace(/{{(.*?)}}/g, "");
  }
  const matches = template.match(/{{(.*?)}}/g);
  return matches?.reduce((prev, curr) => {
    const index = curr.split(/{{|}}/).filter(Boolean)[0]?.trim();
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
  }, template) || "";
}

// src/utils/timeout.ts
async function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}

// src/utils/uniqueName.ts
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
      if (url?.href) {
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
        const pathParam = replacer ? replacer(camelCase(curr)) : camelCase(curr);
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
      const pathParam = replacer ? replacer(camelCase(item)) : camelCase(item);
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
async function getParser(language) {
  let modulePromise;
  switch (language) {
    default:
      modulePromise = import("@kubb/parser-ts");
      break;
  }
  const module = await modulePromise;
  return module;
}

export {
  FunctionParams,
  isPromise,
  isPromiseFulfilledResult,
  isPromiseRejectedResult,
  renderTemplate,
  timeout,
  getUniqueName,
  setUniqueName,
  URLPath,
  getParser
};
//# sourceMappingURL=chunk-5JZNFPUP.js.map