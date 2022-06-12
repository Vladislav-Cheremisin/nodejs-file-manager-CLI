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
          case "--cpus":
            const cpusInfo = os.cpus();
            const result = [];

            cpusInfo.forEach((cp) => {
              let speedGHZ = null;

              if (cp.speed < 100) {
                speedGHZ = cp.speed / 10;
              } else {
                speedGHZ = cp.speed / 1000;
              }

              result.push({
                model: cp.model.split("@")[0].trim(),
                speed: +speedGHZ.toFixed(1),
              });
            });

            console.log(result);
            dirData.showDirInfo();
            break;
          case "--homedir":
            this.writable.write(`${os.homedir()}\n`);
            dirData.showDirInfo();
            break;
          case "--username":
            const username = os.userInfo().username;
            this.writable.write(`${username}\n`);
            dirData.showDirInfo();
            break;
          case "--architecture":
            this.writable.write(`${os.arch()}\n`);
            dirData.showDirInfo();
            break;
          default:
            appErrors.showIncorrectArgsError();
            break;
        }
      }
    } catch (err) {
      if (err) {
        if (args[0] === "--username") {
          this.writable.write(
            "Operation failed! File manager can't find username in this operation system.\n"
          );
        } else {
          appErrors.showOperationError();
        }
      }
    }
  }
}

const osOperations = new OSOperations();

export default osOperations;
