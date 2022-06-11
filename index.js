import getUserName from "./utils/getUserName.js";
import ChunkData from "./utils/getChunkData.js";
import nav from "./src/navigation.js";
import fsOperations from "./src/fsOperations.js";

const startFileManager = async () => {
  try {
    const readable = process.stdin;
    const writable = process.stdout;
    const username = getUserName();

    writable.write(`Welcome to the File Manager, ${username}!\n`);
    nav.showDirInfo();

    process.on("SIGINT", () => {
      writable.write(`Thank you for using File Manager, ${username}!\n\n`);
      process.exit();
    });

    readable.on("data", async (chunk) => {
      try {
        const chunkData = new ChunkData(chunk.toString().trim());

        switch (chunkData.command) {
          case ".exit":
            if (chunkData.args.length) {
              nav.showIncorrectArgsError();
            } else {
              writable.write(
                `Thank you for using File Manager, ${username}!\n\n`
              );

              process.exit();
            }
            break;
          case "up":
            nav.up(chunkData.args);
            break;
          case "ls":
            nav.ls(chunkData.args);
            break;
          case "cd":
            nav.cd(chunkData.args);
            break;
          default:
            nav.showInvalidInput();
            nav.showDirInfo();
        }
      } catch (err) {
        console.log(err);
        nav.showOperationError();
      }
    });
  } catch (err) {
    if (err) {
      throw err;
    }
  }
};

startFileManager();
