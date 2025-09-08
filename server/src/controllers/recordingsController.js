const { getZoomRecordings } = require('../services/zoomService');
const { validateRequiredParams } = require('../utils/errorHandling');
const { log } = require('../utils/logger');

async function recordingsController(req, res) {
  if(!req?.body) return handleMissingRequestBody(req, res);
  log('recordingsController', req.body)

  const { zoomToken, range } = req.body;

  const validParams = validateRequiredParams(res, { zoomToken })
  if(!validParams) return;

  const recordings = await getZoomRecordings({ zoomToken, range });

  log('res', recordings)
  return res.status(200).json({ recordings });
}

module.exports = {
  recordingsController
}