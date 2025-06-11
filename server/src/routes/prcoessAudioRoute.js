const express = require('express');
const multer = require('multer');

const { audioController } = require('../controllers/audioController');
const { ROUTE, FILE_SIZE_LIMIT } = require('../config/constants');

const router = express.Router();

const upload = multer({
  dest: ROUTE.SYSTEM.UPLOADS,
  limits: { fileSize: FILE_SIZE_LIMIT * 1024 * 1024 }
});

router.post('/', upload.single('audio'), audioController);

module.exports = router;