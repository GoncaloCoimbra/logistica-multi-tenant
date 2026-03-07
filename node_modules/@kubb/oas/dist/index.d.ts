export { H as HttpMethods, O as Oas, S as SchemaObject, c as contentType } from './Oas-Br0yKhGF.js';
export { findSchemaDefinition, matchesMimeType } from 'oas/utils';
import * as OasTypes from 'oas/types';
import { ParameterObject, SchemaObject } from 'oas/types';
export { OasTypes };
export { HttpMethods as HttpMethod } from 'oas/types';
import { OpenAPIV3_1, OpenAPIV3 } from 'openapi-types';
export { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import { Call, Tuples, Objects, Booleans, Strings, Pipe, Fn } from 'hotscript';
import { Object as Object$1 } from 'ts-toolbelt';
import { JSONSchema, FromSchema } from 'json-schema-to-ts';
export { Operation } from 'oas/operation';
import 'oas';

declare function isOpenApiV3_1Document(doc: any): doc is OpenAPIV3_1.Document;
declare function isParameterObject(obj: ParameterObject | SchemaObject): obj is ParameterObject;
declare function isReference(obj?: unknown): obj is OpenAPIV3.ReferenceObject | OpenAPIV3_1.ReferenceObject;
declare function isRequired(schema?: SchemaObject): boolean;
declare function isOptional(schema?: SchemaObject): boolean;

type Checks$5 = {
    AllOFf: {
        allOf: any[];
    };
    Object: {
        type: 'object';
        properties: any;
    };
    Properties: {
        properties: any;
    };
    PropertiesRequired: {
        properties: Record<string, any>;
        required: string[];
    };
};
type FixAdditionalPropertiesForAllOf<T> = T extends Checks$5['AllOFf'] ? Omit<T, 'allOf'> & {
    allOf: Call<Tuples.Map<Objects.Omit<'additionalProperties'>>, T['allOf']>;
} : T;
type FixMissingAdditionalProperties<T> = T extends Checks$5['Object'] ? Omit<T, 'additionalProperties'> & {
    additionalProperties: false;
} : T;
type FixMissingTypeObject<T> = T extends Checks$5['Properties'] ? T & {
    type: 'object';
} : T;
type FixExtraRequiredFields<T> = T extends Checks$5['PropertiesRequired'] ? Omit<T, 'required'> & {
    required: Call<Tuples.Filter<Booleans.Extends<keyof T['properties']>>, T['required']>;
} : T;
type FixJSONSchema<T> = FixAdditionalPropertiesForAllOf<FixMissingAdditionalProperties<FixMissingTypeObject<FixExtraRequiredFields<T>>>>;
type Mutable<Type> = FixJSONSchema<{
    -readonly [Key in keyof Type]: Mutable<Type[Key]>;
}>;
type RefToPath<T extends string> = T extends `#/${infer Ref}` ? Call<Strings.Split<'/'>, Ref> : never;
type ResolveRef<TObj, TRef extends string> = {
    $id: TRef;
} & Object$1.Path<TObj, RefToPath<TRef>>;
type ResolveRefInObj<T, TBase> = T extends {
    $ref: infer Ref;
} ? (Ref extends string ? ResolveRef<TBase, Ref> : T) : T;
type ResolveRefsInObj<T, TBase = T> = {
    [K in keyof T]: ResolveRefsInObj<ResolveRefInObj<T[K], TBase>, TBase>;
};
type Infer<TOas> = Mutable<ResolveRefsInObj<TOas>>;

type Checks$4<TParamType = never> = {
    Required: {
        required: true;
    };
    Schemas: {
        schema: JSONSchema;
    };
    Enum: {
        type: JSONSchemaTypeName;
        enum?: any[];
    };
    Parameters: {
        in: string;
        required?: boolean;
    }[];
    SingleParameter: [{
        in: TParamType;
        required?: true;
    }];
    Responses: {
        responses: any;
    };
};
type PathMap<TOAS extends OasTypes.OASDocument> = TOAS['paths'];
interface ParamPropMap {
    query: 'query';
    path: 'params';
    header: 'headers';
}
type JSONSchemaTypeName = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null';
type ParamObj<TParameter extends {
    name: string;
}> = TParameter extends Checks$4['Required'] ? {
    [TName in TParameter['name']]: TParameter extends Checks$4['Schemas'] ? FromSchema<TParameter['schema']> : TParameter extends Checks$4['Enum'] ? FromSchema<{
        type: TParameter['type'];
        enum: TParameter['enum'];
    }> : unknown;
} : {
    [TName in TParameter['name']]?: TParameter extends Checks$4['Schemas'] ? FromSchema<TParameter['schema']> : TParameter extends Checks$4['Enum'] ? FromSchema<{
        type: TParameter['type'];
        enum: TParameter['enum'];
    }> : unknown;
};
interface ParamToRequestParam<TParameters extends Checks$4['Parameters']> extends Fn {
    return: this['arg0'] extends {
        name: string;
        in: infer TParamType;
    } ? TParameters extends Checks$4<TParamType>['SingleParameter'] ? {
        [TKey in TParamType extends keyof ParamPropMap ? ParamPropMap[TParamType] : never]: ParamObj<this['arg0']>;
    } : {
        [TKey in TParamType extends keyof ParamPropMap ? ParamPropMap[TParamType] : never]?: ParamObj<this['arg0']>;
    } : {};
}
type ParamMap<TParameters extends Checks$4['Parameters']> = Pipe<TParameters, [Tuples.Map<ParamToRequestParam<TParameters>>, Tuples.ToIntersection]>;
type MethodMap<TOAS extends OasTypes.OASDocument, TPath extends keyof PathMap<TOAS>> = PathMap<TOAS>[TPath];
type StatusMap<TOAS extends OasTypes.OASDocument, TPath extends keyof PathMap<TOAS>, TMethod extends keyof MethodMap<TOAS, TPath>> = MethodMap<TOAS, TPath>[TMethod] extends Checks$4['Responses'] ? MethodMap<TOAS, TPath>[TMethod]['responses'] : never;

type Checks$3<TName extends string | number | symbol = never> = {
    ModelWithSchemas: {
        components: {
            schemas: Record<string, JSONSchema>;
        };
    };
    ModelWithSchemasNamed: {
        components: {
            schemas: {
                [TModelName in TName]: JSONSchema;
            };
        };
    };
    ModelWithDefinitions: {
        definitions: Record<string, JSONSchema>;
    };
    ModelWithDefinitionsNamed: {
        definitions: {
            [TModelName in TName]: JSONSchema;
        };
    };
};
type Model<TOAS extends OasTypes.OASDocument, TName extends TOAS extends Checks$3['ModelWithSchemas'] ? keyof TOAS['components']['schemas'] : TOAS extends Checks$3['ModelWithDefinitions'] ? keyof TOAS['definitions'] : never> = TOAS extends Checks$3<TName>['ModelWithSchemasNamed'] ? FromSchema<TOAS['components']['schemas'][TName]> : TOAS extends Checks$3<TName>['ModelWithDefinitionsNamed'] ? FromSchema<TOAS['definitions'][TName]> : never;

type TupleToUnion<T> = T extends any[] ? T[number] : never;
type SplitByDelimiter<T extends string, D extends string> = T extends `${infer P}${D}${infer Q}` ? [P, ...SplitByDelimiter<Q, D>] : [T];

type Checks$2 = {
    Security: {
        security: {
            [key: string]: any;
        }[];
    };
    AuthParams: {
        Basic: {
            type: 'http';
            scheme: 'basic';
        } | {
            type: 'basic';
        };
        Bearer: {
            type: 'http';
            scheme: 'bearer';
        } | {
            type: 'bearer';
        };
        OAuth2: {
            type: 'oauth2';
        };
        ApiKey: {
            type: 'apiKey';
            in: 'header';
        };
    };
    AuthName: {
        Basic: `basic${string}`;
        Bearer: `bearer${string}`;
        OAuth2: `oauth${string}`;
    };
};
type SecuritySchemeName<T extends Checks$2['Security']> = Call<Tuples.Map<Objects.Keys>, T['security']>[number];
declare namespace AuthParams {
    type Basic<TSecurityScheme> = TSecurityScheme extends Checks$2['AuthParams']['Basic'] ? {
        headers: {
            /**
             * `Authorization` header is required for basic authentication
             * @see https://en.wikipedia.org/wiki/Basic_access_authentication
             *
             * It contains the word `Basic` followed by a space and a base64-encoded string `username:password`
             *
             * @example
             * ```
             * Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
             * ```
             */
            Authorization: `Basic ${string}`;
        };
    } : {};
    type Bearer<TSecurityScheme> = TSecurityScheme extends Checks$2['AuthParams']['Bearer'] ? {
        /**
         * `Authorization` header is required for bearer authentication
         * @see https://swagger.io/docs/specification/authentication/bearer-authentication/
         */
        headers: {
            /**
             * It contains the word `Bearer` followed by a space and the token
             *
             * @example
             * ```
             * Authorization: Bearer {token}
             * ```
             */
            Authorization: `Bearer ${string}`;
        };
    } : {};
    type ApiKey<TSecurityScheme> = TSecurityScheme extends Checks$2['AuthParams']['ApiKey'] & {
        name: infer TApiKeyHeaderName;
    } ? {
        headers: {
            [THeaderName in TApiKeyHeaderName extends string ? TApiKeyHeaderName : never]: string;
        };
    } : TSecurityScheme extends {
        type: 'apiKey';
        in: 'query';
        name: infer TApiKeyQueryName;
    } ? {
        query: {
            [TQueryName in TApiKeyQueryName extends string ? TApiKeyQueryName : never]: string;
        };
    } : {};
    type OAuth2<TSecurityScheme> = TSecurityScheme extends Checks$2['AuthParams']['OAuth2'] ? {
        /**
         * `Authorization` header is required for OAuth2.
         */
        headers: {
            /**
             * The access token string as issued by the authorization server.
             * @example `Authorization: Bearer <access_token>`
             */
            Authorization: `Bearer ${string}`;
        };
    } : {};
}
type OASSecurityParams<TSecurityScheme> = AuthParams.Basic<TSecurityScheme> & AuthParams.Bearer<TSecurityScheme> & AuthParams.ApiKey<TSecurityScheme> & AuthParams.OAuth2<TSecurityScheme>;
type SecurityParamsBySecurityRef<TOAS, TSecurityObj> = TSecurityObj extends Checks$2['Security'] ? TOAS extends {
    components: {
        securitySchemes: {
            [TSecuritySchemeNameKey in SecuritySchemeName<TSecurityObj> extends string ? SecuritySchemeName<TSecurityObj> : never]: infer TSecurityScheme;
        };
    };
} | {
    securityDefinitions: {
        [TSecuritySchemeNameKey in SecuritySchemeName<TSecurityObj> extends string ? SecuritySchemeName<TSecurityObj> : never]: infer TSecurityScheme;
    };
} ? OASSecurityParams<TSecurityScheme> : SecuritySchemeName<TSecurityObj> extends Checks$2['AuthName']['Basic'] ? AuthParams.Basic<{
    type: 'http';
    scheme: 'basic';
}> : SecuritySchemeName<TSecurityObj> extends Checks$2['AuthName']['Bearer'] ? AuthParams.Bearer<{
    type: 'http';
    scheme: 'bearer';
}> : SecuritySchemeName<TSecurityObj> extends Checks$2['AuthName']['OAuth2'] ? AuthParams.OAuth2<{
    type: 'oauth2';
}> : {} : {};

type Checks$1 = {
    RequestBodyJson: {
        requestBody: {
            content: {
                'application/json': {
                    schema: JSONSchema;
                };
            };
        };
    };
    RequestBodyFormData: {
        requestBody: {
            content: {
                'multipart/form-data': {
                    schema: JSONSchema;
                };
            };
        };
    };
    RequestBodyFormEncoded: {
        requestBody: {
            content: {
                'application/x-www-form-urlencoded': {
                    schema: JSONSchema;
                };
            };
        };
    };
    Parameters: {
        parameters: {
            name: string;
            in: string;
        }[];
    };
    PathBrackets: `${string}{${string}}${string}`;
    PathPattern: `${string}:${string}${string}`;
    Required: {
        required: true;
    };
};
type ExtractPathParamsWithPattern<TPath extends string> = Pipe<TPath, [
    Strings.Split<'/'>,
    Tuples.Filter<Strings.StartsWith<':'>>,
    Tuples.Map<Strings.Trim<':'>>,
    Tuples.ToUnion
]>;
type IsPathParameter<T extends string> = T extends `{${infer U}}` ? U : never;
type ExtractPathParameters<T extends any[]> = {
    [K in keyof T]: IsPathParameter<T[K]>;
};
type ExtractSegments<TPath extends string> = SplitByDelimiter<TPath, '/'>;
type ExtractSubSegments<T extends any[]> = {
    [K in keyof T]: SplitByDelimiter<T[K], ';'>;
};
type ExtractPathParamsWithBrackets<TPath extends string> = TupleToUnion<ExtractPathParameters<ExtractSubSegments<ExtractSegments<TPath>>[number]>>;
type RequestParams<TOAS extends OasTypes.OASDocument, TPath extends keyof PathMap<TOAS>, TMethod extends keyof MethodMap<TOAS, TPath>> = (MethodMap<TOAS, TPath>[TMethod] extends Checks$1['RequestBodyJson'] ? MethodMap<TOAS, TPath>[TMethod]['requestBody'] extends Checks$1['Required'] ? {
    /**
     * The request body in JSON is required for this request.
     *
     * The value of `json` will be stringified and sent as the request body with `Content-Type: application/json`.
     */
    json: FromSchema<MethodMap<TOAS, TPath>[TMethod]['requestBody']['content']['application/json']['schema']>;
} : {
    /**
     * The request body in JSON is optional for this request.
     *
     * The value of `json` will be stringified and sent as the request body with `Content-Type: application/json`.
     */
    json?: FromSchema<MethodMap<TOAS, TPath>[TMethod]['requestBody']['content']['application/json']['schema']>;
} : MethodMap<TOAS, TPath>[TMethod] extends Checks$1['RequestBodyFormData'] ? MethodMap<TOAS, TPath>[TMethod]['requestBody'] extends Checks$1['Required'] ? {
    /**
     * The request body in multipart/form-data is required for this request.
     *
     * The value of `formData` will be sent as the request body with `Content-Type: multipart/form-data`.
     */
    formData: FromSchema<MethodMap<TOAS, TPath>[TMethod]['requestBody']['content']['multipart/form-data']['schema']>;
} : {
    /**
     * The request body in multipart/form-data is optional for this request.
     *
     * The value of `formData` will be sent as the request body with `Content-Type: multipart/form-data`.
     */
    formData?: FromSchema<MethodMap<TOAS, TPath>[TMethod]['requestBody']['content']['multipart/form-data']['schema']>;
} : MethodMap<TOAS, TPath>[TMethod] extends Checks$1['RequestBodyFormEncoded'] ? MethodMap<TOAS, TPath>[TMethod]['requestBody'] extends Checks$1['Required'] ? {
    /**
     * The request body in application/x-www-form-urlencoded is required for this request.
     *
     * The value of `formUrlEncoded` will be sent as the request body with `Content-Type: application/x-www-form-urlencoded`.
     */
    formUrlEncoded: FromSchema<MethodMap<TOAS, TPath>[TMethod]['requestBody']['content']['application/x-www-form-urlencoded']['schema']>;
} : {
    /**
     * The request body in application/x-www-form-urlencoded is optional for this request.
     *
     * The value of `formUrlEncoded` will be sent as the request body with `Content-Type: application/x-www-form-urlencoded`.
     */
    formUrlEncoded?: FromSchema<MethodMap<TOAS, TPath>[TMethod]['requestBody']['content']['application/x-www-form-urlencoded']['schema']>;
} : {}) & (MethodMap<TOAS, TPath>[TMethod] extends Checks$1['Parameters'] ? ParamMap<MethodMap<TOAS, TPath>[TMethod]['parameters']> : {}) & // If there is any parameters defined in path but not in the parameters array, we should add them to the params
(TPath extends Checks$1['PathBrackets'] ? {
    /**
     * Parameters defined in the path are required for this request.
     *
     * The value of `params` will be used to replace the path parameters.
     *
     * For example if path is `/todos/{id}` and `params` is `{ id: '1' }`, the path will be `/todos/1`
     */
    params: Record<ExtractPathParamsWithBrackets<TPath>, string | number | bigint | boolean>;
} : {}) & (TPath extends Checks$1['PathPattern'] ? {
    /**
     * Parameters defined in the path are required for this request.
     *
     * The value of `params` will be used to replace the path parameters.
     *
     * For example if path is `/todos/:id` and `params` is `{ id: '1' }`, the path will be `/todos/1`.
     */
    params: Record<ExtractPathParamsWithPattern<TPath>, string | number | bigint | boolean>;
} : {}) & // Respect security definitions in path object
SecurityParamsBySecurityRef<TOAS, MethodMap<TOAS, TPath>[TMethod]> & // Respect global security definitions
SecurityParamsBySecurityRef<TOAS, TOAS>;

type Checks = {
    Content: {
        content: any;
    };
};
type ResponseSchemas<TOAS extends OasTypes.OASDocument, TPath extends keyof PathMap<TOAS>, TMethod extends keyof MethodMap<TOAS, TPath>, TStatus extends keyof StatusMap<TOAS, TPath, TMethod>> = StatusMap<TOAS, TPath, TMethod>[TStatus]['content'];
type JSONResponseSchema<TOAS extends OasTypes.OASDocument, TPath extends keyof PathMap<TOAS>, TMethod extends keyof MethodMap<TOAS, TPath>, TStatus extends keyof StatusMap<TOAS, TPath, TMethod>> = StatusMap<TOAS, TPath, TMethod>[TStatus] extends Checks['Content'] ? ResponseSchemas<TOAS, TPath, TMethod, TStatus>[keyof ResponseSchemas<TOAS, TPath, TMethod, TStatus>]['schema'] : StatusMap<TOAS, TPath, TMethod>[TStatus]['schema'];
type Response<TOAS extends OasTypes.OASDocument, TPath extends keyof PathMap<TOAS>, TMethod extends keyof MethodMap<TOAS, TPath>, TStatusCode extends keyof StatusMap<TOAS, TPath, TMethod> = 200> = FromSchema<JSONResponseSchema<TOAS, TPath, TMethod, TStatusCode>>;

export { type Infer, type Model, type RequestParams, type Response, isOpenApiV3_1Document, isOptional, isParameterObject, isReference, isRequired };
