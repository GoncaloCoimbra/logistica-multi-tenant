import {
  factory_exports
} from "./chunk-UKREFUXY.js";

// src/api.ts
import path from "node:path";
import ts from "typescript";
function getExports(filePath) {
  const rootName = path.extname(filePath) ? filePath : `${filePath}.ts`;
  if (!rootName) {
    return void 0;
  }
  const program = ts.createProgram({
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
  if (!symbol?.flags) {
    return void 0;
  }
  const exports = checker.getExportsOfModule(symbol);
  return exports.map((e) => {
    const type = checker.getTypeOfSymbol(e);
    return {
      name: e.escapedName.toString(),
      isTypeOnly: type?.id === 5
    };
  });
}

// src/print.ts
import ts2 from "typescript";
var { factory } = ts2;
var escapeNewLines = (code) => code.replace(/\n\n/g, "\n/* :newline: */");
var restoreNewLines = (code) => code.replace(/\/\* :newline: \*\//g, "\n");
function print(elements, { source = "", baseName = "print.ts", removeComments, noEmitHelpers, newLine = ts2.NewLineKind.LineFeed } = {}) {
  const sourceFile = ts2.createSourceFile(baseName, escapeNewLines(source), ts2.ScriptTarget.ES2022, false, ts2.ScriptKind.TS);
  const printer = ts2.createPrinter({
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
  const outputFile = printer.printList(ts2.ListFormat.MultiLine, factory.createNodeArray(nodes), sourceFile);
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
export {
  factory_exports as factory,
  getExports,
  parse,
  print
};
//# sourceMappingURL=index.js.map