import os from "os";
import fs from "fs/promises";
import path from "path";
import dirData from "./dirData.js";

class FsOperations {
  constructor() {
    this.currentDir = dirData.getDirData();
    this.writable = process.stdout;
    this.pathSep = path.sep;
  }

  async cat(args) {
    this.currentDir = dirData.getDirData();

    console.log(this.currentDir);
  }
}

const fsOperations = new FsOperations();

export default fsOperations;
