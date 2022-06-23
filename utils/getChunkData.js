class ChunkData {
  constructor(chunkStr) {
    this.chunk = chunkStr;
    this.command = chunkStr.split(" ")[0];
    this.args = this.getChunkArgs();
  }

  getChunkArgs() {
    const argsArr = this.chunk.split(" ").splice(1);
    const result = [];
    let inProgress = false;
    let tempArr = [];

    argsArr.forEach((el) => {
      const lastIndex = el.length - 1;
      const firstSymbol = el[0];
      const lastSymbol = el[el.length - 1];

      /* Let's teach our application to work correct with quotes in console */

      if (
        (firstSymbol === "'" || firstSymbol === '"') &&
        (lastSymbol === "'" || lastSymbol === '"') &&
        inProgress === false
      ) {
        result.push(el.slice(1, lastIndex));
      } else if (
        (firstSymbol === '"' || firstSymbol === '"') &&
        (lastSymbol === "'" || lastSymbol === '"') &&
        inProgress === true
      ) {
        tempArr.push(el);
      } else if (
        (firstSymbol === "'" || firstSymbol === '"') &&
        inProgress === false
      ) {
        inProgress = true;
        tempArr.push(el.slice(1));
      } else if (
        (el[lastIndex] === "'" || el[lastIndex] === '"') &&
        inProgress === true &&
        tempArr.length
      ) {
        tempArr.push(el.slice(0, lastIndex));
        result.push(tempArr.join(" "));

        tempArr = [];

        inProgress = false;
      } else {
        result.push(el);
      }
    });

    return result;
  }
}

export default ChunkData;
