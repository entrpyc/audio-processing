const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { ROUTE } = require('../src/config/constants');

const foldersToClean = [
  path.join(__dirname, `../${ROUTE.PUBLIC.DOWNLOADS}`),
  path.join(__dirname, `../${ROUTE.SYSTEM.PROCESSED}`),
  path.join(__dirname, `../${ROUTE.SYSTEM.UPLOADS}`),
];

function clearFolder(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) return console.error(`[CLEANUP] Failed to read ${folderPath}:`, err);
    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      fs.unlink(fullPath, err => {
        if (err) console.error(`[CLEANUP] Failed to delete ${fullPath}:`, err);
      });
    }
  });
}

// Every Monday at 00:00
cron.schedule('0 0 * * 1', () => {
  console.log('[CLEANUP] Weekly cleanup started...');
  foldersToClean.forEach(clearFolder);
});