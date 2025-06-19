const { formatDate } = require('../utils/formatting');
const { ZOOM_RECORDING_FILE_TYPE } = require('../config/constants');

let zoomAccessToken = '';
let zoomAccessTokenExpiresAt = 0;

const getZoomAccessToken = async () => {
  const now = Date.now();

  if (zoomAccessToken && now < zoomAccessTokenExpiresAt) {
    return zoomAccessToken; // Use cached token
  }

  const res = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'account_credentials',
      account_id: process.env.ZOOM_ACCOUNT_ID,
    }).toString(),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.reason || 'Failed to fetch token');

  zoomAccessToken = data.access_token;
  zoomAccessTokenExpiresAt = Date.now() + data.expires_in * 1000 - 10_000;

  return zoomAccessToken;
};

const getZoomRecordings = async () => {
  const zoomAcessToken = await getZoomAccessToken();

  const response = await fetch(`${process.env.ZOOM_RECORDINGS_URL}?from=2025-01-01`, {
    headers: {
      Authorization: `Bearer ${zoomAcessToken}`,
      'Content-Type': 'application/json',
    }
  })

  const data = await response.json();

  if (!response.ok) {
    console.error('Zoom API Error:', data);
    throw new Error(data.message || 'Failed to fetch recordings');
  }

  const mappedRecordings = data.meetings.map(recording => ({
    id: recording.id,
    date: formatDate(recording.start_time),
    dateRaw: recording.start_time.split('T')[0],
    shareUrl: recording.share_url,
    downloadUrl: recording.recording_files.find(recording => recording.file_type === ZOOM_RECORDING_FILE_TYPE).download_url,
  }))

  return mappedRecordings;
}

module.exports = {
  getZoomAccessToken,
  getZoomRecordings,
}