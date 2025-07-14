const path = require("path");

const { findFolder, createFolder } = require("./fileSystem");
const { log } = require("./logger");

const setupServerFolders = () => {
  const foldersToEnsure = [
    path.join(__dirname, 'public', 'downloads'),
    path.join(__dirname, 'system', 'processed'),
    path.join(__dirname, 'system', 'uploads')
  ];

  foldersToEnsure.forEach(folder => {
    if (!findFolder(folder)) {
      createFolder(folder);
      log(`Created folder: ${folder}`);
    }
  });
}

module.exports = {
  setupServerFolders
}