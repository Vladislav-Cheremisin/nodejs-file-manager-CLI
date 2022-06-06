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

    readable.on("data", (chunk) => {
      const string = chunk.toString();

      if (string.includes(".exit")) {
        writable.write(`Thank you for using File Manager, ${username}!\n`);
        process.exit();
      }

      showDirInfo(currentDir);
    });
  } catch (err) {
    if (err) {
      throw err;
    }
  }
};

startFileManager();
