import {
  FileManager
} from "./chunk-WURRAECF.js";
import "./chunk-OZKPV7RD.js";
import "./chunk-5JZNFPUP.js";
import {
  pascalCase
} from "./chunk-4X5FFJPJ.js";
import "./chunk-HMLY7DHA.js";

// mocks/index.ts
import { readSync } from "@kubb/fs";
var mockedPluginManager = {
  resolveName: ({ name, type }) => {
    if (type === "type") {
      return pascalCase(name);
    }
    return name;
  },
  config: {
    output: {
      path: "./path"
    }
  },
  resolvePath: ({ baseName }) => baseName,
  logger: {
    emit(message) {
      console.log(message);
    },
    on(eventName, args) {
    },
    logLevel: "info"
  },
  getFile: ({ name, extName, pluginKey }) => {
    const baseName = `${name}${extName}`;
    let source = "";
    try {
      source = readSync(baseName);
    } catch (_e) {
    }
    return {
      path: baseName,
      baseName,
      meta: {
        pluginKey
      },
      source
    };
  }
};
async function matchFiles(files) {
  for (const file of files) {
    const source = await FileManager.getSource(file);
    expect(source).toMatchSnapshot();
  }
}
export {
  matchFiles,
  mockedPluginManager
};
//# sourceMappingURL=mocks.js.map