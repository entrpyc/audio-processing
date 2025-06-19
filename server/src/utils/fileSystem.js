const fs = require('fs');

const createFile = (path) => {
  const file = fs.statSync(path);

  return file;
}

module.exports = {
  createFile
}