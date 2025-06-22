const express = require('express');

const { zoomTokenController } = require('../controllers/zoomTokenController');

const router = express.Router();

router.get('/', zoomTokenController);

module.exports = router;