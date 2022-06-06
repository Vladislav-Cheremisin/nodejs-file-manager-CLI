const getUserName = () => {
  const username = process.argv.find((item) => item.startsWith("--username"));

  if (username) {
    return username.split("=")[1];
  } else {
    return "Anonymous User";
  }
};

export default getUserName;
