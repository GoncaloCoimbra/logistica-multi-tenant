// src/clean.ts
import fs from "fs-extra";
async function clean(path) {
  return fs.remove(path);
}

// src/read.ts
import { basename, extname, relative } from "node:path";
import fs2 from "fs-extra";
import { switcher } from "js-runtime";
function slash(path, platform = "linux") {
  const isWindowsPath = /^\\\\\?\\/.test(path);
  if (["linux", "mac"].includes(platform) && !isWindowsPath) {
    return path.replaceAll(/\\/g, "/").replace("../", "").trimEnd();
  }
  return path.replaceAll(/\\/g, "/").replace("../", "").trimEnd();
}
function getRelativePath(rootDir, filePath, platform = "linux") {
  if (!rootDir || !filePath) {
    throw new Error(`Root and file should be filled in when retrieving the relativePath, ${rootDir || ""} ${filePath || ""}`);
  }
  const relativePath = relative(rootDir, filePath);
  const slashedPath = slash(relativePath, platform);
  if (slashedPath.startsWith("../")) {
    return slashedPath.replace(basename(slashedPath), basename(slashedPath, extname(filePath)));
  }
  return `./${slashedPath.replace(basename(slashedPath), basename(slashedPath, extname(filePath)))}`;
}
var reader = switcher(
  {
    node: async (path) => {
      return fs2.readFile(path, { encoding: "utf8" });
    },
    bun: async (path) => {
      const file = Bun.file(path);
      return file.text();
    }
  },
  "node"
);
var syncReader = switcher(
  {
    node: (path) => {
      return fs2.readFileSync(path, { encoding: "utf8" });
    },
    bun: () => {
      throw new Error("Bun cannot read sync");
    }
  },
  "node"
);
async function read(path) {
  return reader(path);
}
function readSync(path) {
  return syncReader(path);
}

// src/write.ts
import { resolve } from "node:path";
import fs3 from "fs-extra";
import { switcher as switcher2 } from "js-runtime";
var writer = switcher2(
  {
    node: async (path, data, { sanity }) => {
      try {
        const oldContent = await fs3.readFile(resolve(path), {
          encoding: "utf-8"
        });
        if (oldContent?.toString() === data?.toString()) {
          return;
        }
      } catch (_err) {
      }
      await fs3.outputFile(resolve(path), data, { encoding: "utf-8" });
      if (sanity) {
        const savedData = await fs3.readFile(resolve(path), {
          encoding: "utf-8"
        });
        if (savedData?.toString() !== data?.toString()) {
          throw new Error(`Sanity check failed for ${path}

Data[${data.length}]:
${data}

Saved[${savedData.length}]:
${savedData}
`);
        }
        return savedData;
      }
      return data;
    },
    bun: async (path, data, { sanity }) => {
      try {
        await Bun.write(resolve(path), data);
        if (sanity) {
          const file = Bun.file(resolve(path));
          const savedData = await file.text();
          if (savedData?.toString() !== data?.toString()) {
            throw new Error(`Sanity check failed for ${path}

Data[${path.length}]:
${path}

Saved[${savedData.length}]:
${savedData}
`);
          }
          return savedData;
        }
        return data;
      } catch (e) {
        console.log(e, resolve(path));
      }
    }
  },
  "node"
);
async function write(path, data, options = {}) {
  if (data.trim() === "") {
    return void 0;
  }
  return writer(path, data.trim(), options);
}
export {
  clean,
  getRelativePath,
  read,
  readSync,
  write
};
//# sourceMappingURL=index.js.map