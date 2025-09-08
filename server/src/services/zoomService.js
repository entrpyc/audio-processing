const { formatDate } = require('../utils/formatting');
const { ZOOM_RECORDING_FILE_TYPE, ROUTE, ZOOM_AUTH_TOKEN_URL } = require('../config/constants');
const { Readable } = require('stream');
const { pipeline } = require('stream/promises');
const { writeAudio } = require('../utils/fileSystem');
const { fetchZoomRecordings } = require('../utils/zoom');
const { log } = require('../utils/logger');

const getZoomAccessToken = async () => {
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

  return data.access_token;
};

const sortZoomRecordingsByDate = (a, b) => new Date(b.dateRaw) - new Date(a.dateRaw)

const getZoomRecordings = async ({ zoomToken, range }) => {
  const recordings = await fetchZoomRecordings({ zoomToken, range });

  log('fetched', recordings)

  const recordingsMapped = recordings.map(recording => (recording && {
    id: recording.id,
    date: formatDate(recording.start_time),
    dateRaw: recording.start_time.split('T')[0],
    shareUrl: recording.share_url,
    downloadUrl: recording.recording_files.find(recording => recording.file_type === ZOOM_RECORDING_FILE_TYPE)?.download_url,
  }))

  const recordingsFiltered = recordingsMapped.filter(Boolean).filter(recording => recording.downloadUrl);

  recordingsFiltered.sort(sortZoomRecordingsByDate);

  return recordingsFiltered;
}

const downloadZoomRecording = async ({ downloadUrl, zoomToken }) => {
  const filePath = `${ROUTE.SYSTEM.UPLOADS}/zoom_recording_${Date.now()}.m4a`;

  const response = await fetch(downloadUrl, {
    headers: {
      Authorization: `Bearer ${zoomToken}`,
    },
  });

  const nodeStream = Readable.fromWeb(response.body);

  await pipeline(nodeStream, writeAudio(filePath));

  return filePath;
};
module.exports = {
  getZoomAccessToken,
  getZoomRecordings,
  downloadZoomRecording,
}