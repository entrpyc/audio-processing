const { formatDate } = require('../utils/formatting');
const { ZOOM_RECORDING_FILE_TYPE, ROUTE, ZOOM_RECORDINGS_URL, ZOOM_AUTH_TOKEN_URL } = require('../config/constants');
const { Readable } = require('stream');
const { pipeline } = require('stream/promises');
const { writeAudio } = require('../utils/fileSystem');

let zoomAccessToken = '';
let zoomAccessTokenExpiresAt = 0;

const getZoomAccessToken = async () => {
  const now = Date.now();

  if (zoomAccessToken && now < zoomAccessTokenExpiresAt) {
    return zoomAccessToken;
  }

  const res = await fetch(ZOOM_AUTH_TOKEN_URL, {
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

  const response = await fetch(ZOOM_RECORDINGS_URL, {
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

const downloadZoomRecording = async ({ downloadUrl }) => {
  const filePath = `${ROUTE.SYSTEM.UPLOADS}/zoom_recording_${Date.now()}.m4a`;
  const response = await fetch(downloadUrl);
  const nodeStream = Readable.fromWeb(response.body);

  await pipeline(
    nodeStream,
    writeAudio(filePath)
  );

  return filePath;
}

module.exports = {
  getZoomAccessToken,
  getZoomRecordings,
  downloadZoomRecording,
}