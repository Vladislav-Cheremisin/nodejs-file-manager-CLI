import getUserName from "./utils/getUserName.js";
import ChunkData from "./utils/getChunkData.js";
import dirData from "./src/dirData.js";
import appErrors from "./src/appErrors.js";
import navOperations from "./src/navOperations.js";
import fsOperations from "./src/fsOperations.js";
import osOperations from "./src/osOperations.js";
import cryptoOperations from "./src/cryptoOperations.js";

const startFileManager = async () => {
  try {
    const readable = process.stdin;
    const writable = process.stdout;
    const username = getUserName();

    writable.write(`Welcome to the File Manager, ${username}!\n`);
    dirData.showDirInfo();

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
              appErrors.showUselessArgsError();
            } else {
              writable.write(
                `Thank you for using File Manager, ${username}!\n\n`
              );

              process.exit();
            }
            break;
          case "up":
            navOperations.up(chunkData.args);
            break;
          case "ls":
            navOperations.ls(chunkData.args);
            break;
          case "cd":
            navOperations.cd(chunkData.args);
            break;
          case "cat":
            fsOperations.cat(chunkData.args);
            break;
          case "add":
            fsOperations.add(chunkData.args);
            break;
          case "rn":
            fsOperations.rn(chunkData.args);
            break;
          case "cp":
            fsOperations.cp(chunkData.args);
            break;
          case "mv":
            fsOperations.mv(chunkData.args);
            break;
          case "rm":
            fsOperations.rm(chunkData.args);
            break;
          case "os":
            osOperations.os(chunkData.args);
            break;
          case "hash":
            cryptoOperations.hash(chunkData.args);
            break;
          default:
            appErrors.showInvalidInput();
        }
      } catch (err) {
        if (err) {
          appErrors.showOperationError();
        }
      }
    });
  } catch (err) {
    if (err) {
      appErrors.showFatalError();
    }
  }
};

startFileManager();
