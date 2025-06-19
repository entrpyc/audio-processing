const { getZoomRecordings } = require('../services/zoomService');

async function recordingsController(req, res) {
  const recordings = await getZoomRecordings();

  return res.status(200).json(recordings);
}

module.exports = {
  recordingsController
}