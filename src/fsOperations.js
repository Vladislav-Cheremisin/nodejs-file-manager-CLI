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

        if ((await fsPromise.lstat(pathAbs)).isFile()) {
          await fsPromise.rename(pathAbs, newFilePath);

          this.writable.write(
            `${path.basename(pathAbs)} was renamed successfully.\n`
          );

          dirData.showDirInfo();
        } else {
          this.writable.write(
            `Operation failed! ${path.basename(
              pathAbs
            )} is folder or system file.\n`
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

  async cp(args) {
    try {
      if (!args || args.length !== 2) {
        appErrors.showIncorrectArgsError();
      } else {
        this.currentDir = dirData.getDirData();
        const filePath = args[0];
        const dirPath = args[1];
        let fileAbsPath = null;
        let dirAbsPath = null;

        if (path.isAbsolute(filePath)) {
          fileAbsPath = filePath;
        } else {
          fileAbsPath = path.join(this.currentDir, filePath);
        }

        if (path.isAbsolute(dirPath)) {
          dirAbsPath = dirPath;
        } else {
          dirAbsPath = path.join(this.currentDir, dirPath);
        }

        await fsPromise.access(fileAbsPath);
        await fsPromise.access(dirAbsPath);

        if (
          (await fsPromise.lstat(fileAbsPath)).isFile() &&
          (await fsPromise.lstat(dirAbsPath)).isDirectory()
        ) {
          const newFilePath = path.join(dirAbsPath, path.basename(fileAbsPath));

          await fsPromise
            .access(newFilePath)
            .then(() => {
              this.writable.write(
                `Operation failed! File ${path.basename(
                  fileAbsPath
                )} already exists in ${path.basename(dirAbsPath)} folder.\n`
              );

              dirData.showDirInfo();
            })
            .catch((err) => {
              if (err) {
                const readStream = fs.createReadStream(fileAbsPath);
                const writeStream = fs.createWriteStream(newFilePath);

                readStream.pipe(writeStream).on("error", (err) => {
                  if (err) {
                    appErrors.showOperationError();
                  }
                });

                readStream.on("close", () => {
                  this.writable.write(
                    `file ${path.basename(
                      fileAbsPath
                    )} was copied successfully\n`
                  );

                  dirData.showDirInfo();
                });
              }
            });
        } else {
          this.writable.write(
            "Operation failed! Entered file or folder doesn't exists.\n"
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

  async rm(args) {
    try {
      if (!args || args.length !== 1) {
        appErrors.showIncorrectArgsError();
      } else {
        this.currentDir = dirData.getDirData();
        const filePath = args[0];
        let pathAbs = null;

        if (path.isAbsolute(filePath)) {
          pathAbs = filePath;
        } else {
          pathAbs = path.join(this.currentDir, filePath);
        }

        try {
          await fsPromise.access(pathAbs);

          if ((await fsPromise.lstat(pathAbs)).isFile()) {
            fsPromise.unlink(pathAbs);

            this.writable.write(
              `${path.basename(pathAbs)} was removed successfully.\n`
            );

            dirData.showDirInfo();
          } else {
            this.writable.write(
              `Operation failed! ${path.basename(
                pathAbs
              )} is folder or system file.\n`
            );

            dirData.showDirInfo();
          }
        } catch (err) {
          if (err) {
            this.writable.write(
              `Operation failed! ${path.basename(pathAbs)} doesn't exist.\n`
            );

            dirData.showDirInfo();
          }
        }
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
