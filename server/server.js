const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const processAudioRoute = require('./src/routes/processAudioRoute');
const processZoomRecordingRoute = require('./src/routes/processZoomRecordingRoute');
const recordingsRoute = require('./src/routes/recordingsRoute');
const { FILE_SIZE_LIMIT, ROUTE } = require('./src/config/constants');

require('./cron/cleanup');
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
app.use(ROUTE.PROCESS_AUDIO, processAudioRoute);
app.use(ROUTE.PROCESS_ZOOM_RECORDING, processZoomRecordingRoute);
app.use(ROUTE.RECORDINGS, recordingsRoute);
app.get(ROUTE.HEALTH, (req, res) => res.status(200).json({ status: 'OK' }));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));