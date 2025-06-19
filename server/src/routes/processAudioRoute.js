const express = require('express');
const multer = require('multer');

const { processAudioController } = require('../controllers/processAudioController');
const { ROUTE, FILE_SIZE_LIMIT } = require('../config/constants');
const { parseBitsToMB } = require('../utils/formatting');

const router = express.Router();

const upload = multer({
  dest: ROUTE.SYSTEM.UPLOADS,
  limits: { fileSize: parseBitsToMB(FILE_SIZE_LIMIT) }
});

router.post('/', upload.single('audio'), processAudioController);

module.exports = router;