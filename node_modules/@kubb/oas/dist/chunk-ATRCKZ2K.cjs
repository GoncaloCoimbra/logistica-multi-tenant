"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// src/utils.ts
var _types = require('oas/types');
var _remeda = require('remeda');
function isOpenApiV2Document(doc) {
  return doc && _remeda.isPlainObject.call(void 0, doc) && !("openapi" in doc);
}
function isOpenApiV3_1Document(doc) {
  return doc && _remeda.isPlainObject.call(void 0, doc) && "openapi" in doc && doc.openapi.startsWith("3.1");
}
function isParameterObject(obj) {
  return obj && "in" in obj;
}
function isReference(obj) {
  return !!obj && _types.isRef.call(void 0, obj);
}
function isRequired(schema) {
  if (!schema) {
    return false;
  }
  return Array.isArray(schema.required) ? !!_optionalChain([schema, 'access', _ => _.required, 'optionalAccess', _2 => _2.length]) : !!schema.required;
}
function isOptional(schema) {
  return !isRequired(schema);
}

// src/Oas.ts
var _oas = require('oas'); var _oas2 = _interopRequireDefault(_oas);
var _oasnormalize = require('oas-normalize'); var _oasnormalize2 = _interopRequireDefault(_oasnormalize);
var _utils = require('oas/utils');
var _jsonpointer = require('jsonpointer'); var _jsonpointer2 = _interopRequireDefault(_jsonpointer);
var _options, _Oas_instances, getResponseBodyFactory_fn;
var Oas = class extends _oas2.default {
  constructor({ oas, user }, options = {}) {
    if (typeof oas === "string") {
      oas = JSON.parse(oas);
    }
    super(oas, user);
    __privateAdd(this, _Oas_instances);
    __privateAdd(this, _options, {});
    this.document = void 0;
    this.document = oas;
    __privateSet(this, _options, options);
  }
  get($ref) {
    const origRef = $ref;
    $ref = $ref.trim();
    if ($ref === "") {
      return false;
    }
    if ($ref.startsWith("#")) {
      $ref = globalThis.decodeURIComponent($ref.substring(1));
    } else {
      throw new Error(`Could not find a definition for ${origRef}.`);
    }
    const current = _jsonpointer2.default.get(this.api, $ref);
    if (!current) {
      throw new Error(`Could not find a definition for ${origRef}.`);
    }
    return current;
  }
  set($ref, value) {
    const origRef = $ref;
    $ref = $ref.trim();
    if ($ref === "") {
      return false;
    }
    if ($ref.startsWith("#")) {
      $ref = globalThis.decodeURIComponent($ref.substring(1));
    } else {
      throw new Error(`Could not find a definition for ${origRef}.`);
    }
    _jsonpointer2.default.set(this.api, $ref, value);
  }
  resolveDiscriminators() {
    const schemas = _optionalChain([this, 'access', _3 => _3.api, 'access', _4 => _4.components, 'optionalAccess', _5 => _5.schemas]) || {};
    Object.entries(schemas).forEach(([key, schemaObject]) => {
      if ("discriminator" in schemaObject) {
        const { mapping = {}, propertyName } = schemaObject.discriminator || {};
        Object.entries(mapping).forEach(([mappingKey, mappingValue]) => {
          if (mappingValue) {
            const childSchema = this.get(mappingValue);
            const property = _optionalChain([childSchema, 'access', _6 => _6.properties, 'optionalAccess', _7 => _7[propertyName]]);
            if (property) {
              childSchema.properties[propertyName] = {
                ...childSchema.properties[propertyName],
                enum: [..._nullishCoalesce(_optionalChain([property, 'optionalAccess', _8 => _8.enum, 'optionalAccess', _9 => _9.filter, 'call', _10 => _10((value) => value !== mappingKey)]), () => ( [])), mappingKey]
              };
              childSchema.required = [..._nullishCoalesce(childSchema.required, () => ( [])), propertyName];
              this.set(mappingValue, childSchema);
            }
          }
        });
      }
    });
  }
  dereferenceWithRef(schema) {
    if (isReference(schema)) {
      return {
        ...this.get(schema.$ref),
        $ref: schema.$ref
      };
    }
    return schema;
  }
  getResponseSchema(operation, statusCode) {
    if (operation.schema.responses) {
      Object.keys(operation.schema.responses).forEach((key) => {
        const schema2 = operation.schema.responses[key];
        const $ref = isReference(schema2) ? schema2.$ref : void 0;
        if (schema2 && $ref) {
          operation.schema.responses[key] = this.get($ref);
        }
      });
    }
    const getResponseBody = __privateMethod(this, _Oas_instances, getResponseBodyFactory_fn).call(this, operation.getResponseByStatusCode(statusCode));
    const { contentType } = __privateGet(this, _options);
    const responseBody = getResponseBody(contentType);
    if (responseBody === false) {
      return {};
    }
    const schema = Array.isArray(responseBody) ? responseBody[1].schema : responseBody.schema;
    if (!schema) {
      return {};
    }
    return this.dereferenceWithRef(schema);
  }
  getRequestSchema(operation) {
    const { contentType } = __privateGet(this, _options);
    if (operation.schema.requestBody) {
      operation.schema.requestBody = this.dereferenceWithRef(operation.schema.requestBody);
    }
    const requestBody = operation.getRequestBody(contentType);
    if (requestBody === false) {
      return void 0;
    }
    const schema = Array.isArray(requestBody) ? requestBody[1].schema : requestBody.schema;
    if (!schema) {
      return void 0;
    }
    return this.dereferenceWithRef(schema);
  }
  getParametersSchema(operation, inKey) {
    const { contentType = operation.getContentType() } = __privateGet(this, _options);
    const params = operation.getParameters().map((schema) => {
      return this.dereferenceWithRef(schema);
    }).filter((v) => v.in === inKey);
    if (!params.length) {
      return null;
    }
    return params.reduce(
      (schema, pathParameters) => {
        const property = _nullishCoalesce(_optionalChain([pathParameters, 'access', _11 => _11.content, 'optionalAccess', _12 => _12[contentType], 'optionalAccess', _13 => _13.schema]), () => ( pathParameters.schema));
        const required = [...schema.required || [], pathParameters.required ? pathParameters.name : void 0].filter(Boolean);
        return {
          ...schema,
          description: schema.description,
          deprecated: schema.deprecated,
          example: schema.example,
          required,
          properties: {
            ...schema.properties,
            [pathParameters.name]: {
              description: pathParameters.description,
              ...property
            }
          }
        };
      },
      { type: "object", required: [], properties: {} }
    );
  }
  async valdiate() {
    const oasNormalize = new (0, _oasnormalize2.default)(this.api, {
      enablePaths: true,
      colorizeErrors: true
    });
    await oasNormalize.validate({
      parser: {
        validate: {
          colorizeErrors: true,
          schema: false,
          spec: false
        }
      }
    });
  }
};
_options = new WeakMap();
_Oas_instances = new WeakSet();
/**
 * Oas does not have a getResponseBody(contentType)
 */
getResponseBodyFactory_fn = function(responseBody) {
  function hasResponseBody(res = responseBody) {
    return !!res;
  }
  return (contentType) => {
    if (!hasResponseBody(responseBody)) {
      return false;
    }
    if (isReference(responseBody)) {
      return false;
    }
    if (!responseBody.content) {
      return false;
    }
    if (contentType) {
      if (!(contentType in responseBody.content)) {
        return false;
      }
      return responseBody.content[contentType];
    }
    let availablecontentType = void 0;
    const contentTypes = Object.keys(responseBody.content);
    contentTypes.forEach((mt) => {
      if (!availablecontentType && _utils.matchesMimeType.json(mt)) {
        availablecontentType = mt;
      }
    });
    if (!availablecontentType) {
      contentTypes.forEach((mt) => {
        if (!availablecontentType) {
          availablecontentType = mt;
        }
      });
    }
    if (availablecontentType) {
      return [availablecontentType, responseBody.content[availablecontentType], ...responseBody.description ? [responseBody.description] : []];
    }
    return false;
  };
};









exports.isOpenApiV2Document = isOpenApiV2Document; exports.isOpenApiV3_1Document = isOpenApiV3_1Document; exports.isParameterObject = isParameterObject; exports.isReference = isReference; exports.isRequired = isRequired; exports.isOptional = isOptional; exports.Oas = Oas;
//# sourceMappingURL=chunk-ATRCKZ2K.cjs.map