const express = require('express');
const cors = require('cors');

const processAudioRoute = require('./src/routes/processAudioRoute');
const processZoomRecordingRoute = require('./src/routes/processZoomRecordingRoute');
const recordingsRoute = require('./src/routes/recordingsRoute');
const { FILE_SIZE_LIMIT, ROUTE } = require('./src/config/constants');
const { handleServerError, handleRouteErrors } = require('./src/utils/errorHandling');
const { setupServerFolders } = require('./src/utils/setup');
const { cleanTempFiles } = require('./cron/cleanup');

require('./cron/cleanup');
require('dotenv').config();

const app = express();

setupServerFolders();
cleanTempFiles();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: `${FILE_SIZE_LIMIT}mb` }));
app.use(express.urlencoded({ extended: true, limit: `${FILE_SIZE_LIMIT}mb` }));

app.use(express.static(ROUTE.PUBLIC.INDEX));
app.get(ROUTE.HEALTH, (req, res) => res.status(200).json({ status: 'OK' }));

app.use(ROUTE.PROCESS_AUDIO, handleRouteErrors(processAudioRoute));
app.use(ROUTE.PROCESS_ZOOM_RECORDING, handleRouteErrors(processZoomRecordingRoute));
app.use(ROUTE.RECORDINGS, handleRouteErrors(recordingsRoute));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  handleServerError({ res, error: err });
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));