const writable = process.stdout;

const showDirInfo = (dir) => {
  writable.write(`You are currently in ${dir}\n`);
};

export default showDirInfo;
