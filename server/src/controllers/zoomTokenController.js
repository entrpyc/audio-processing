const { getZoomAccessToken } = require('../services/zoomService');

async function zoomTokenController(req, res) {
  console.log('zoomTokenController')
  const zoomToken = await getZoomAccessToken();

  console.log('res', `zoomToken ${zoomToken}`)
  return res.status(200).json({ zoomToken });
}

module.exports = {
  zoomTokenController
}