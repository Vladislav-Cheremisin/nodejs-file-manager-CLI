import os from "os";
import fs from "fs/promises";
import path from "path";

class FsOperations {
  constructor() {
    this.homeDir = os.homedir();
    this.currentDir = this.homeDir;
    this.writable = process.stdout;
    this.pathSep = path.sep;
  }
}

const fsOperations = new FsOperations();

export default fsOperations;
