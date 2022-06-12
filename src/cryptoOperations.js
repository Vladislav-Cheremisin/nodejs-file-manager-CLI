import fsPromise from "fs/promises";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import appErrors from "./appErrors.js";
import dirData from "./dirData.js";

class CryptoOperations {
  constructor() {
    this.writable = process.stdout;
    this.currentDir = dirData.getDirData();
  }

  async hash(args) {
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
            const readStream = fs.createReadStream(pathAbs, {
              encoding: "utf-8",
            });
            const hashStream = crypto.createHash("sha256");

            readStream.pipe(hashStream).on("error", (err) => {
              if (err) {
                appErrors.showOperationError();
              }
            });

            readStream.on("close", () => {
              this.writable.write(`${hashStream.digest("hex")}\n`);
              dirData.showDirInfo();
            });
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
        appErrors.showOperationError();
      }
    }
  }
}

const cryptoOperations = new CryptoOperations();

export default cryptoOperations;
