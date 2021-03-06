import fs from "fs/promises";
import path from "path";

import dirData from "./dirData.js";
import appErrors from "./appErrors.js";

class NavOperations {
  constructor() {
    this.currentDir = dirData.getDirData();
    this.writable = process.stdout;
    this.pathSep = path.sep;
  }

  up(args) {
    if (args.length) {
      appErrors.showUselessArgsError();
    } else {
      const pathParts = this.currentDir.split(this.pathSep);

      if (pathParts.length > 2) {
        const newPath = pathParts
          .splice(0, pathParts.length - 1)
          .join(this.pathSep);

        dirData.setDirData(newPath);

        this.currentDir = dirData.getDirData();
      } else {
        const newPath = pathParts[0] + this.pathSep;

        dirData.setDirData(newPath);

        this.currentDir = dirData.getDirData();
      }

      dirData.showDirInfo();
    }
  }

  async ls(args) {
    try {
      if (args.length) {
        appErrors.showUselessArgsError();
      } else {
        console.log(await fs.readdir(this.currentDir));

        dirData.showDirInfo();
      }
    } catch (err) {
      if (err) {
        appErrors.showOperationError();
        dirData.showDirInfo();
      }
    }
  }

  async cd(args) {
    try {
      if (!args || args.length !== 1) {
        appErrors.showIncorrectArgsError();
      } else {
        const pathArg = args[0];
        const isPathAbsolute = path.isAbsolute(pathArg);
        let pathAbs = null;

        if (isPathAbsolute) {
          pathAbs = pathArg;
        } else {
          pathAbs = path.join(this.currentDir, pathArg);
        }

        await fs.access(pathAbs);

        if ((await fs.lstat(pathAbs)).isDirectory()) {
          dirData.setDirData(pathAbs);

          this.currentDir = dirData.getDirData();
        } else {
          this.writable.write(
            `Operation failed! ${path.basename(
              pathAbs
            )} is file or system folder!\n`
          );
        }

        dirData.showDirInfo();
      }
    } catch (err) {
      if (err) {
        appErrors.showWrongPathError();
      }
    }
  }
}

const navOperations = new NavOperations();

export default navOperations;
