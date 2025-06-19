const express = require('express');

const { processZoomRecordingController } = require('../controllers/processZoomRecordingController');

const router = express.Router();

router.post('/', processZoomRecordingController);

module.exports = router;