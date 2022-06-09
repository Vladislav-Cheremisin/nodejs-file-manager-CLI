import getUserName from "./utils/getUserName.js";
import showDirInfo from "./utils/showDirInfo.js";
import os from "os";

const startFileManager = async () => {
  try {
    const readable = process.stdin;
    const writable = process.stdout;
    const username = getUserName();
    const homeDir = os.homedir();
    let currentDir = homeDir;

    writable.write(`Welcome to the File Manager, ${username}\n`);
    showDirInfo(currentDir);

    process.on("SIGINT", () => {
      writable.write(`Thank you for using File Manager, ${username}!\n`);
      process.exit();
    });

    readable.on("data", async (chunk) => {
      try {
        const string = chunk.toString().trim();
        let isInvalid = false;

        switch (string) {
          case ".exit":
            writable.write(`Thank you for using File Manager, ${username}!\n`);
            process.exit();
            break;
          default:
            isInvalid = true;
            writable.write(
              `Invalid input, please try again or use "help" to read about available commands\n`
            );
        }

        if (!isInvalid) {
          showDirInfo(currentDir);
        }
      } catch (err) {
        writable.write(
          `Operation failed, please try again or use "help" to read about available commands\n`
        );
      }
    });
  } catch (err) {
    if (err) {
      throw err;
    }
  }
};

startFileManager();
