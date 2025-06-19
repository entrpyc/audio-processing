const { getZoomRecordings } = require('../services/zoomService');

async function recordingsController(req, res) {
  try {
    const recordings = await getZoomRecordings();

    return res.status(200).json(recordings);

  } catch (error) {
    console.error('Zoom recordings fetch failed:', error?.message || error);
    res.status(500).json({ error: 'Failed to fetch Zoom recordings' });
  }
}

module.exports = {
  recordingsController
}