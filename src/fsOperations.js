import stream from "stream";
import fsPromise from "fs/promises";
import fs from "fs";
import path from "path";
import dirData from "./dirData.js";
import appErrors from "./appErrors.js";

class FsOperations {
  constructor() {
    this.currentDir = dirData.getDirData();
    this.writable = process.stdout;
    this.pathSep = path.sep;
  }

  async cat(args) {
    if (!args || args.length !== 1) {
      appErrors.showIncorrectArgsError();
    } else {
      try {
        this.currentDir = dirData.getDirData();
        const pathArg = args[0];
        const isPathAbsolute = path.isAbsolute(pathArg);
        let pathAbs = null;

        if (isPathAbsolute) {
          pathAbs = pathArg;
        } else {
          pathAbs = path.join(this.currentDir, pathArg);
        }

        await fsPromise.access(pathAbs);

        if ((await fsPromise.lstat(pathAbs)).isFile()) {
          const readable = fs.createReadStream(pathAbs);

          readable.pipe(this.writable).on("error", (err) => {
            if (err) {
              appErrors.showOperationError();
            }
          });

          readable.on("close", () => {
            this.writable.write("\n");
            dirData.showDirInfo();
          });
        } else {
          this.writable.write(
            `Operation failed! ${path.basename(
              pathAbs
            )} is folder or system file!\n`
          );

          dirData.showDirInfo();
        }
      } catch (err) {
        if (err) {
          appErrors.showWrongPathError();
        }
      }
    }
  }

  async add(args) {
    try {
      if (!args || args.length !== 1) {
        appErrors.showIncorrectArgsError();
      } else {
        this.currentDir = dirData.getDirData();
        const fileName = args[0];

        fsPromise
          .writeFile(path.join(this.currentDir, fileName), "", {
            flag: "wx",
          })
          .then(() => {
            dirData.showDirInfo();
          })
          .catch((err) => {
            if (err) {
              this.writable.write(
                `Operation failed! File with name ${fileName} already exists.\n`
              );

              dirData.showDirInfo();
            }
          });
      }
    } catch (err) {
      if (err) {
        appErrors.showIncorrectArgsError();
      }
    }
  }
}

const fsOperations = new FsOperations();

export default fsOperations;
