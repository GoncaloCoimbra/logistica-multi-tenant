import ts from 'typescript';

declare const modifiers: {
    readonly async: ts.ModifierToken<ts.SyntaxKind.AsyncKeyword>;
    readonly export: ts.ModifierToken<ts.SyntaxKind.ExportKeyword>;
    readonly const: ts.ModifierToken<ts.SyntaxKind.ConstKeyword>;
    readonly static: ts.ModifierToken<ts.SyntaxKind.StaticKeyword>;
};
declare function createQuestionToken(token?: boolean | ts.QuestionToken): ts.PunctuationToken<ts.SyntaxKind.QuestionToken> | undefined;
declare function createIntersectionDeclaration({ nodes, withParentheses, }: {
    nodes: Array<ts.TypeNode>;
    withParentheses?: boolean;
}): ts.TypeNode | null;
/**
 * Minimum nodes length of 2
 * @example `string & number`
 */
declare function createTupleDeclaration({ nodes, withParentheses, }: {
    nodes: Array<ts.TypeNode>;
    withParentheses?: boolean;
}): ts.TypeNode | null;
declare function createArrayDeclaration({ nodes, }: {
    nodes: Array<ts.TypeNode>;
}): ts.TypeNode | null;
/**
 * Minimum nodes length of 2
 * @example `string | number`
 */
declare function createUnionDeclaration({ nodes, withParentheses, }: {
    nodes: Array<ts.TypeNode>;
    withParentheses?: boolean;
}): ts.TypeNode | null;
declare function createPropertySignature({ readOnly, modifiers, name, questionToken, type, }: {
    readOnly?: boolean;
    modifiers?: Array<ts.Modifier>;
    name: ts.PropertyName | string;
    questionToken?: ts.QuestionToken | boolean;
    type?: ts.TypeNode;
}): ts.PropertySignature;
declare function createParameterSignature(name: string | ts.BindingName, { modifiers, dotDotDotToken, questionToken, type, initializer, }: {
    decorators?: Array<ts.Decorator>;
    modifiers?: Array<ts.Modifier>;
    dotDotDotToken?: ts.DotDotDotToken;
    questionToken?: ts.QuestionToken | boolean;
    type?: ts.TypeNode;
    initializer?: ts.Expression;
}): ts.ParameterDeclaration;
declare function createJSDoc({ comments }: {
    comments: string[];
}): ts.JSDoc | null;
/**
 * @link https://github.com/microsoft/TypeScript/issues/44151
 */
declare function appendJSDocToNode<TNode extends ts.Node>({ node, comments, }: {
    node: TNode;
    comments: Array<string | undefined>;
}): TNode;
declare function createIndexSignature(type: ts.TypeNode, { modifiers, indexName, indexType, }?: {
    indexName?: string;
    indexType?: ts.TypeNode;
    decorators?: Array<ts.Decorator>;
    modifiers?: Array<ts.Modifier>;
}): ts.IndexSignatureDeclaration;
declare function createTypeAliasDeclaration({ modifiers, name, typeParameters, type, }: {
    modifiers?: Array<ts.Modifier>;
    name: string | ts.Identifier;
    typeParameters?: Array<ts.TypeParameterDeclaration>;
    type: ts.TypeNode;
}): ts.TypeAliasDeclaration;
declare function createNamespaceDeclaration({ statements, name, }: {
    name: string;
    statements: ts.Statement[];
}): ts.ModuleDeclaration;
/**
 * In { propertyName: string; name?: string } is `name` being used to make the type more unique when multiple same names are used.
 * @example `import { Pet as Cat } from './Pet'`
 */
declare function createImportDeclaration({ name, path, isTypeOnly, isNameSpace, }: {
    name: string | Array<string | {
        propertyName: string;
        name?: string;
    }>;
    path: string;
    isTypeOnly?: boolean;
    isNameSpace?: boolean;
}): ts.ImportDeclaration;
declare function createExportDeclaration({ path, asAlias, isTypeOnly, name, }: {
    path: string;
    asAlias?: boolean;
    isTypeOnly?: boolean;
    name?: string | Array<ts.Identifier | string>;
}): ts.ExportDeclaration;
declare function createEnumDeclaration({ type, name, typeName, enums, }: {
    /**
     * @default `'enum'`
     */
    type?: 'enum' | 'asConst' | 'asPascalConst' | 'constEnum' | 'literal';
    /**
     * Enum name in camelCase.
     */
    name: string;
    /**
     * Enum name in PascalCase.
     */
    typeName: string;
    enums: [key: string | number, value: string | number | boolean][];
}): ts.EnumDeclaration[] | (ts.TypeAliasDeclaration | ts.VariableStatement)[];
declare function createOmitDeclaration({ keys, type, nonNullable, }: {
    keys: Array<string> | string;
    type: ts.TypeNode;
    nonNullable?: boolean;
}): ts.TypeReferenceNode;
declare const keywordTypeNodes: {
    readonly any: ts.KeywordTypeNode<ts.SyntaxKind.AnyKeyword>;
    readonly unknown: ts.KeywordTypeNode<ts.SyntaxKind.UnknownKeyword>;
    readonly number: ts.KeywordTypeNode<ts.SyntaxKind.NumberKeyword>;
    readonly integer: ts.KeywordTypeNode<ts.SyntaxKind.NumberKeyword>;
    readonly object: ts.KeywordTypeNode<ts.SyntaxKind.ObjectKeyword>;
    readonly string: ts.KeywordTypeNode<ts.SyntaxKind.StringKeyword>;
    readonly boolean: ts.KeywordTypeNode<ts.SyntaxKind.BooleanKeyword>;
    readonly undefined: ts.KeywordTypeNode<ts.SyntaxKind.UndefinedKeyword>;
    readonly null: ts.LiteralTypeNode;
};
declare const createTypeLiteralNode: (members: readonly ts.TypeElement[] | undefined) => ts.TypeLiteralNode;
declare const createTypeReferenceNode: (typeName: string | ts.EntityName, typeArguments?: readonly ts.TypeNode[]) => ts.TypeReferenceNode;
declare const createNumericLiteral: (value: string | number, numericLiteralFlags?: ts.TokenFlags) => ts.NumericLiteral;
declare const createStringLiteral: (text: string, isSingleQuote?: boolean) => ts.StringLiteral;
declare const createArrayTypeNode: (elementType: ts.TypeNode) => ts.ArrayTypeNode;
declare const createLiteralTypeNode: (literal: ts.LiteralTypeNode["literal"]) => ts.LiteralTypeNode;
declare const createNull: () => ts.NullLiteral;
declare const createIdentifier: (text: string) => ts.Identifier;
declare const createTupleTypeNode: (elements: readonly (ts.TypeNode | ts.NamedTupleMember)[]) => ts.TupleTypeNode;
declare const createTrue: () => ts.TrueLiteral;
declare const createFalse: () => ts.FalseLiteral;

declare const factory_appendJSDocToNode: typeof appendJSDocToNode;
declare const factory_createArrayDeclaration: typeof createArrayDeclaration;
declare const factory_createArrayTypeNode: typeof createArrayTypeNode;
declare const factory_createEnumDeclaration: typeof createEnumDeclaration;
declare const factory_createExportDeclaration: typeof createExportDeclaration;
declare const factory_createFalse: typeof createFalse;
declare const factory_createIdentifier: typeof createIdentifier;
declare const factory_createImportDeclaration: typeof createImportDeclaration;
declare const factory_createIndexSignature: typeof createIndexSignature;
declare const factory_createIntersectionDeclaration: typeof createIntersectionDeclaration;
declare const factory_createJSDoc: typeof createJSDoc;
declare const factory_createLiteralTypeNode: typeof createLiteralTypeNode;
declare const factory_createNamespaceDeclaration: typeof createNamespaceDeclaration;
declare const factory_createNull: typeof createNull;
declare const factory_createNumericLiteral: typeof createNumericLiteral;
declare const factory_createOmitDeclaration: typeof createOmitDeclaration;
declare const factory_createParameterSignature: typeof createParameterSignature;
declare const factory_createPropertySignature: typeof createPropertySignature;
declare const factory_createQuestionToken: typeof createQuestionToken;
declare const factory_createStringLiteral: typeof createStringLiteral;
declare const factory_createTrue: typeof createTrue;
declare const factory_createTupleDeclaration: typeof createTupleDeclaration;
declare const factory_createTupleTypeNode: typeof createTupleTypeNode;
declare const factory_createTypeAliasDeclaration: typeof createTypeAliasDeclaration;
declare const factory_createTypeLiteralNode: typeof createTypeLiteralNode;
declare const factory_createTypeReferenceNode: typeof createTypeReferenceNode;
declare const factory_createUnionDeclaration: typeof createUnionDeclaration;
declare const factory_keywordTypeNodes: typeof keywordTypeNodes;
declare const factory_modifiers: typeof modifiers;
declare namespace factory {
  export { factory_appendJSDocToNode as appendJSDocToNode, factory_createArrayDeclaration as createArrayDeclaration, factory_createArrayTypeNode as createArrayTypeNode, factory_createEnumDeclaration as createEnumDeclaration, factory_createExportDeclaration as createExportDeclaration, factory_createFalse as createFalse, factory_createIdentifier as createIdentifier, factory_createImportDeclaration as createImportDeclaration, factory_createIndexSignature as createIndexSignature, factory_createIntersectionDeclaration as createIntersectionDeclaration, factory_createJSDoc as createJSDoc, factory_createLiteralTypeNode as createLiteralTypeNode, factory_createNamespaceDeclaration as createNamespaceDeclaration, factory_createNull as createNull, factory_createNumericLiteral as createNumericLiteral, factory_createOmitDeclaration as createOmitDeclaration, factory_createParameterSignature as createParameterSignature, factory_createPropertySignature as createPropertySignature, factory_createQuestionToken as createQuestionToken, factory_createStringLiteral as createStringLiteral, factory_createTrue as createTrue, factory_createTupleDeclaration as createTupleDeclaration, factory_createTupleTypeNode as createTupleTypeNode, factory_createTypeAliasDeclaration as createTypeAliasDeclaration, factory_createTypeLiteralNode as createTypeLiteralNode, factory_createTypeReferenceNode as createTypeReferenceNode, factory_createUnionDeclaration as createUnionDeclaration, factory_keywordTypeNodes as keywordTypeNodes, factory_modifiers as modifiers };
}

export { createIdentifier as A, createTupleTypeNode as B, createTrue as C, createFalse as D, createIntersectionDeclaration as a, createTupleDeclaration as b, createQuestionToken as c, createArrayDeclaration as d, createUnionDeclaration as e, factory as f, createPropertySignature as g, createParameterSignature as h, createJSDoc as i, appendJSDocToNode as j, createIndexSignature as k, createTypeAliasDeclaration as l, modifiers as m, createNamespaceDeclaration as n, createImportDeclaration as o, createExportDeclaration as p, createEnumDeclaration as q, createOmitDeclaration as r, keywordTypeNodes as s, createTypeLiteralNode as t, createTypeReferenceNode as u, createNumericLiteral as v, createStringLiteral as w, createArrayTypeNode as x, createLiteralTypeNode as y, createNull as z };
