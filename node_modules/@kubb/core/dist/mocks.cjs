"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkAT6SMJQWcjs = require('./chunk-AT6SMJQW.cjs');
require('./chunk-XTU72BHD.cjs');
require('./chunk-2IH3FIGI.cjs');


var _chunkKTZ6EAKPcjs = require('./chunk-KTZ6EAKP.cjs');


var _chunkNFUUQKWPcjs = require('./chunk-NFUUQKWP.cjs');

// mocks/index.ts
_chunkNFUUQKWPcjs.init_cjs_shims.call(void 0, );
var _fs = require('@kubb/fs');
var mockedPluginManager = {
  resolveName: ({ name, type }) => {
    if (type === "type") {
      return _chunkKTZ6EAKPcjs.pascalCase.call(void 0, name);
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
      source = _fs.readSync.call(void 0, baseName);
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
    const source = await _chunkAT6SMJQWcjs.FileManager.getSource(file);
    expect(source).toMatchSnapshot();
  }
}



exports.matchFiles = matchFiles; exports.mockedPluginManager = mockedPluginManager;
//# sourceMappingURL=mocks.cjs.map