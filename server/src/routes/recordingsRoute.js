const express = require('express');

const { recordingsController } = require('../controllers/recordingsController');

const router = express.Router();

router.get('/', recordingsController);

module.exports = router;