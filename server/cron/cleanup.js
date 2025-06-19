const cron = require('node-cron');
const path = require('path');
const { ROUTE } = require('../src/config/constants');
const { openFolder, deleteFileAsync } = require('../src/utils/fileSystem');

const foldersToClean = [
  path.join(__dirname, `../${ROUTE.PUBLIC.DOWNLOADS}`),
  path.join(__dirname, `../${ROUTE.SYSTEM.PROCESSED}`),
  path.join(__dirname, `../${ROUTE.SYSTEM.UPLOADS}`),
];

const clearFolder = (folderPath) => {
  openFolder(folderPath, (err, files) => {
    if (err) return console.error(`[CLEANUP] Failed to read ${folderPath}:`, err);
    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      deleteFileAsync(fullPath, err => {
        if (err) console.error(`[CLEANUP] Failed to delete ${fullPath}:`, err);
      });
    }
  });
}

const cleanTempFiles = () => {
  foldersToClean.forEach(clearFolder);
}

// Every Monday at 00:00
cron.schedule('0 0 * * 1', () => {
  console.log('[CLEANUP] Weekly cleanup started...');
  foldersToClean.forEach(clearFolder);
});

module.exports = {
  cleanTempFiles
}