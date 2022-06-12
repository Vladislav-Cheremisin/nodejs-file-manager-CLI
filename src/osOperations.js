import os from "os";
import dirData from "./dirData.js";
import appErrors from "./appErrors.js";

class OSOperations {
  constructor() {
    this.writable = process.stdout;
  }

  async os(args) {
    try {
      if (!args || args.length !== 1) {
        appErrors.showIncorrectArgsError();
      } else {
        const arg = args[0].trim();

        switch (arg) {
          case "--EOL":
            this.writable.write(`${JSON.stringify(os.EOL)}\n`);
            dirData.showDirInfo();
            break;
          default:
            appErrors.showIncorrectArgsError();
            break;
        }
      }
    } catch (err) {
      if (err) {
        appErrors.showOperationError();
      }
    }
  }
}

const osOperations = new OSOperations();

export default osOperations;
