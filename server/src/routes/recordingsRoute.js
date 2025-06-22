const express = require('express');

const { recordingsController } = require('../controllers/recordingsController');

const router = express.Router();

router.post('/', recordingsController);

module.exports = router;