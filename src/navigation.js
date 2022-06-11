import os from "os";
import fs from "fs/promises";
import path from "path";

class Navigator {
  constructor() {
    this.homeDir = os.homedir();
    this.currentDir = this.homeDir;
    this.writable = process.stdout;
    this.pathSep = path.sep;
  }

  _isRootDir() {
    const pathParts = this.currentDir.split(this.pathSep);
    const rootDir = pathParts[0] + this.pathSep;

    if (this.currentDir === rootDir) {
      return true;
    } else {
      return false;
    }
  }

  showDirInfo() {
    this.writable.write(`You are currently in ${this.currentDir}\n`);
  }

  showOperationError() {
    this.writable.write(
      `Operation failed, please try again or use "help" to read about available commands.\n`
    );

    this.showDirInfo();
  }

  showInvalidInput() {
    this.writable.write(
      `Invalid input, please try again or use "help" to read about available commands.\n`
    );
  }

  up() {
    if (!this._isRootDir()) {
      const pathParts = this.currentDir.split(this.pathSep);

      if (pathParts.length > 2) {
        this.currentDir = pathParts
          .splice(0, pathParts.length - 1)
          .join(this.pathSep);
      } else {
        this.currentDir = pathParts[0] + this.pathSep;
      }
    }

    this.showDirInfo();
  }

  async ls() {
    try {
      console.log(await fs.readdir(this.currentDir));

      this.showDirInfo();
    } catch (err) {
      if (err) {
        this.writable.write(
          "Operation failed! Cannot read content from system folder, please change it with using 'up' command and try again\n"
        );

        this.showDirInfo();
      }
    }
  }

  async cd(args) {
    try {
      if (!args || args.length !== 1) {
        this.writable.write(
          "Operation failed! Entered argument was incorrect.\n"
        );

        this.showDirInfo();
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
          this.currentDir = pathAbs;
        } else {
          this.writable.write(
            `Operation failed! ${path.basename(
              pathAbs
            )} is file or system folder!\n`
          );
        }

        this.showDirInfo();
      }
    } catch (err) {
      if (err) {
        this.writable.write(
          "Operation failed! Entered path is wrong, try again with using correct path.\n"
        );

        this.showDirInfo();
      }
    }
  }
}

const nav = new Navigator();

export default nav;
