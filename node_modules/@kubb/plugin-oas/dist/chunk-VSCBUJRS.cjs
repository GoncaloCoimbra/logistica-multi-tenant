"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }






var _chunkH4D7FGDYcjs = require('./chunk-H4D7FGDY.cjs');

// src/SchemaMapper.ts
_chunkH4D7FGDYcjs.init_cjs_shims.call(void 0, );
var schemaKeywords = {
  any: "any",
  strict: "strict",
  unknown: "unknown",
  number: "number",
  integer: "integer",
  string: "string",
  boolean: "boolean",
  undefined: "undefined",
  nullable: "nullable",
  null: "null",
  nullish: "nullish",
  array: "array",
  tuple: "tuple",
  enum: "enum",
  union: "union",
  datetime: "datetime",
  date: "date",
  email: "email",
  uuid: "uuid",
  url: "url",
  /* intersection */
  default: "default",
  const: "const",
  and: "and",
  describe: "describe",
  min: "min",
  max: "max",
  optional: "optional",
  readOnly: "readOnly",
  writeOnly: "writeOnly",
  // custom ones
  object: "object",
  ref: "ref",
  matches: "matches",
  firstName: "firstName",
  lastName: "lastName",
  password: "password",
  phone: "phone",
  blob: "blob",
  deprecated: "deprecated",
  example: "example",
  schema: "schema",
  catchall: "catchall",
  time: "time",
  name: "name"
};
function isKeyword(meta, keyword) {
  return meta.keyword === keyword;
}

// src/SchemaGenerator.ts
_chunkH4D7FGDYcjs.init_cjs_shims.call(void 0, );
var _core = require('@kubb/core');
var _transformers = require('@kubb/core/transformers'); var _transformers2 = _interopRequireDefault(_transformers);
var _utils = require('@kubb/core/utils');
var _oas = require('@kubb/oas');
var _remeda = require('remeda');
var _usedAliasNames, _SchemaGenerator_instances, getUsedEnumNames_fn, getOptions_fn, getUnknownReturn_fn, parseProperties_fn, getRefAlias_fn, getParsedSchemaObject_fn, parseSchemaObject_fn;
var _SchemaGenerator = class _SchemaGenerator extends _core.Generator {
  constructor() {
    super(...arguments);
    _chunkH4D7FGDYcjs.__privateAdd.call(void 0, this, _SchemaGenerator_instances);
    // Collect the types of all referenced schemas, so we can export them later
    this.refs = {};
    // Keep track of already used type aliases
    _chunkH4D7FGDYcjs.__privateAdd.call(void 0, this, _usedAliasNames, {});
  }
  /**
   * Creates a type node from a given schema.
   * Delegates to getBaseTypeFromSchema internally and
   * optionally adds a union with null.
   */
  parse(props) {
    const options = _chunkH4D7FGDYcjs.__privateMethod.call(void 0, this, _SchemaGenerator_instances, getOptions_fn).call(this, props);
    const defaultSchemas = _chunkH4D7FGDYcjs.__privateMethod.call(void 0, this, _SchemaGenerator_instances, parseSchemaObject_fn).call(this, props);
    const schemas = _optionalChain([options, 'access', _ => _.transformers, 'optionalAccess', _2 => _2.schema, 'optionalCall', _3 => _3(props, defaultSchemas)]) || defaultSchemas || [];
    return _remeda.uniqueWith.call(void 0, schemas, _remeda.isDeepEqual);
  }
  deepSearch(tree, keyword) {
    return _SchemaGenerator.deepSearch(tree, keyword);
  }
  find(tree, keyword) {
    return _SchemaGenerator.find(tree, keyword);
  }
  static deepSearch(tree, keyword) {
    const foundItems = [];
    _optionalChain([tree, 'optionalAccess', _4 => _4.forEach, 'call', _5 => _5((schema) => {
      if (schema.keyword === keyword) {
        foundItems.push(schema);
      }
      if (schema.keyword === schemaKeywords.object) {
        const subItem = schema;
        Object.values(_optionalChain([subItem, 'access', _6 => _6.args, 'optionalAccess', _7 => _7.properties]) || {}).forEach((entrySchema) => {
          foundItems.push(..._SchemaGenerator.deepSearch(entrySchema, keyword));
        });
        Object.values(_optionalChain([subItem, 'access', _8 => _8.args, 'optionalAccess', _9 => _9.additionalProperties]) || {}).forEach((entrySchema) => {
          foundItems.push(..._SchemaGenerator.deepSearch([entrySchema], keyword));
        });
      }
      if (schema.keyword === schemaKeywords.array) {
        const subItem = schema;
        subItem.args.items.forEach((entrySchema) => {
          foundItems.push(..._SchemaGenerator.deepSearch([entrySchema], keyword));
        });
      }
      if (schema.keyword === schemaKeywords.and) {
        const subItem = schema;
        subItem.args.forEach((entrySchema) => {
          foundItems.push(..._SchemaGenerator.deepSearch([entrySchema], keyword));
        });
      }
      if (schema.keyword === schemaKeywords.tuple) {
        const subItem = schema;
        subItem.args.items.forEach((entrySchema) => {
          foundItems.push(..._SchemaGenerator.deepSearch([entrySchema], keyword));
        });
      }
      if (schema.keyword === schemaKeywords.union) {
        const subItem = schema;
        subItem.args.forEach((entrySchema) => {
          foundItems.push(..._SchemaGenerator.deepSearch([entrySchema], keyword));
        });
      }
    })]);
    return foundItems;
  }
  static findInObject(tree, keyword) {
    let foundItem = void 0;
    _optionalChain([tree, 'optionalAccess', _10 => _10.forEach, 'call', _11 => _11((schema) => {
      if (!foundItem && schema.keyword === keyword) {
        foundItem = schema;
      }
      if (schema.keyword === schemaKeywords.object) {
        const subItem = schema;
        Object.values(_optionalChain([subItem, 'access', _12 => _12.args, 'optionalAccess', _13 => _13.properties]) || {}).forEach((entrySchema) => {
          if (!foundItem) {
            foundItem = _SchemaGenerator.find(entrySchema, keyword);
          }
        });
        Object.values(_optionalChain([subItem, 'access', _14 => _14.args, 'optionalAccess', _15 => _15.additionalProperties]) || {}).forEach((entrySchema) => {
          if (!foundItem) {
            foundItem = _SchemaGenerator.find([entrySchema], keyword);
          }
        });
      }
    })]);
    return foundItem;
  }
  static find(tree, keyword) {
    let foundItem = void 0;
    _optionalChain([tree, 'optionalAccess', _16 => _16.forEach, 'call', _17 => _17((schema) => {
      if (!foundItem && schema.keyword === keyword) {
        foundItem = schema;
      }
      if (schema.keyword === schemaKeywords.array) {
        const subItem = schema;
        subItem.args.items.forEach((entrySchema) => {
          if (!foundItem) {
            foundItem = _SchemaGenerator.find([entrySchema], keyword);
          }
        });
      }
      if (schema.keyword === schemaKeywords.and) {
        const subItem = schema;
        subItem.args.forEach((entrySchema) => {
          if (!foundItem) {
            foundItem = _SchemaGenerator.find([entrySchema], keyword);
          }
        });
      }
      if (schema.keyword === schemaKeywords.tuple) {
        const subItem = schema;
        subItem.args.items.forEach((entrySchema) => {
          if (!foundItem) {
            foundItem = _SchemaGenerator.find([entrySchema], keyword);
          }
        });
      }
      if (schema.keyword === schemaKeywords.union) {
        const subItem = schema;
        subItem.args.forEach((entrySchema) => {
          if (!foundItem) {
            foundItem = _SchemaGenerator.find([entrySchema], keyword);
          }
        });
      }
    })]);
    return foundItem;
  }
  async build() {
    const { oas, contentType, include } = this.context;
    oas.resolveDiscriminators();
    const schemas = _chunkH4D7FGDYcjs.getSchemas.call(void 0, { oas, contentType, includes: include });
    const promises = Object.entries(schemas).reduce((acc, [name, schema]) => {
      const options = _chunkH4D7FGDYcjs.__privateMethod.call(void 0, this, _SchemaGenerator_instances, getOptions_fn).call(this, { name });
      const promiseOperation = this.schema.call(this, name, schema, {
        ...this.options,
        ...options
      });
      if (promiseOperation) {
        acc.push(promiseOperation);
      }
      return acc;
    }, []);
    const files = await Promise.all(promises);
    return files.flat().filter(Boolean);
  }
};
_usedAliasNames = new WeakMap();
_SchemaGenerator_instances = new WeakSet();
getUsedEnumNames_fn = function(props) {
  const options = _chunkH4D7FGDYcjs.__privateMethod.call(void 0, this, _SchemaGenerator_instances, getOptions_fn).call(this, props);
  return options.usedEnumNames || {};
};
getOptions_fn = function({ name }) {
  const { override = [] } = this.context;
  return {
    ...this.options,
    ..._optionalChain([override, 'access', _18 => _18.find, 'call', _19 => _19(({ pattern, type }) => {
      if (name && type === "schemaName") {
        return !!name.match(pattern);
      }
      return false;
    }), 'optionalAccess', _20 => _20.options]) || {}
  };
};
getUnknownReturn_fn = function(props) {
  const options = _chunkH4D7FGDYcjs.__privateMethod.call(void 0, this, _SchemaGenerator_instances, getOptions_fn).call(this, props);
  if (options.unknownType === "any") {
    return schemaKeywords.any;
  }
  return schemaKeywords.unknown;
};
/**
 * Recursively creates a type literal with the given props.
 */
parseProperties_fn = function({ schema, name }) {
  const properties = _optionalChain([schema, 'optionalAccess', _21 => _21.properties]) || {};
  const additionalProperties = _optionalChain([schema, 'optionalAccess', _22 => _22.additionalProperties]);
  const required = _optionalChain([schema, 'optionalAccess', _23 => _23.required]);
  const propertiesSchemas = Object.keys(properties).map((propertyName) => {
    const validationFunctions = [];
    const propertySchema = properties[propertyName];
    const isRequired = Array.isArray(required) ? _optionalChain([required, 'optionalAccess', _24 => _24.includes, 'call', _25 => _25(propertyName)]) : !!required;
    const nullable = _nullishCoalesce(_nullishCoalesce(propertySchema.nullable, () => ( propertySchema["x-nullable"])), () => ( false));
    validationFunctions.push(...this.parse({ schema: propertySchema, name: propertyName, parentName: name }));
    validationFunctions.push({
      keyword: schemaKeywords.name,
      args: propertyName
    });
    if (!isRequired && nullable) {
      validationFunctions.push({ keyword: schemaKeywords.nullish });
    } else if (!isRequired) {
      validationFunctions.push({ keyword: schemaKeywords.optional });
    }
    return {
      [propertyName]: validationFunctions
    };
  }).reduce((acc, curr) => ({ ...acc, ...curr }), {});
  let additionalPropertiesSchemas = [];
  if (additionalProperties) {
    additionalPropertiesSchemas = additionalProperties === true || !Object.keys(additionalProperties).length ? [{ keyword: _chunkH4D7FGDYcjs.__privateMethod.call(void 0, this, _SchemaGenerator_instances, getUnknownReturn_fn).call(this, { schema, name }) }] : this.parse({ schema: additionalProperties, parentName: name });
  }
  return [
    {
      keyword: schemaKeywords.object,
      args: {
        properties: propertiesSchemas,
        additionalProperties: additionalPropertiesSchemas
      }
    }
  ];
};
/**
 * Create a type alias for the schema referenced by the given ReferenceObject
 */
getRefAlias_fn = function(obj) {
  const { $ref } = obj;
  let ref = this.refs[$ref];
  const originalName = _utils.getUniqueName.call(void 0, $ref.replace(/.+\//, ""), _chunkH4D7FGDYcjs.__privateGet.call(void 0, this, _usedAliasNames));
  const propertyName = this.context.pluginManager.resolveName({
    name: originalName,
    pluginKey: this.context.plugin.key,
    type: "function"
  });
  if (ref) {
    return [
      {
        keyword: schemaKeywords.ref,
        args: { name: ref.propertyName, path: ref.path }
      }
    ];
  }
  const fileName = this.context.pluginManager.resolveName({
    name: originalName,
    pluginKey: this.context.plugin.key,
    type: "file"
  });
  const file = this.context.pluginManager.getFile({
    name: fileName,
    pluginKey: this.context.plugin.key,
    extName: ".ts"
  });
  ref = this.refs[$ref] = {
    propertyName,
    originalName,
    path: file.path
  };
  return [
    {
      keyword: schemaKeywords.ref,
      args: { name: ref.propertyName, path: _optionalChain([ref, 'optionalAccess', _26 => _26.path]) }
    }
  ];
};
getParsedSchemaObject_fn = function(schema) {
  const parsedSchema = _chunkH4D7FGDYcjs.getSchemaFactory.call(void 0, this.context.oas)(schema);
  return parsedSchema;
};
/**
 * This is the very core of the OpenAPI to TS conversion - it takes a
 * schema and returns the appropriate type.
 */
parseSchemaObject_fn = function({ schema: _schema, name, parentName }) {
  const options = _chunkH4D7FGDYcjs.__privateMethod.call(void 0, this, _SchemaGenerator_instances, getOptions_fn).call(this, { schema: _schema, name });
  const unknownReturn = _chunkH4D7FGDYcjs.__privateMethod.call(void 0, this, _SchemaGenerator_instances, getUnknownReturn_fn).call(this, { schema: _schema, name });
  const { schema, version } = _chunkH4D7FGDYcjs.__privateMethod.call(void 0, this, _SchemaGenerator_instances, getParsedSchemaObject_fn).call(this, _schema);
  if (!schema) {
    return [{ keyword: unknownReturn }];
  }
  const baseItems = [
    {
      keyword: schemaKeywords.schema,
      args: {
        type: schema.type,
        format: schema.format
      }
    }
  ];
  const min = _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(schema.minimum, () => ( schema.minLength)), () => ( schema.minItems)), () => ( void 0));
  const max = _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(schema.maximum, () => ( schema.maxLength)), () => ( schema.maxItems)), () => ( void 0));
  const nullable = _nullishCoalesce(_nullishCoalesce(schema.nullable, () => ( schema["x-nullable"])), () => ( false));
  if (schema.default !== void 0 && !Array.isArray(schema.default)) {
    if (typeof schema.default === "string") {
      baseItems.push({
        keyword: schemaKeywords.default,
        args: _transformers2.default.stringify(schema.default)
      });
    } else if (typeof schema.default === "boolean") {
      baseItems.push({
        keyword: schemaKeywords.default,
        args: _nullishCoalesce(schema.default, () => ( false))
      });
    } else {
      baseItems.push({
        keyword: schemaKeywords.default,
        args: schema.default
      });
    }
  }
  if (schema.description) {
    baseItems.push({
      keyword: schemaKeywords.describe,
      args: schema.description
    });
  }
  if (schema.pattern) {
    baseItems.unshift({
      keyword: schemaKeywords.matches,
      args: schema.pattern
    });
  }
  if (max !== void 0) {
    baseItems.unshift({ keyword: schemaKeywords.max, args: max });
  }
  if (min !== void 0) {
    baseItems.unshift({ keyword: schemaKeywords.min, args: min });
  }
  if (nullable) {
    baseItems.push({ keyword: schemaKeywords.nullable });
  }
  if (schema.type && Array.isArray(schema.type)) {
    const [_schema2, nullable2] = schema.type;
    if (nullable2 === "null") {
      baseItems.push({ keyword: schemaKeywords.nullable });
    }
  }
  if (schema.readOnly) {
    baseItems.push({ keyword: schemaKeywords.readOnly });
  }
  if (schema.writeOnly) {
    baseItems.push({ keyword: schemaKeywords.writeOnly });
  }
  if (_oas.isReference.call(void 0, schema)) {
    return [
      ..._chunkH4D7FGDYcjs.__privateMethod.call(void 0, this, _SchemaGenerator_instances, getRefAlias_fn).call(this, schema),
      nullable && { keyword: schemaKeywords.nullable },
      schema.readOnly && { keyword: schemaKeywords.readOnly },
      schema.writeOnly && { keyword: schemaKeywords.writeOnly },
      {
        keyword: schemaKeywords.schema,
        args: {
          type: schema.type,
          format: schema.format
        }
      }
    ].filter(Boolean);
  }
  if (schema.oneOf) {
    const schemaWithoutOneOf = { ...schema, oneOf: void 0 };
    const union = {
      keyword: schemaKeywords.union,
      args: schema.oneOf.map((item) => {
        return item && this.parse({ schema: item, name, parentName })[0];
      }).filter(Boolean).filter((item) => {
        return item && item.keyword !== unknownReturn;
      })
    };
    if (schemaWithoutOneOf.properties) {
      const propertySchemas = this.parse({ schema: schemaWithoutOneOf, name, parentName });
      return [
        {
          ...union,
          args: union.args.map((arg) => {
            return {
              keyword: schemaKeywords.and,
              args: [arg, ...propertySchemas]
            };
          })
        },
        ...baseItems
      ];
    }
    return [union, ...baseItems];
  }
  if (schema.anyOf) {
    const schemaWithoutAnyOf = { ...schema, anyOf: void 0 };
    const union = {
      keyword: schemaKeywords.union,
      args: schema.anyOf.map((item) => {
        return item && this.parse({ schema: item, name, parentName })[0];
      }).filter(Boolean).filter((item) => {
        return item && item.keyword !== unknownReturn;
      }).map((item) => {
        if (isKeyword(item, schemaKeywords.object)) {
          return {
            ...item,
            args: {
              ...item.args,
              strict: true
            }
          };
        }
        return item;
      })
    };
    if (schemaWithoutAnyOf.properties) {
      return [...this.parse({ schema: schemaWithoutAnyOf, name, parentName }), union, ...baseItems];
    }
    return [union, ...baseItems];
  }
  if (schema.allOf) {
    const schemaWithoutAllOf = { ...schema, allOf: void 0 };
    const and = {
      keyword: schemaKeywords.and,
      args: schema.allOf.map((item) => {
        return item && this.parse({ schema: item, name, parentName })[0];
      }).filter(Boolean).filter((item) => {
        return item && item.keyword !== unknownReturn;
      })
    };
    if (schemaWithoutAllOf.properties) {
      return [
        {
          ...and,
          args: [...and.args || [], ...this.parse({ schema: schemaWithoutAllOf, name, parentName })]
        },
        ...baseItems
      ];
    }
    return [and, ...baseItems];
  }
  if (schema.enum) {
    const enumName = _utils.getUniqueName.call(void 0, _transformers.pascalCase.call(void 0, [parentName, name, options.enumSuffix].join(" ")), _chunkH4D7FGDYcjs.__privateMethod.call(void 0, this, _SchemaGenerator_instances, getUsedEnumNames_fn).call(this, { schema, name }));
    const typeName = this.context.pluginManager.resolveName({
      name: enumName,
      pluginKey: this.context.plugin.key,
      type: "type"
    });
    const nullableEnum = schema.enum.includes(null);
    if (nullableEnum) {
      baseItems.push({ keyword: schemaKeywords.nullable });
    }
    const filteredValues = schema.enum.filter((value) => value !== null);
    const extensionEnums = ["x-enumNames", "x-enum-varnames"].filter((extensionKey) => extensionKey in schema).map((extensionKey) => {
      return [
        {
          keyword: schemaKeywords.enum,
          args: {
            name,
            typeName,
            asConst: false,
            items: [...new Set(schema[extensionKey])].map((name2, index) => ({
              name: _transformers2.default.stringify(name2),
              value: _optionalChain([schema, 'access', _27 => _27.enum, 'optionalAccess', _28 => _28[index]]),
              format: _remeda.isNumber.call(void 0, _optionalChain([schema, 'access', _29 => _29.enum, 'optionalAccess', _30 => _30[index]])) ? "number" : "string"
            }))
          }
        },
        ...baseItems.filter(
          (item) => item.keyword !== schemaKeywords.min && item.keyword !== schemaKeywords.max && item.keyword !== schemaKeywords.matches
        )
      ];
    });
    if (schema.type === "number" || schema.type === "integer") {
      const enumNames = _optionalChain([extensionEnums, 'access', _31 => _31[0], 'optionalAccess', _32 => _32.find, 'call', _33 => _33((item) => isKeyword(item, schemaKeywords.enum))]);
      return [
        {
          keyword: schemaKeywords.enum,
          args: {
            name: enumName,
            typeName,
            asConst: true,
            items: _optionalChain([enumNames, 'optionalAccess', _34 => _34.args, 'optionalAccess', _35 => _35.items]) ? [...new Set(enumNames.args.items)].map(({ name: name2, value }) => ({
              name: name2,
              value,
              format: "number"
            })) : [...new Set(filteredValues)].map((value) => {
              return {
                name: value,
                value,
                format: "number"
              };
            })
          }
        },
        ...baseItems.filter((item) => item.keyword !== schemaKeywords.min && item.keyword !== schemaKeywords.max && item.keyword !== schemaKeywords.matches)
      ];
    }
    if (schema.type === "boolean") {
      const enumNames = _optionalChain([extensionEnums, 'access', _36 => _36[0], 'optionalAccess', _37 => _37.find, 'call', _38 => _38((item) => isKeyword(item, schemaKeywords.enum))]);
      return [
        {
          keyword: schemaKeywords.enum,
          args: {
            name: enumName,
            typeName,
            asConst: true,
            items: _optionalChain([enumNames, 'optionalAccess', _39 => _39.args, 'optionalAccess', _40 => _40.items]) ? [...new Set(enumNames.args.items)].map(({ name: name2, value }) => ({
              name: name2,
              value,
              format: "boolean"
            })) : [...new Set(filteredValues)].map((value) => {
              return {
                name: value,
                value,
                format: "boolean"
              };
            })
          }
        },
        ...baseItems.filter((item) => item.keyword !== schemaKeywords.matches)
      ];
    }
    if (extensionEnums.length > 0 && extensionEnums[0]) {
      return extensionEnums[0];
    }
    return [
      {
        keyword: schemaKeywords.enum,
        args: {
          name: enumName,
          typeName,
          asConst: false,
          items: [...new Set(filteredValues)].map((value) => ({
            name: _transformers2.default.stringify(value),
            value,
            format: _remeda.isNumber.call(void 0, value) ? "number" : "string"
          }))
        }
      },
      ...baseItems.filter((item) => item.keyword !== schemaKeywords.min && item.keyword !== schemaKeywords.max && item.keyword !== schemaKeywords.matches)
    ];
  }
  if ("prefixItems" in schema) {
    const prefixItems = schema.prefixItems;
    const min2 = _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(schema.minimum, () => ( schema.minLength)), () => ( schema.minItems)), () => ( void 0));
    const max2 = _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(schema.maximum, () => ( schema.maxLength)), () => ( schema.maxItems)), () => ( void 0));
    return [
      {
        keyword: schemaKeywords.tuple,
        args: {
          min: min2,
          max: max2,
          items: prefixItems.map((item) => {
            return this.parse({ schema: item, name, parentName })[0];
          }).filter(Boolean)
        }
      },
      ...baseItems.filter((item) => item.keyword !== schemaKeywords.min && item.keyword !== schemaKeywords.max)
    ];
  }
  if (version === "3.1" && "const" in schema) {
    if (schema["const"]) {
      return [
        {
          keyword: schemaKeywords.const,
          args: {
            name: schema["const"],
            format: typeof schema["const"] === "number" ? "number" : "string",
            value: schema["const"]
          }
        },
        ...baseItems
      ];
    }
    return [{ keyword: schemaKeywords.null }];
  }
  if (schema.format) {
    switch (schema.format) {
      case "binary":
        baseItems.push({ keyword: schemaKeywords.blob });
        return baseItems;
      case "date-time":
        if (options.dateType) {
          if (options.dateType === "date") {
            baseItems.unshift({ keyword: schemaKeywords.date, args: { type: "date" } });
            return baseItems;
          }
          if (options.dateType === "stringOffset") {
            baseItems.unshift({ keyword: schemaKeywords.datetime, args: { offset: true } });
            return baseItems;
          }
          if (options.dateType === "stringLocal") {
            baseItems.unshift({ keyword: schemaKeywords.datetime, args: { local: true } });
            return baseItems;
          }
          baseItems.unshift({ keyword: schemaKeywords.datetime, args: { offset: false } });
          return baseItems;
        }
        break;
      case "date":
        if (options.dateType) {
          if (options.dateType === "date") {
            baseItems.unshift({ keyword: schemaKeywords.date, args: { type: "date" } });
            return baseItems;
          }
          baseItems.unshift({ keyword: schemaKeywords.date, args: { type: "string" } });
          return baseItems;
        }
        break;
      case "time":
        if (options.dateType) {
          if (options.dateType === "date") {
            baseItems.unshift({ keyword: schemaKeywords.time, args: { type: "date" } });
            return baseItems;
          }
          baseItems.unshift({ keyword: schemaKeywords.time, args: { type: "string" } });
          return baseItems;
        }
        break;
      case "uuid":
        baseItems.unshift({ keyword: schemaKeywords.uuid });
        break;
      case "email":
      case "idn-email":
        baseItems.unshift({ keyword: schemaKeywords.email });
        break;
      case "uri":
      case "ipv4":
      case "ipv6":
      case "uri-reference":
      case "hostname":
      case "idn-hostname":
        baseItems.unshift({ keyword: schemaKeywords.url });
        break;
      // case 'duration':
      // case 'json-pointer':
      // case 'relative-json-pointer':
      default:
        break;
    }
  }
  if ("items" in schema || schema.type === "array") {
    const min2 = _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(schema.minimum, () => ( schema.minLength)), () => ( schema.minItems)), () => ( void 0));
    const max2 = _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(schema.maximum, () => ( schema.maxLength)), () => ( schema.maxItems)), () => ( void 0));
    const items = this.parse({ schema: "items" in schema ? schema.items : [], name, parentName });
    return [
      {
        keyword: schemaKeywords.array,
        args: {
          items,
          min: min2,
          max: max2
        }
      },
      ...baseItems.filter((item) => item.keyword !== schemaKeywords.min && item.keyword !== schemaKeywords.max)
    ];
  }
  if (schema.properties || schema.additionalProperties) {
    return [..._chunkH4D7FGDYcjs.__privateMethod.call(void 0, this, _SchemaGenerator_instances, parseProperties_fn).call(this, { schema, name }), ...baseItems];
  }
  if (schema.type) {
    if (Array.isArray(schema.type)) {
      const [type] = schema.type;
      return [
        ...this.parse({
          schema: {
            ...schema,
            type
          },
          name,
          parentName
        }),
        ...baseItems
      ].filter(Boolean);
    }
    if (!["boolean", "object", "number", "string", "integer", "null"].includes(schema.type)) {
      this.context.pluginManager.logger.emit("warning", `Schema type '${schema.type}' is not valid for schema ${parentName}.${name}`);
    }
    return [{ keyword: schema.type }, ...baseItems];
  }
  return [{ keyword: unknownReturn }];
};
var SchemaGenerator = _SchemaGenerator;





exports.schemaKeywords = schemaKeywords; exports.isKeyword = isKeyword; exports.SchemaGenerator = SchemaGenerator;
//# sourceMappingURL=chunk-VSCBUJRS.cjs.map