import os from "os";

const dirData = {
  currentDir: os.homedir(),
  writable: process.stdout,

  setDirData(path) {
    this.currentDir = path;
  },

  getDirData() {
    return this.currentDir;
  },

  showDirInfo() {
    this.writable.write(`You are currently in ${this.currentDir}\n`);
  },
};

export default dirData;
