const { getZoomAccessToken } = require('../services/zoomService');

async function recordingsController(req, res) {
  const zoomToken = await getZoomAccessToken();

  console.log('res', 'zoomToken')
  return res.status(200).json({ zoomToken });
}

module.exports = {
  recordingsController
}