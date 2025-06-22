const { getZoomAccessToken } = require('../services/zoomService');

async function recordingsController(req, res) {
  console.log('recordingsController')
  const zoomToken = await getZoomAccessToken();

  console.log('res', `zoomToken ${zoomToken}`)
  return res.status(200).json({ zoomToken });
}

module.exports = {
  recordingsController
}