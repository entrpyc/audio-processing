const express = require('express');
require('./cron/cleanup');
const cors = require('cors');
const prcoessAudioRoute = require('./src/routes/prcoessAudioRoute');
const { FILE_SIZE_LIMIT, ROUTE } = require('./src/config/constants');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const app = express();

const foldersToEnsure = [
  path.join(__dirname, 'public', 'downloads'),
  path.join(__dirname, 'system', 'processed'),
  path.join(__dirname, 'system', 'uploads')
];

foldersToEnsure.forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`Created folder: ${folder}`);
  }
});

app.use(cors());
app.use(express.json({ limit: `${FILE_SIZE_LIMIT}mb` }));
app.use(express.urlencoded({ extended: true, limit: `${FILE_SIZE_LIMIT}mb` }));

app.use(express.static(ROUTE.PUBLIC.INDEX));
app.use(ROUTE.PROCESS_AUDIO, prcoessAudioRoute);

app.listen(5000, () => console.log('Server running on port 5000'));