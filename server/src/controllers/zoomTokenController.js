const { getZoomAccessToken } = require('../services/zoomService');
const { log } = require('../utils/logger');

async function zoomTokenController(req, res) {
  const zoomToken = await getZoomAccessToken();

  log('res', `zoomToken ${zoomToken}`)
  return res.status(200).json({ zoomToken });
}

module.exports = {
  zoomTokenController
}