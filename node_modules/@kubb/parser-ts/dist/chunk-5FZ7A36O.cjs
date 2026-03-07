"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/factory.ts
var factory_exports = {};
__export(factory_exports, {
  appendJSDocToNode: () => appendJSDocToNode,
  createArrayDeclaration: () => createArrayDeclaration,
  createArrayTypeNode: () => createArrayTypeNode,
  createEnumDeclaration: () => createEnumDeclaration,
  createExportDeclaration: () => createExportDeclaration,
  createFalse: () => createFalse,
  createIdentifier: () => createIdentifier,
  createImportDeclaration: () => createImportDeclaration,
  createIndexSignature: () => createIndexSignature,
  createIntersectionDeclaration: () => createIntersectionDeclaration,
  createJSDoc: () => createJSDoc,
  createLiteralTypeNode: () => createLiteralTypeNode,
  createNamespaceDeclaration: () => createNamespaceDeclaration,
  createNull: () => createNull,
  createNumericLiteral: () => createNumericLiteral,
  createOmitDeclaration: () => createOmitDeclaration,
  createParameterSignature: () => createParameterSignature,
  createPropertySignature: () => createPropertySignature,
  createQuestionToken: () => createQuestionToken,
  createStringLiteral: () => createStringLiteral,
  createTrue: () => createTrue,
  createTupleDeclaration: () => createTupleDeclaration,
  createTupleTypeNode: () => createTupleTypeNode,
  createTypeAliasDeclaration: () => createTypeAliasDeclaration,
  createTypeLiteralNode: () => createTypeLiteralNode,
  createTypeReferenceNode: () => createTypeReferenceNode,
  createUnionDeclaration: () => createUnionDeclaration,
  keywordTypeNodes: () => keywordTypeNodes,
  modifiers: () => modifiers
});
var _remeda = require('remeda');
var _typescript = require('typescript'); var _typescript2 = _interopRequireDefault(_typescript);
var { factory } = _typescript2.default;
var modifiers = {
  async: factory.createModifier(_typescript2.default.SyntaxKind.AsyncKeyword),
  export: factory.createModifier(_typescript2.default.SyntaxKind.ExportKeyword),
  const: factory.createModifier(_typescript2.default.SyntaxKind.ConstKeyword),
  static: factory.createModifier(_typescript2.default.SyntaxKind.StaticKeyword)
};
function isValidIdentifier(str) {
  if (!str.length || str.trim() !== str) {
    return false;
  }
  const node = _typescript2.default.parseIsolatedEntityName(str, _typescript2.default.ScriptTarget.Latest);
  return !!node && node.kind === _typescript2.default.SyntaxKind.Identifier && _typescript2.default.identifierToKeywordKind(node.kind) === void 0;
}
function propertyName(name) {
  if (typeof name === "string") {
    return isValidIdentifier(name) ? factory.createIdentifier(name) : factory.createStringLiteral(name);
  }
  return name;
}
var questionToken = factory.createToken(_typescript2.default.SyntaxKind.QuestionToken);
function createQuestionToken(token) {
  if (!token) {
    return void 0;
  }
  if (token === true) {
    return questionToken;
  }
  return token;
}
function createIntersectionDeclaration({
  nodes,
  withParentheses
}) {
  if (!nodes.length) {
    return null;
  }
  if (nodes.length === 1) {
    return nodes[0] || null;
  }
  const node = factory.createIntersectionTypeNode(nodes);
  if (withParentheses) {
    return factory.createParenthesizedType(node);
  }
  return node;
}
function createTupleDeclaration({
  nodes,
  withParentheses
}) {
  if (!nodes.length) {
    return null;
  }
  if (nodes.length === 1) {
    return nodes[0] || null;
  }
  const node = factory.createTupleTypeNode(nodes);
  if (withParentheses) {
    return factory.createParenthesizedType(node);
  }
  return node;
}
function createArrayDeclaration({
  nodes
}) {
  if (!nodes.length) {
    return factory.createTupleTypeNode([]);
  }
  if (nodes.length === 1) {
    return factory.createArrayTypeNode(nodes.at(0));
  }
  return factory.createExpressionWithTypeArguments(factory.createIdentifier("Array"), [factory.createUnionTypeNode(nodes)]);
}
function createUnionDeclaration({
  nodes,
  withParentheses
}) {
  if (!nodes.length) {
    return null;
  }
  if (nodes.length === 1) {
    return nodes[0] || null;
  }
  const node = factory.createUnionTypeNode(nodes);
  if (withParentheses) {
    return factory.createParenthesizedType(node);
  }
  return node;
}
function createPropertySignature({
  readOnly,
  modifiers: modifiers2 = [],
  name,
  questionToken: questionToken2,
  type
}) {
  return factory.createPropertySignature(
    [...modifiers2, readOnly ? factory.createToken(_typescript2.default.SyntaxKind.ReadonlyKeyword) : void 0].filter(Boolean),
    propertyName(name),
    createQuestionToken(questionToken2),
    type
  );
}
function createParameterSignature(name, {
  modifiers: modifiers2,
  dotDotDotToken,
  questionToken: questionToken2,
  type,
  initializer
}) {
  return factory.createParameterDeclaration(modifiers2, dotDotDotToken, name, createQuestionToken(questionToken2), type, initializer);
}
function createJSDoc({ comments }) {
  if (!comments.length) {
    return null;
  }
  return factory.createJSDocComment(
    factory.createNodeArray(
      comments.map((comment, i) => {
        if (i === comments.length - 1) {
          return factory.createJSDocText(comment);
        }
        return factory.createJSDocText(`${comment}
`);
      })
    )
  );
}
function appendJSDocToNode({
  node,
  comments
}) {
  const filteredComments = comments.filter(Boolean);
  if (!filteredComments.length) {
    return node;
  }
  const text = filteredComments.reduce((acc = "", comment = "") => {
    return `${acc}
 * ${comment.replaceAll("*/", "*\\/")}`;
  }, "*");
  return _typescript2.default.addSyntheticLeadingComment({ ...node }, _typescript2.default.SyntaxKind.MultiLineCommentTrivia, `${text || "*"}
`, true);
}
function createIndexSignature(type, {
  modifiers: modifiers2,
  indexName = "key",
  indexType = factory.createKeywordTypeNode(_typescript2.default.SyntaxKind.StringKeyword)
} = {}) {
  return factory.createIndexSignature(modifiers2, [createParameterSignature(indexName, { type: indexType })], type);
}
function createTypeAliasDeclaration({
  modifiers: modifiers2,
  name,
  typeParameters,
  type
}) {
  return factory.createTypeAliasDeclaration(modifiers2, name, typeParameters, type);
}
function createNamespaceDeclaration({
  statements,
  name
}) {
  return factory.createModuleDeclaration(
    [factory.createToken(_typescript2.default.SyntaxKind.ExportKeyword)],
    factory.createIdentifier(name),
    factory.createModuleBlock(statements),
    _typescript2.default.NodeFlags.Namespace
  );
}
function createImportDeclaration({
  name,
  path,
  isTypeOnly = false,
  isNameSpace = false
}) {
  if (!Array.isArray(name)) {
    let importPropertyName = factory.createIdentifier(name);
    let importName = void 0;
    if (isNameSpace) {
      importPropertyName = void 0;
      importName = factory.createNamespaceImport(factory.createIdentifier(name));
    }
    return factory.createImportDeclaration(
      void 0,
      factory.createImportClause(isTypeOnly, importPropertyName, importName),
      factory.createStringLiteral(path),
      void 0
    );
  }
  return factory.createImportDeclaration(
    void 0,
    factory.createImportClause(
      isTypeOnly,
      void 0,
      factory.createNamedImports(
        name.map((item) => {
          if (typeof item === "object") {
            const obj = item;
            if (obj.name) {
              return factory.createImportSpecifier(false, factory.createIdentifier(obj.propertyName), factory.createIdentifier(obj.name));
            }
            return factory.createImportSpecifier(false, void 0, factory.createIdentifier(obj.propertyName));
          }
          return factory.createImportSpecifier(false, void 0, factory.createIdentifier(item));
        })
      )
    ),
    factory.createStringLiteral(path),
    void 0
  );
}
function createExportDeclaration({
  path,
  asAlias,
  isTypeOnly = false,
  name
}) {
  if (name && !Array.isArray(name) && !asAlias) {
    throw new Error("When using `name` as string, `asAlias` should be true");
  }
  if (!Array.isArray(name)) {
    const parsedName = _optionalChain([name, 'optionalAccess', _ => _.match, 'call', _2 => _2(/^\d/)]) ? `_${_optionalChain([name, 'optionalAccess', _3 => _3.slice, 'call', _4 => _4(1)])}` : name;
    return factory.createExportDeclaration(
      void 0,
      isTypeOnly,
      asAlias && parsedName ? factory.createNamespaceExport(factory.createIdentifier(parsedName)) : void 0,
      factory.createStringLiteral(path),
      void 0
    );
  }
  return factory.createExportDeclaration(
    void 0,
    isTypeOnly,
    factory.createNamedExports(
      name.map((propertyName2) => {
        return factory.createExportSpecifier(false, void 0, typeof propertyName2 === "string" ? factory.createIdentifier(propertyName2) : propertyName2);
      })
    ),
    factory.createStringLiteral(path),
    void 0
  );
}
function createEnumDeclaration({
  type = "enum",
  name,
  typeName,
  enums
}) {
  if (type === "literal") {
    return [
      factory.createTypeAliasDeclaration(
        [factory.createToken(_typescript2.default.SyntaxKind.ExportKeyword)],
        factory.createIdentifier(typeName),
        void 0,
        factory.createUnionTypeNode(
          enums.map(([_key, value]) => {
            if (_remeda.isNumber.call(void 0, value)) {
              return factory.createLiteralTypeNode(factory.createNumericLiteral(_optionalChain([value, 'optionalAccess', _5 => _5.toString, 'call', _6 => _6()])));
            }
            if (typeof value === "boolean") {
              return factory.createLiteralTypeNode(value ? factory.createTrue() : factory.createFalse());
            }
            if (value) {
              return factory.createLiteralTypeNode(factory.createStringLiteral(value.toString()));
            }
            return void 0;
          }).filter(Boolean)
        )
      )
    ];
  }
  if (type === "enum" || type === "constEnum") {
    return [
      factory.createEnumDeclaration(
        [factory.createToken(_typescript2.default.SyntaxKind.ExportKeyword), type === "constEnum" ? factory.createToken(_typescript2.default.SyntaxKind.ConstKeyword) : void 0].filter(Boolean),
        factory.createIdentifier(typeName),
        enums.map(([key, value]) => {
          let initializer = factory.createStringLiteral(_optionalChain([value, 'optionalAccess', _7 => _7.toString, 'call', _8 => _8()]));
          if (_remeda.isNumber.call(void 0, Number.parseInt(value.toString()))) {
            initializer = factory.createNumericLiteral(value);
          }
          if (typeof value === "boolean") {
            initializer = value ? factory.createTrue() : factory.createFalse();
          }
          if (_remeda.isNumber.call(void 0, Number.parseInt(key.toString()))) {
            return factory.createEnumMember(factory.createStringLiteral(`${typeName}_${key}`), initializer);
          }
          if (key) {
            return factory.createEnumMember(factory.createStringLiteral(`${key}`), initializer);
          }
          return void 0;
        }).filter(Boolean)
      )
    ];
  }
  const identifierName = type === "asPascalConst" ? typeName : name;
  return [
    factory.createVariableStatement(
      [factory.createToken(_typescript2.default.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(identifierName),
            void 0,
            void 0,
            factory.createAsExpression(
              factory.createObjectLiteralExpression(
                enums.map(([key, value]) => {
                  let initializer = factory.createStringLiteral(`${_optionalChain([value, 'optionalAccess', _9 => _9.toString, 'call', _10 => _10()])}`);
                  if (_remeda.isNumber.call(void 0, value)) {
                    if (value < 0) {
                      initializer = factory.createPrefixUnaryExpression(_typescript2.default.SyntaxKind.MinusToken, factory.createNumericLiteral(Math.abs(value)));
                    } else {
                      initializer = factory.createNumericLiteral(value);
                    }
                  }
                  if (typeof value === "boolean") {
                    initializer = value ? factory.createTrue() : factory.createFalse();
                  }
                  if (key) {
                    return factory.createPropertyAssignment(factory.createStringLiteral(`${key}`), initializer);
                  }
                  return void 0;
                }).filter(Boolean),
                true
              ),
              factory.createTypeReferenceNode(factory.createIdentifier("const"), void 0)
            )
          )
        ],
        _typescript2.default.NodeFlags.Const
      )
    ),
    factory.createTypeAliasDeclaration(
      [factory.createToken(_typescript2.default.SyntaxKind.ExportKeyword)],
      factory.createIdentifier(typeName),
      void 0,
      factory.createIndexedAccessTypeNode(
        factory.createParenthesizedType(factory.createTypeQueryNode(factory.createIdentifier(identifierName), void 0)),
        factory.createTypeOperatorNode(_typescript2.default.SyntaxKind.KeyOfKeyword, factory.createTypeQueryNode(factory.createIdentifier(identifierName), void 0))
      )
    )
  ];
}
function createOmitDeclaration({
  keys,
  type,
  nonNullable
}) {
  const node = nonNullable ? factory.createTypeReferenceNode(factory.createIdentifier("NonNullable"), [type]) : type;
  if (Array.isArray(keys)) {
    return factory.createTypeReferenceNode(factory.createIdentifier("Omit"), [
      node,
      factory.createUnionTypeNode(
        keys.map((key) => {
          return factory.createLiteralTypeNode(factory.createStringLiteral(key));
        })
      )
    ]);
  }
  return factory.createTypeReferenceNode(factory.createIdentifier("Omit"), [node, factory.createLiteralTypeNode(factory.createStringLiteral(keys))]);
}
var keywordTypeNodes = {
  any: factory.createKeywordTypeNode(_typescript2.default.SyntaxKind.AnyKeyword),
  unknown: factory.createKeywordTypeNode(_typescript2.default.SyntaxKind.UnknownKeyword),
  number: factory.createKeywordTypeNode(_typescript2.default.SyntaxKind.NumberKeyword),
  integer: factory.createKeywordTypeNode(_typescript2.default.SyntaxKind.NumberKeyword),
  object: factory.createKeywordTypeNode(_typescript2.default.SyntaxKind.ObjectKeyword),
  string: factory.createKeywordTypeNode(_typescript2.default.SyntaxKind.StringKeyword),
  boolean: factory.createKeywordTypeNode(_typescript2.default.SyntaxKind.BooleanKeyword),
  undefined: factory.createKeywordTypeNode(_typescript2.default.SyntaxKind.UndefinedKeyword),
  null: factory.createLiteralTypeNode(factory.createToken(_typescript2.default.SyntaxKind.NullKeyword))
};
var createTypeLiteralNode = factory.createTypeLiteralNode;
var createTypeReferenceNode = factory.createTypeReferenceNode;
var createNumericLiteral = factory.createNumericLiteral;
var createStringLiteral = factory.createStringLiteral;
var createArrayTypeNode = factory.createArrayTypeNode;
var createLiteralTypeNode = factory.createLiteralTypeNode;
var createNull = factory.createNull;
var createIdentifier = factory.createIdentifier;
var createTupleTypeNode = factory.createTupleTypeNode;
var createTrue = factory.createTrue;
var createFalse = factory.createFalse;
































exports.modifiers = modifiers; exports.createQuestionToken = createQuestionToken; exports.createIntersectionDeclaration = createIntersectionDeclaration; exports.createTupleDeclaration = createTupleDeclaration; exports.createArrayDeclaration = createArrayDeclaration; exports.createUnionDeclaration = createUnionDeclaration; exports.createPropertySignature = createPropertySignature; exports.createParameterSignature = createParameterSignature; exports.createJSDoc = createJSDoc; exports.appendJSDocToNode = appendJSDocToNode; exports.createIndexSignature = createIndexSignature; exports.createTypeAliasDeclaration = createTypeAliasDeclaration; exports.createNamespaceDeclaration = createNamespaceDeclaration; exports.createImportDeclaration = createImportDeclaration; exports.createExportDeclaration = createExportDeclaration; exports.createEnumDeclaration = createEnumDeclaration; exports.createOmitDeclaration = createOmitDeclaration; exports.keywordTypeNodes = keywordTypeNodes; exports.createTypeLiteralNode = createTypeLiteralNode; exports.createTypeReferenceNode = createTypeReferenceNode; exports.createNumericLiteral = createNumericLiteral; exports.createStringLiteral = createStringLiteral; exports.createArrayTypeNode = createArrayTypeNode; exports.createLiteralTypeNode = createLiteralTypeNode; exports.createNull = createNull; exports.createIdentifier = createIdentifier; exports.createTupleTypeNode = createTupleTypeNode; exports.createTrue = createTrue; exports.createFalse = createFalse; exports.factory_exports = factory_exports;
//# sourceMappingURL=chunk-5FZ7A36O.cjs.map