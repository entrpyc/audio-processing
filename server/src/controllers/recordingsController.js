const { getZoomRecordings } = require('../services/zoomService');
const { validateRequiredParams } = require('../utils/errorHandling');

async function recordingsController(req, res) {
  if(!req?.body) return handleMissingRequestBody(req, res);
  console.log('recordingsController', req.body)

  const { zoomToken } = req.body;

  const validParams = validateRequiredParams(res, { zoomToken })
  if(!validParams) return;

  const recordings = await getZoomRecordings({ zoomToken });

  console.log('res', 'recordings')
  return res.status(200).json({ recordings });
}

module.exports = {
  recordingsController
}