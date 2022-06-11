import dirData from "./dirData.js";

class AppErrors {
  constructor() {
    this.currentDir = dirData.getDirData();
    this.writable = process.stdout;
  }

  showOperationError() {
    this.writable.write(
      `Operation failed, please try again or use "help" to read about available commands.\n`
    );

    dirData.showDirInfo();
  }

  showUselessArgsError() {
    this.writable.write(
      "Operation failed! Please use this command without any arguments.\n"
    );

    dirData.showDirInfo();
  }

  showIncorrectArgsError() {
    this.writable.write("Operation failed! Entered argument was incorrect.\n");

    dirData.showDirInfo();
  }

  showWrongPathError() {
    this.writable.write(
      "Operation failed! Entered path is wrong, try again with using correct path.\n"
    );

    dirData.showDirInfo();
  }

  showInvalidInput() {
    this.writable.write(
      `Invalid input, please try again or use "help" to read about available commands.\n`
    );

    dirData.showDirInfo();
  }

  showFatalError() {
    this.writable.write(
      `Application start failed. It looks like something was broken, please contact me <vladsiav@cheremis.in> for help.\n\n`
    );
  }
}

const appErrors = new AppErrors();

export default appErrors;
