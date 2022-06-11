import os from "os";
import path from "path";

const dirData = {
  currentDir: os.homedir(),
  writable: process.stdout,
  pathSep: path.sep,

  setDirData(path) {
    if (this.pathSep === "\\") {
      this.currentDir = path.replace("/", "\\");
    } else if (this.pathSep === "/") {
      this.currentDir = path.replace("\\", "/");
    } else {
      this.currentDir = path;
    }
  },

  getDirData() {
    return this.currentDir;
  },

  showDirInfo() {
    this.writable.write(`You are currently in ${this.currentDir}\n`);
  },
};

export default dirData;
