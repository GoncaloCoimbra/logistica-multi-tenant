"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunk5FZ7A36Ocjs = require('./chunk-5FZ7A36O.cjs');

// src/api.ts
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _typescript = require('typescript'); var _typescript2 = _interopRequireDefault(_typescript);
function getExports(filePath) {
  const rootName = _path2.default.extname(filePath) ? filePath : `${filePath}.ts`;
  if (!rootName) {
    return void 0;
  }
  const program = _typescript2.default.createProgram({
    rootNames: [rootName],
    options: {}
  });
  const checker = program.getTypeChecker();
  const sources = program.getSourceFiles();
  const sourceFile = sources.find((sourceFile2) => sourceFile2.fileName === rootName);
  if (!sourceFile) {
    return void 0;
  }
  const symbol = checker.getSymbolAtLocation(sourceFile);
  if (!_optionalChain([symbol, 'optionalAccess', _ => _.flags])) {
    return void 0;
  }
  const exports = checker.getExportsOfModule(symbol);
  return exports.map((e) => {
    const type = checker.getTypeOfSymbol(e);
    return {
      name: e.escapedName.toString(),
      isTypeOnly: _optionalChain([type, 'optionalAccess', _2 => _2.id]) === 5
    };
  });
}

// src/print.ts

var { factory } = _typescript2.default;
var escapeNewLines = (code) => code.replace(/\n\n/g, "\n/* :newline: */");
var restoreNewLines = (code) => code.replace(/\/\* :newline: \*\//g, "\n");
function print(elements, { source = "", baseName = "print.ts", removeComments, noEmitHelpers, newLine = _typescript2.default.NewLineKind.LineFeed } = {}) {
  const sourceFile = _typescript2.default.createSourceFile(baseName, escapeNewLines(source), _typescript2.default.ScriptTarget.ES2022, false, _typescript2.default.ScriptKind.TS);
  const printer = _typescript2.default.createPrinter({
    omitTrailingSemicolon: true,
    newLine,
    removeComments,
    noEmitHelpers
  });
  let nodes = [];
  if (!elements) {
    return "";
  }
  if (Array.isArray(elements)) {
    nodes = elements.filter(Boolean);
  } else {
    nodes = [elements].filter(Boolean);
  }
  const outputFile = printer.printList(_typescript2.default.ListFormat.MultiLine, factory.createNodeArray(nodes), sourceFile);
  const outputSource = printer.printFile(sourceFile);
  return [outputFile, restoreNewLines(outputSource)].filter(Boolean).join("\n");
}

// src/parse.ts
function parse(ast) {
  return {
    ast,
    text: print(ast)
  };
}





exports.factory = _chunk5FZ7A36Ocjs.factory_exports; exports.getExports = getExports; exports.parse = parse; exports.print = print;
//# sourceMappingURL=index.cjs.map