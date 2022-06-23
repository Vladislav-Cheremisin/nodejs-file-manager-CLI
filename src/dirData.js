import os from "os";
import path from "path";

const dirData = {
  currentDir: os.homedir(),
  pathSep: path.sep,
  writable: process.stdout,

  setDirData(path) {
    this.currentDir = this.setDataToCorrectFormat(path);
  },

  getDirData() {
    return this.currentDir;
  },

  setDataToCorrectFormat(path) {
    const rootDir = this.getRootDir();
    let result = path;

    if (this.pathSep === "\\") {
      result = result.replaceAll("/", "\\");
    }

    if (this.pathSep === "/") {
      result = result.replaceAll("\\", "/");
    }

    if (result[result.length - 1] === this.pathSep) {
      result = result.slice(0, result.length - 1);
    }

    result = result
      .split("")
      .filter(
        (el, index) => el !== this.pathSep || result[index - 1] !== this.pathSep
      )
      .join("");

    if (!result.includes(this.pathSep)) {
      result = result + this.pathSep;
    }

    if (result.length < rootDir.length) {
      result = rootDir;
    }

    return result;
  },

  getRootDir() {
    const pathParts = this.currentDir.split(this.pathSep);
    const rootDir = pathParts[0] + this.pathSep;

    return rootDir;
  },

  showDirInfo() {
    this.writable.write(`You are currently in ${this.currentDir}\n`);
  },
};

export default dirData;
