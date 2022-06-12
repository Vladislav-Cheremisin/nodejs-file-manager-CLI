import fsPromise from "fs/promises";
import fs from "fs";
import path from "path";
import zlib from "zlib";
import stream from "stream";

import appErrors from "./appErrors.js";
import dirData from "./dirData.js";

class ZlibOperations {
  constructor() {
    this.writable = process.stdout;
    this.currentDir = dirData.getDirData();
  }

  async compress(args) {
    try {
      if (!args || args.length !== 2) {
        appErrors.showIncorrectArgsError();
      } else {
        this.currentDir = dirData.getDirData();
        const filePath = args[0];
        const dirPath = args[1];
        let fileAbsPath = null;

        if (path.isAbsolute(filePath)) {
          fileAbsPath = filePath;
        } else {
          fileAbsPath = path.join(this.currentDir, filePath);
        }

        try {
          await fsPromise.access(fileAbsPath);

          if (path.isAbsolute(dirPath)) {
            const splittedDirPath = dirPath.split(".");

            if (splittedDirPath[splittedDirPath.length - 1] === "br") {
              try {
                await fsPromise.access(dirPath);

                this.writable.write(
                  `Operation failed! file ${path.basename(
                    dirPath
                  )} already exists.\n`
                );

                dirData.showDirInfo();
              } catch (err) {
                if (err) {
                  const readStream = fs.createReadStream(fileAbsPath);
                  const compressStream = zlib.createBrotliCompress();
                  const writeStream = fs.createWriteStream(dirPath);

                  stream.pipeline(
                    readStream,
                    compressStream,
                    writeStream,
                    (err) => {
                      if (err) {
                        appErrors.showOperationError();
                      } else {
                        this.writable.write(
                          `File ${path.basename(
                            fileAbsPath
                          )} was compressed successfully.\n`
                        );

                        dirData.showDirInfo();
                      }
                    }
                  );
                }
              }
            } else {
              this.showSecondArgumentCompressError();
            }
          } else {
            this.showSecondArgumentCompressError();
          }
        } catch (err) {
          if (err) {
            appErrors.showIncorrectArgsError();
          }
        }
      }
    } catch (err) {
      if (err) {
        appErrors.showOperationError();
      }
    }
  }

  async decompress(args) {
    try {
      if (!args || args.length !== 2) {
        appErrors.showIncorrectArgsError();
      } else {
        this.currentDir = dirData.getDirData();
        const filePath = args[0];
        const dirPath = args[1];
        let fileAbsPath = null;

        if (path.isAbsolute(filePath)) {
          fileAbsPath = filePath;
        } else {
          fileAbsPath = path.join(this.currentDir, filePath);
        }

        try {
          await fsPromise.access(fileAbsPath);

          const splittedFileName = path.basename(fileAbsPath).split(".");

          if (splittedFileName[splittedFileName.length - 1] === "br") {
            if (path.isAbsolute(dirPath)) {
              const splittedDirPath = dirPath.split(".");

              if (splittedDirPath[splittedDirPath.length - 1] !== "br") {
                try {
                  await fsPromise.access(dirPath);

                  this.writable.write(
                    `Operation failed! file ${path.basename(
                      dirPath
                    )} already exists.\n`
                  );

                  dirData.showDirInfo();
                } catch (err) {
                  if (err) {
                    const readStream = fs.createReadStream(fileAbsPath);
                    const decompressStream = zlib.createBrotliDecompress();
                    const writeStream = fs.createWriteStream(dirPath);

                    stream.pipeline(
                      readStream,
                      decompressStream,
                      writeStream,
                      (err) => {
                        if (err) {
                          appErrors.showOperationError();
                        } else {
                          this.writable.write(
                            `File ${path.basename(
                              fileAbsPath
                            )} was decompressed successfully.\n`
                          );

                          dirData.showDirInfo();
                        }
                      }
                    );
                  }
                }
              } else {
                this.showSecondArgumentDecompressError();
              }
            } else {
              this.showSecondArgumentDecompressError();
            }
          } else {
            this.writable.write(
              "Operation failed! First argument should be a path to file with .br extension.\n"
            );

            dirData.showDirInfo();
          }
        } catch (err) {
          if (err) {
            appErrors.showIncorrectArgsError();
          }
        }
      }
    } catch (err) {
      if (err) {
        appErrors.showOperationError();
      }
    }
  }

  showSecondArgumentCompressError() {
    this.writable.write(
      "Operation failed! Second argument should be absolute path to new file with .br extension.\n"
    );

    dirData.showDirInfo();
  }

  showSecondArgumentDecompressError() {
    this.writable.write(
      "Operation failed! Second argument should be absolute path to new file without .br extension.\n"
    );

    dirData.showDirInfo();
  }
}

const zlibOperations = new ZlibOperations();

export default zlibOperations;
