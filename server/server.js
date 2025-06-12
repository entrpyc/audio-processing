const express = require('express');
require('./cron/cleanup');
const cors = require('cors');
const prcoessAudioRoute = require('./src/routes/prcoessAudioRoute');
const { FILE_SIZE_LIMIT, ROUTE } = require('./src/config/constants');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: `${FILE_SIZE_LIMIT}mb` }));
app.use(express.urlencoded({ extended: true, limit: `${FILE_SIZE_LIMIT}mb` }));

app.use(express.static(ROUTE.PUBLIC.INDEX));
app.use(ROUTE.PROCESS_AUDIO, prcoessAudioRoute);

app.listen(5000, () => console.log('Server running on port 5000'));