import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  getSchemaFactory,
  getSchemas,
  init_esm_shims
} from "./chunk-DW4XVEE4.js";

// src/SchemaMapper.ts
init_esm_shims();
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
init_esm_shims();
import { Generator } from "@kubb/core";
import transformers, { pascalCase } from "@kubb/core/transformers";
import { getUniqueName } from "@kubb/core/utils";
import { isReference } from "@kubb/oas";
import { isDeepEqual, isNumber, uniqueWith } from "remeda";
var _usedAliasNames, _SchemaGenerator_instances, getUsedEnumNames_fn, getOptions_fn, getUnknownReturn_fn, parseProperties_fn, getRefAlias_fn, getParsedSchemaObject_fn, parseSchemaObject_fn;
var _SchemaGenerator = class _SchemaGenerator extends Generator {
  constructor() {
    super(...arguments);
    __privateAdd(this, _SchemaGenerator_instances);
    // Collect the types of all referenced schemas, so we can export them later
    this.refs = {};
    // Keep track of already used type aliases
    __privateAdd(this, _usedAliasNames, {});
  }
  /**
   * Creates a type node from a given schema.
   * Delegates to getBaseTypeFromSchema internally and
   * optionally adds a union with null.
   */
  parse(props) {
    const options = __privateMethod(this, _SchemaGenerator_instances, getOptions_fn).call(this, props);
    const defaultSchemas = __privateMethod(this, _SchemaGenerator_instances, parseSchemaObject_fn).call(this, props);
    const schemas = options.transformers?.schema?.(props, defaultSchemas) || defaultSchemas || [];
    return uniqueWith(schemas, isDeepEqual);
  }
  deepSearch(tree, keyword) {
    return _SchemaGenerator.deepSearch(tree, keyword);
  }
  find(tree, keyword) {
    return _SchemaGenerator.find(tree, keyword);
  }
  static deepSearch(tree, keyword) {
    const foundItems = [];
    tree?.forEach((schema) => {
      if (schema.keyword === keyword) {
        foundItems.push(schema);
      }
      if (schema.keyword === schemaKeywords.object) {
        const subItem = schema;
        Object.values(subItem.args?.properties || {}).forEach((entrySchema) => {
          foundItems.push(..._SchemaGenerator.deepSearch(entrySchema, keyword));
        });
        Object.values(subItem.args?.additionalProperties || {}).forEach((entrySchema) => {
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
    });
    return foundItems;
  }
  static findInObject(tree, keyword) {
    let foundItem = void 0;
    tree?.forEach((schema) => {
      if (!foundItem && schema.keyword === keyword) {
        foundItem = schema;
      }
      if (schema.keyword === schemaKeywords.object) {
        const subItem = schema;
        Object.values(subItem.args?.properties || {}).forEach((entrySchema) => {
          if (!foundItem) {
            foundItem = _SchemaGenerator.find(entrySchema, keyword);
          }
        });
        Object.values(subItem.args?.additionalProperties || {}).forEach((entrySchema) => {
          if (!foundItem) {
            foundItem = _SchemaGenerator.find([entrySchema], keyword);
          }
        });
      }
    });
    return foundItem;
  }
  static find(tree, keyword) {
    let foundItem = void 0;
    tree?.forEach((schema) => {
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
    });
    return foundItem;
  }
  async build() {
    const { oas, contentType, include } = this.context;
    oas.resolveDiscriminators();
    const schemas = getSchemas({ oas, contentType, includes: include });
    const promises = Object.entries(schemas).reduce((acc, [name, schema]) => {
      const options = __privateMethod(this, _SchemaGenerator_instances, getOptions_fn).call(this, { name });
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
  const options = __privateMethod(this, _SchemaGenerator_instances, getOptions_fn).call(this, props);
  return options.usedEnumNames || {};
};
getOptions_fn = function({ name }) {
  const { override = [] } = this.context;
  return {
    ...this.options,
    ...override.find(({ pattern, type }) => {
      if (name && type === "schemaName") {
        return !!name.match(pattern);
      }
      return false;
    })?.options || {}
  };
};
getUnknownReturn_fn = function(props) {
  const options = __privateMethod(this, _SchemaGenerator_instances, getOptions_fn).call(this, props);
  if (options.unknownType === "any") {
    return schemaKeywords.any;
  }
  return schemaKeywords.unknown;
};
/**
 * Recursively creates a type literal with the given props.
 */
parseProperties_fn = function({ schema, name }) {
  const properties = schema?.properties || {};
  const additionalProperties = schema?.additionalProperties;
  const required = schema?.required;
  const propertiesSchemas = Object.keys(properties).map((propertyName) => {
    const validationFunctions = [];
    const propertySchema = properties[propertyName];
    const isRequired = Array.isArray(required) ? required?.includes(propertyName) : !!required;
    const nullable = propertySchema.nullable ?? propertySchema["x-nullable"] ?? false;
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
    additionalPropertiesSchemas = additionalProperties === true || !Object.keys(additionalProperties).length ? [{ keyword: __privateMethod(this, _SchemaGenerator_instances, getUnknownReturn_fn).call(this, { schema, name }) }] : this.parse({ schema: additionalProperties, parentName: name });
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
  const originalName = getUniqueName($ref.replace(/.+\//, ""), __privateGet(this, _usedAliasNames));
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
      args: { name: ref.propertyName, path: ref?.path }
    }
  ];
};
getParsedSchemaObject_fn = function(schema) {
  const parsedSchema = getSchemaFactory(this.context.oas)(schema);
  return parsedSchema;
};
/**
 * This is the very core of the OpenAPI to TS conversion - it takes a
 * schema and returns the appropriate type.
 */
parseSchemaObject_fn = function({ schema: _schema, name, parentName }) {
  const options = __privateMethod(this, _SchemaGenerator_instances, getOptions_fn).call(this, { schema: _schema, name });
  const unknownReturn = __privateMethod(this, _SchemaGenerator_instances, getUnknownReturn_fn).call(this, { schema: _schema, name });
  const { schema, version } = __privateMethod(this, _SchemaGenerator_instances, getParsedSchemaObject_fn).call(this, _schema);
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
  const min = schema.minimum ?? schema.minLength ?? schema.minItems ?? void 0;
  const max = schema.maximum ?? schema.maxLength ?? schema.maxItems ?? void 0;
  const nullable = schema.nullable ?? schema["x-nullable"] ?? false;
  if (schema.default !== void 0 && !Array.isArray(schema.default)) {
    if (typeof schema.default === "string") {
      baseItems.push({
        keyword: schemaKeywords.default,
        args: transformers.stringify(schema.default)
      });
    } else if (typeof schema.default === "boolean") {
      baseItems.push({
        keyword: schemaKeywords.default,
        args: schema.default ?? false
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
  if (isReference(schema)) {
    return [
      ...__privateMethod(this, _SchemaGenerator_instances, getRefAlias_fn).call(this, schema),
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
    const enumName = getUniqueName(pascalCase([parentName, name, options.enumSuffix].join(" ")), __privateMethod(this, _SchemaGenerator_instances, getUsedEnumNames_fn).call(this, { schema, name }));
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
              name: transformers.stringify(name2),
              value: schema.enum?.[index],
              format: isNumber(schema.enum?.[index]) ? "number" : "string"
            }))
          }
        },
        ...baseItems.filter(
          (item) => item.keyword !== schemaKeywords.min && item.keyword !== schemaKeywords.max && item.keyword !== schemaKeywords.matches
        )
      ];
    });
    if (schema.type === "number" || schema.type === "integer") {
      const enumNames = extensionEnums[0]?.find((item) => isKeyword(item, schemaKeywords.enum));
      return [
        {
          keyword: schemaKeywords.enum,
          args: {
            name: enumName,
            typeName,
            asConst: true,
            items: enumNames?.args?.items ? [...new Set(enumNames.args.items)].map(({ name: name2, value }) => ({
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
      const enumNames = extensionEnums[0]?.find((item) => isKeyword(item, schemaKeywords.enum));
      return [
        {
          keyword: schemaKeywords.enum,
          args: {
            name: enumName,
            typeName,
            asConst: true,
            items: enumNames?.args?.items ? [...new Set(enumNames.args.items)].map(({ name: name2, value }) => ({
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
            name: transformers.stringify(value),
            value,
            format: isNumber(value) ? "number" : "string"
          }))
        }
      },
      ...baseItems.filter((item) => item.keyword !== schemaKeywords.min && item.keyword !== schemaKeywords.max && item.keyword !== schemaKeywords.matches)
    ];
  }
  if ("prefixItems" in schema) {
    const prefixItems = schema.prefixItems;
    const min2 = schema.minimum ?? schema.minLength ?? schema.minItems ?? void 0;
    const max2 = schema.maximum ?? schema.maxLength ?? schema.maxItems ?? void 0;
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
    const min2 = schema.minimum ?? schema.minLength ?? schema.minItems ?? void 0;
    const max2 = schema.maximum ?? schema.maxLength ?? schema.maxItems ?? void 0;
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
    return [...__privateMethod(this, _SchemaGenerator_instances, parseProperties_fn).call(this, { schema, name }), ...baseItems];
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

export {
  schemaKeywords,
  isKeyword,
  SchemaGenerator
};
//# sourceMappingURL=chunk-IWUQTVK4.js.map