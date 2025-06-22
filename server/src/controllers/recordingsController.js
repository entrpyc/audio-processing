const { getZoomRecordings } = require('../services/zoomService');

async function recordingsController(req, res) {
  if(!req?.body) return handleMissingRequestBody(req, res);
  const { zoomToken } = req.body;

  const validParams = validateRequiredParams(res, { zoomToken })
  if(!validParams) return;

  const recordings = await getZoomRecordings({ zoomToken });

  console.log('res', 'recordings')
  return res.status(200).json(recordings);
}

module.exports = {
  recordingsController
}