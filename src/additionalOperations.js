import appErrors from "./appErrors.js";
import dirData from "./dirData.js";

class AdditionalOperations {
  constructor() {
    this.writable = process.stdout;
  }

  async help(args) {
    try {
      if (args.length) {
        appErrors.showUselessArgsError();
      } else {
        this.writable.write(`\n
        File Manager commands:\n

        Navigation:\n
        up - Go upper from current directory.\n
        cd path_to_directory - Go to dedicated folder from current directory (path_to_directory can be relative or absolute).\n
        ls - List all files and folder in current directory and print it to console.\n

        Basic operations with files:\n
        cat path_to_file - Read file and print it's content in console.\n
        add new_file_name - Create empty file in current working directory.\n
        rn path_to_file new_filename - Rename file.\n
        cp path_to_file path_to_new_directory - Copy file.\n
        mv path_to_file path_to_new_directory - Move file (same as copy but initial file is deleted).\n
        rm path_to_file - Delete file.\n

        Operating system info:\n
        os --EOL - Get EOL (default system End-Of-Line).\n
        os --cpus - Get host machine CPUs info.\n
        os --homedir - Get home directory.\n
        os --username - Get current system user name.\n
        os --architecture - Get CPU architecture for which Node.js binary has compiled.\n

        Hash calculation:\n
        hash path_to_file - Calculate hash for file and print it into console\n

        Compress and decompress operations:\n
        compress path_to_file path_to_destination - Compress file (using Brotli algorithm).\n
        decompress path_to_file path_to_destination - Decompress file (using Brotli algorithm).\n

        If you still have problems please write to me:\n
        <vladsilav@cheremis.in>\n
        \n`);

        dirData.showDirInfo();
      }
    } catch (err) {
      if (err) {
        appErrors.showOperationError();
      }
    }
  }
}

const additional = new AdditionalOperations();

export default additional;
