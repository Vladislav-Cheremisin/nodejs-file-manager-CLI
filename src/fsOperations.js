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
    try {
      if (!args || args.length !== 1) {
        appErrors.showIncorrectArgsError();
      } else {
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
      }
    } catch (err) {
      if (err) {
        appErrors.showWrongPathError();
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
              if (path.isAbsolute(fileName)) {
                this.writable.write(
                  `Operation failed! You should enter name for new file as argument!\n`
                );
              } else {
                this.writable.write(
                  `Operation failed! File with name ${fileName} already exists.\n`
                );
              }

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

  async rn(args) {
    try {
      if (!args || args.length !== 2) {
        appErrors.showIncorrectArgsError();
      } else {
        this.currentDir = dirData.getDirData();
        const pathArg = args[0];
        const newFileName = args[1];
        const isPathAbsolute = path.isAbsolute(pathArg);
        let pathAbs = null;

        if (isPathAbsolute) {
          pathAbs = pathArg;
        } else {
          pathAbs = path.join(this.currentDir, pathArg);
        }

        let newFilePath = pathAbs.split(this.pathSep);
        newFilePath.pop();
        newFilePath.push(newFileName);
        newFilePath = newFilePath.join(this.pathSep);

        await fsPromise.access(pathAbs);
        await fsPromise.rename(pathAbs, newFilePath);

        dirData.showDirInfo();
      }
    } catch (err) {
      if (err) {
        appErrors.showWrongPathError();
      }
    }
  }
}

const fsOperations = new FsOperations();

export default fsOperations;
