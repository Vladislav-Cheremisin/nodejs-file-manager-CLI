import os from "os";

const dirData = {
  currentDir: os.homedir(),

  setDirData(path) {
    this.currentDir = path;
  },
  getDirData() {
    return this.currentDir;
  },
};

export default dirData;
